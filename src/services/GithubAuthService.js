import deepGet from 'lodash/get';
import assignIn from 'lodash/assignIn';
import Toast from '../theme/components/NotificationToast';
import { upsertInviteCode } from '../actions';
import Store from '../store';

let LoginPopoverActions = null;
import('../components/LoginPopover').then((pack) => {
  LoginPopoverActions = pack.LoginPopoverActions;
});

let CurrentUser;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

let Utilities;
import('./Utilities').then((imports) => {
  Utilities = imports.default;
});

import GitHubOAuth from './ExternalLogin/GitHubOAuth';
import AppConfig from '../constants/AppConfig';
import NavigationService from './NavigationService';
import { navigateTo } from '../helpers/navigateTo';
import Pricer from './Pricer';
import DataContract from '../constants/DataContract';
import PixelCall from './PixelCall';

class GithubAuthService {
  async signUp(paramsFromService) {
    LoginPopoverActions.showConnecting();
    let params = this.getParams(paramsFromService);

    if (params) {
      let inviteCode = await Utilities.getItem(AppConfig.appInstallInviteCodeASKey);
      if (inviteCode) {
        params['invite_code'] = inviteCode;
      }
      this.githubConnect(params)
        .then((res) => {
          if (res && res.success) {
            this.onSuccess(res);
          } else {
            this.onServerError(res);
          }
        })
        .catch((err) => {
          this.onServerError(err);
        })
        .finally(() => {
          LoginPopoverActions.hide();
        });
    } else {
      LoginPopoverActions.hide();
    }
  }


  getParams (params){
    console.log(params, 'paramsFromServiceparamsFromService');
    return {
      access_token: params.access_token
    }
  }

  onSuccess(res) {
    this.pixelDrop(res);
    Utilities.removeItem(AppConfig.appInstallInviteCodeASKey);
    Store.dispatch(upsertInviteCode(null));
    Pricer.getBalance();
    if (this.handleGoTo(res)) {
      return;
    }
    navigateTo.navigationDecision();
  }

  pixelDrop( res={} ){
    const data = res.data|| {},
      meta = data.meta;
    if(meta && !!meta.is_registration){
      const resultType = deepGet(res , DataContract.common.resultType ) ,
        entity = deepGet(res, `data.${resultType}` , {}),
        utm = data["utm_params"]  ,
        inviteCode = meta["invite_code"] ,
        createdAt = entity['uts'],
        pixelParams = this.getPixeDropParams(createdAt , inviteCode , utm )
      ;
      PixelCall( pixelParams );
    }
  }

  getPixeDropParams(createdAt, inviteCode , utm){
    let params = {
      e_entity: "user",
      e_action: "registration",
      p_type: "signin",
      p_name: "github"
    }
    if(createdAt){
      params["registration_at"] = createdAt;
    }
    if(inviteCode){
      params["invite_code"] = inviteCode;
    }
    if(utm){
      params = assignIn({}, params , utm );
    }
    return params ;
  }

  logout() {
    GitHubOAuth.signOut();
  }

  onServerError(error) {
    if (this.handleGoTo(error)) {
      return;
    }
    Toast.show({
      text: 'Unable to login with Github',
      icon: 'error'
    });
  }

  handleGoTo(res) {
    //On success goto can be handled by the generic utility
    if (navigateTo.handleGoTo(res)) {
      return true;
    }
    let errorData = deepGet(res, 'err.error_data');
    if (res && this.isInviteCodeError(errorData)) {
      //Goto invite screen
      NavigationService.navigate('InviteCodeScreen');
      return true;
    }
    return false;
  }

  githubConnect(params) {
    return CurrentUser._signin('/auth/github-login', params);
  }

  isInviteCodeError(errorObj) {
    for (i in errorObj) {
      if (errorObj[i].parameter === 'invite_code') {
        return true;
      }
    }
    return false;
  }
}

export default new GithubAuthService();
