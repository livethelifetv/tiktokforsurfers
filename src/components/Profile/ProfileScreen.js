import React, { Component } from 'react';
import currentUserModel from '../../models/CurrentUser';
import FeedList from '../FeedComponents/FeedList';
import {View, Button} from 'react-native';
import BalanceHeader from '../Profile/BalanceHeader';
import LogoutComponent from '../LogoutLink';
import deepGet from 'lodash/get';

class ProfileScreen extends Component {
  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      headerTitle: 'Profile',
      headerRight: <LogoutComponent {...options} />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      toRefresh: false,
      refreshBalance: false
    };
    this.fetchUrl = `/users/${currentUserModel.getUserId()}/feeds`;
    this.eventSubscription = null;
    this.props.navigation.tab = 'Profile';
  }

  componentDidMount() {
    this.eventSubscription =
      this.props.navigation &&
      this.props.navigation.addListener('didFocus', (payload) => {
        let toRefresh = deepGet(payload, 'action.params.toRefresh');
        toRefresh && this.setState({ toRefresh: toRefresh });
      });
  }

  componentWillUnmount() {
    this.eventSubscription && this.eventSubscription.remove();
  }

  beforeRefresh() {
    if (!this.state.refreshBalance) {
      this.setState({ refreshBalance: true });
    }
  }

  onRefresh() {
    this.setState({ toRefresh: false, refreshBalance: false });
  }

  onRefreshError() {
    this.setState({ toRefresh: false, refreshBalance: false });
  }
  navigateToVideo(){
    this.props.navigation.navigate('CaptureVideo');

  }

  render() {
    return (
      <View>
      <Button onPress={()=> {this.navigateToVideo()}} title='Record a video'></Button>
      <FeedList
        style={{ backgroundColor: '#f6f6f6', flex: 1 }}
        fetchUrl={this.fetchUrl}
        toRefresh={this.state.toRefresh}
        ListHeaderComponent={<BalanceHeader toRefresh={this.state.refreshBalance} />}
        beforeRefresh={() => {
          this.beforeRefresh();
        }}
        onRefresh={(res) => {
          this.onRefresh(res);
        }}
        onRefreshError={(error) => {
          this.onRefreshError(error);
        }}
      ></FeedList>
      </View>
    );
  }
}

export default ProfileScreen;
