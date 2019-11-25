import React, { PureComponent } from 'react';
import { Text, View, ScrollView, ListView, Dimensions} from 'react-native';
import { withNavigation } from 'react-navigation';

import Pagination from "../../../services/Pagination";
import {FlatList} from 'react-native-gesture-handler';
import ReplyHelper from '../../../helpers/ReplyHelper';
import AppConfig from "../../../constants/AppConfig";
import DataContract from '../../../constants/DataContract';
import PepoApi from "../../../services/PepoApi";
import deepGet from "lodash/get";
import ProfilePicture from "../../ProfilePicture";
import reduxGetter from "../../../services/ReduxGetters";

//
const NO_OF_ITEMS_TO_SHOW = 3;

class BubbleList extends PureComponent {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
    this.getDataWhileLoading();
    this.replyCount =  reduxGetter.getVideoReplyCount(this.props.videoId)
  }

  componentDidUpdate(prevProps, prevState ) {
    if( this.props.doRender && this.props.doRender !== prevProps.doRender  ){
      this.getListData();
    }

  }

  getDataWhileLoading(){
    if (this.props.doRender){
      this.getListData();
    }
  };

  getListData = () => {
    return new PepoApi(this.getFetchUrl())
      .get()
      .then((apiResponse) => {
        if (apiResponse.success ){
          let result_type = deepGet(apiResponse, DataContract.common.resultType),
            list = deepGet(apiResponse, `data.${result_type}` ),
            listToShowOnUI = list.reverse().slice(0,NO_OF_ITEMS_TO_SHOW);
            this.setState({ list : listToShowOnUI } );
        }

      })
      .catch((err) => {
        console.log(err);
      });

  };


  getFetchUrl = () => {
    return `/videos/${4266}/replies`;
    return `/videos/${this.props.videoId}/replies`;
  };


  getBubbleListJSX = () => {
    let listToRender = this.state.list;
    return listToRender.length?listToRender.map((item) => {
      return <ProfilePicture userId={this.props.parentUserId}
      //                 style={{height: AppConfig.thumbnailListConstants.parentIconHeight,
      //   width: AppConfig.thumbnailListConstants.parentIconWidth,
      //   borderRadius: AppConfig.thumbnailListConstants.parentIconWidth /2,
      //   marginVertical: 12
      // }}
      />
    }): <></> ;
  };

  moreReplyText = () => {

    let list = this.state.list;
    if (list.length <= this.replyCount  ){
      return '';
    }
    return `+ ${this.replyCount - list.length} Replies`;
  };

  render() {
    return <View style={{flexDirection:'row'}}>
        <View style={{flexDirection: 'row' }}>{this.getBubbleListJSX()}</View>
        <View><Text>{this.moreReplyText()}</Text></View>
      </View>
  }
}


//make this component available to the app
export default BubbleList;
