import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  Switch,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  Modal
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import FormInput from '../../../theme/components/FormInput';
import TouchableButton from '../../../theme/components/TouchableButton';
import { ostErrors } from '../../../services/OstErrors';
import CircleCloseIcon from '../../../assets/circle_close_icon.png';
import Theme from '../../../theme/styles';
import inlineStyles from '../Style';

export default class EditTxModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.getState();
    this.priceOracle = props.getPriceOracle();
  }

  getState() {
    return {
      btAmount: this.props.btAmount,
      btUSDAmount: this.props.btUSDAmount,
      clearErrors: false,
      btAmountErrorMsg: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showTxModal != this.props.showTxModal && this.props.showTxModal) {
      this.setState(this.getState());
    }
  }

  onBtChange(bt) {
    const usd = this.priceOracle.btToFiat(bt);
    this.setState({ btAmount: bt, btUSDAmount: usd });
    if (bt > 0) {
      this.setState({ btAmountErrorMsg: null, clearErrors: true });
    }
  }

  onUSDChange(usd) {
    const bt = this.priceOracle.fiatToBt(usd);
    this.setState({ btAmount: bt, btUSDAmount: usd });
  }

  onConfirm = () => {
    let btAmount = this.state.btAmount;
    btAmount = btAmount && Number(btAmount);
    if (btAmount <= 0) {
      this.setState({ btAmountErrorMsg: ostErrors.getUIErrorMessage('bt_amount_error'), clearErrors: false });
      return;
    }
    this.props.onAmountModalConfirm(this.state.btAmount, this.state.btUSDAmount);
  };

  render() {
    console.log('I am hereeeeeeeee in render');
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showTxModal}
        onRequestClose={() => {
          this.props.onModalClose();
        }}
      >
        <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={200} keyboardShouldPersistTaps="always">
          <View style={{ height: Dimensions.get('window').height }}>
            <View style={inlineStyles.modalBackDrop}>
              <View style={inlineStyles.modelWrapper}>
                <View>
                  <TouchableOpacity
                    style={inlineStyles.modalCloseBtnWrapper}
                    onPress={() => {
                      this.props.onModalClose();
                    }}
                  >
                    <Image source={CircleCloseIcon} style={inlineStyles.crossIconSkipFont} />
                  </TouchableOpacity>
                </View>
                <View style={inlineStyles.modalContentWrapper}>
                  <Text style={inlineStyles.modalHeader}>Enter The Amount you want to send</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.7 }}>
                      <FormInput
                        editable={true}
                        onChangeText={(val) => this.onBtChange(val)}
                        placeholder="BT"
                        fieldName="bt_amount"
                        style={Theme.TextInput.textInputStyle}
                        value={`${this.state.btAmount}`}
                        placeholderTextColor="#ababab"
                        errorMsg={this.state.btAmountErrorMsg}
                        clearErrors={this.state.clearErrors}
                        keyboardType="numeric"
                        isFocus={true}
                        blurOnSubmit={false}
                      />
                    </View>
                    <View style={{ flex: 0.3 }}>
                      <TextInput
                        editable={false}
                        style={[Theme.TextInput.textInputStyle, inlineStyles.nonEditableTextInput]}
                      >
                        <Text>PEPO</Text>
                      </TextInput>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.7 }}>
                      <FormInput
                        editable={true}
                        onChangeText={(val) => this.state.onUSDChange(val)}
                        value={`${this.state.btUSDAmount}`}
                        placeholder="USD"
                        fieldName="usd_amount"
                        style={Theme.TextInput.textInputStyle}
                        placeholderTextColor="#ababab"
                        clearErrors={this.state.clearErrors}
                        keyboardType="numeric"
                        blurOnSubmit={true}
                      />
                    </View>
                    <View style={{ flex: 0.3 }}>
                      <TextInput
                        editable={false}
                        style={[Theme.TextInput.textInputStyle, inlineStyles.nonEditableTextInput]}
                      >
                        <Text>USD</Text>
                      </TextInput>
                    </View>
                  </View>
                  <TouchableButton
                    TouchableStyles={[Theme.Button.btnPink, { marginTop: 10 }]}
                    TextStyles={[Theme.Button.btnPinkText]}
                    text="CONFIRM"
                    onPress={() => {
                      this.onConfirm();
                    }}
                  />
                  <Text style={{ textAlign: 'center', paddingTop: 10, fontSize: 13 }}>
                    Your Current Balance: P{this.props.balance}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    );
  }
}
