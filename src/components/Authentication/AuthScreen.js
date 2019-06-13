import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import PepoApi from '../../services/PepoApi';

// components
import TouchableButton from '../../theme/components/TouchableButton';
import FormInput from '../../theme/components/FormInput';
import deepGet from 'lodash/get';
import Theme from '../../theme/styles';
import styles from './styles';
import PepoIcon from '../../assets/pepo_logo.png';
import InitWalletSdk from '../../services/InitWalletSdk';
import LoadingModal from '../LoadingModal';
import ErrorMessages from '../../constants/ErrorMessages';
import { showModal, hideModal } from '../../actions';

const userStatusMap = {
  activated: 'activated'
};

const signUpLoginTestMap = {
  signup: 'Signing up...',
  signin: 'Login in...'
};

let userStatus = '';

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.defaults = {
      general_error: null,
      last_name_error: null,
      first_name_error: null,
      password_error: null,
      user_name_error: null,
      server_errors: {},
      clearErrors: true,
      errorMsg: ''
    };
    this.state = {
      first_name: null,
      last_name: null,
      user_name: null,
      password: null,
      signup: false,
      isLoginIn: false,
      server_errors: {},
      clearErrors: false,
      ...this.defaults
    };
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.removeItem(item);
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
    }
  }

  validateLoginInput() {
    let isValid = true;
    if (!this.state.user_name) {
      this.setState({ user_name_error: ErrorMessages.user_name });
      isValid = false;
    }

    if (!this.state.password) {
      this.setState({
        password_error: ErrorMessages.password
      });
      isValid = false;
    }

    return isValid;
  }

  validateSignInInput() {
    let isValid = true;

    if (!this.validateLoginInput()) {
      isValid = false;
    }

    if (!this.state.first_name) {
      this.setState({
        first_name_error: ErrorMessages.first_name
      });
      isValid = false;
    }

    if (!this.state.last_name) {
      this.setState({
        last_name_error: ErrorMessages.last_name
      });
      isValid = false;
    }

    return isValid;
  }

  isValidInputs() {
    if (this.state.signup) {
      return this.validateSignInInput();
    } else {
      return this.validateLoginInput();
    }
  }

  clearError() {
    this.setState(this.defaults);
  }

  signin() {
    this.clearError();

    if (!this.isValidInputs()) {
      this.setState({ clearErrors: false });
      return;
    }

    this.props.dispatch(showModal(this.state.signup ? signUpLoginTestMap.signup : signUpLoginTestMap.signin));

    let authApi = new PepoApi(this.state.signup ? '/auth/sign-up' : '/auth/login');
    let userSaltApi = new PepoApi('/users/recovery-info');

    authApi
      .setNavigate(this.props.navigation.navigate)
      .post(JSON.stringify(this.state))
      .then((res) => {
        if (res.success && res.data) {
          let resultType = deepGet(res, 'data.result_type'),
            userData = deepGet(res, 'data.' + resultType);

          if (!userData) {
            this.props.dispatch(hideModal());
            this.setState({
              general_error: ErrorMessages.user_not_found
            });
            return;
          }

          userSaltApi
            .setNavigate(this.props.navigation.navigate)
            .get()
            .then(async (res) => {
              if (res.success && res.data) {
                let resultType = deepGet(res, 'data.result_type'),
                  userSalt = deepGet(res, `data.${resultType}.scrypt_salt`);

                if (!userSalt) {
                  this.props.dispatch(hideModal());
                  this.setState({
                    general_error: ErrorMessages.user_not_found
                  });
                  return;
                }

                this.saveItem(
                  'user',
                  JSON.stringify({
                    user_details: userData,
                    user_pin_salt: userSalt
                  })
                ).then(() => {
                  userStatus = (userData && userData['ost_status']) || '';
                  InitWalletSdk.initializeDevice(this);
                });
              } else {
                this.props.dispatch(hideModal());
                this.onServerError(res);
              }
            });
        } else {
          this.props.dispatch(hideModal());
          this.onServerError(res);
        }
      })
      .catch((err) => {
        this.props.dispatch(hideModal());
        this.onServerError(err);
      });
  }

  setupDeviceComplete(ostWorkflowContext, ostContextEntity) {
    console.log('setup devices complete ostWorkflowContext', ostWorkflowContext);
    console.log('setup devices complete ostContextEntity ', ostContextEntity);
    this.props.dispatch(hideModal());
    if (userStatus.toLowerCase() === userStatusMap.activated) {
      this.props.navigation.navigate('HomeScreen');
    } else {
      this.props.navigation.navigate('SetPinScreen');
    }
  }

  setupDeviceFailed(ostWorkflowContext, ostError) {
    console.log('setup devices complete ostWorkflowContext', ostWorkflowContext);
    console.log('setup devices complete ostError ', ostError);
    const errorMessage =
      (ostError && ostError.getApiErrorMessage()) || ostError.getErrorMessage() || ErrorMessages.general_error;
    this.props.dispatch(hideModal());
    this.setState({ general_error: errorMessage });
  }

  onServerError(res) {
    let stateObj = { server_errors: res, clearErrors: false };
    const errorData = deepGet(res, 'err.error_data'),
      errorMsg = deepGet(res, 'err.msg') || ErrorMessages.general_error;
    if (!(errorData && errorData.length)) {
      stateObj['general_error'] = errorMsg;
    }
    this.setState(stateObj);
  }

  ServerErrorHandler(field) {
    console.log('In ServerErrorHandler', field);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 25 }} />
        <View style={styles.form}>
          <Image source={PepoIcon} style={styles.imgPepoLogoSkipFont} />
          {this.state.signup && (
            <React.Fragment>
              <FormInput
                editable={true}
                onChangeText={(first_name) => this.setState({ first_name, error: null })}
                fieldName="first_name"
                returnKeyType="next"
                value={this.state.first_name}
                style={Theme.TextInput.textInputStyle}
                placeholder="First Name"
                returnKeyType="next"
                returnKeyLabel="next"
                errorMsg={this.state.first_name_error}
                serverErrors={this.state.server_errors}
                clearErrors={this.state.clearErrors}
                errorHandler={(fieldName) => {
                  this.ServerErrorHandler(fieldName);
                }}
              />

              <FormInput
                editable={true}
                onChangeText={(last_name) => this.setState({ last_name, error: null })}
                fieldName="last_name"
                returnKeyType="next"
                value={this.state.last_name}
                style={Theme.TextInput.textInputStyle}
                placeholder="Last Name"
                returnKeyType="next"
                returnKeyLabel="next"
                maxLength={5}
                errorMsg={this.state.last_name_error}
                serverErrors={this.state.server_errors}
                clearErrors={this.state.clearErrors}
                errorHandler={(fieldName) => {
                  this.ServerErrorHandler(fieldName);
                }}
              />
            </React.Fragment>
          )}

          <FormInput
            editable={true}
            onChangeText={(user_name) => this.setState({ user_name, error: null })}
            fieldName="user_name"
            returnKeyType="next"
            value={this.state.user_name}
            style={Theme.TextInput.textInputStyle}
            placeholder="Username"
            returnKeyType="next"
            returnKeyLabel="next"
            errorMsg={this.state.user_name_error}
            clearErrors={this.state.clearErrors}
            serverErrors={this.state.server_errors}
            errorHandler={(fieldName) => {
              this.ServerErrorHandler(fieldName);
            }}
          />

          <FormInput
            editable={true}
            onChangeText={(password) => this.setState({ password, error: null })}
            placeholder="Password"
            fieldName="password"
            returnKeyType="next"
            secureTextEntry={true}
            style={Theme.TextInput.textInputStyle}
            value={this.state.password}
            returnKeyType="done"
            returnKeyLabel="done"
            errorMsg={this.state.password_error}
            serverErrors={this.state.server_errors}
            clearErrors={this.state.clearErrors}
            errorHandler={(fieldName) => {
              this.ServerErrorHandler(fieldName);
            }}
          />

          <Text style={[styles.error]}>{this.state.error}</Text>
          {!this.state.signup && (
            <React.Fragment>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnPrimary]}
                TextStyles={[Theme.Button.btnPrimaryText]}
                text="Log In"
                onPress={this.signin.bind(this)}
              />
            </React.Fragment>
          )}
          {this.state.signup && (
            <React.Fragment>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnPrimary]}
                TextStyles={[Theme.Button.btnPrimaryText]}
                text="Create Account"
                onPress={this.signin.bind(this)}
              />
            </React.Fragment>
          )}
        </View>
        <LoadingModal />
        <View style={styles.bottomBtnAndTxt}>
          {!this.state.signup && (
            <TouchableOpacity onPress={() => this.setState({ signup: true, error: null, ...this.defaults })}>
              <Text style={styles.label}>Don't have an account?</Text>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
          )}
          {this.state.signup && (
            <TouchableOpacity onPress={() => this.setState({ signup: false, error: null, ...this.defaults })}>
              <Text style={styles.label}>Already have an account?</Text>
              <Text style={styles.link}>Log In</Text>
            </TouchableOpacity>
          )}

          <Text style={Theme.Errors.errorText}>{this.state.general_error}</Text>
        </View>
      </View>
    );
  }
}

export default AuthScreen;
