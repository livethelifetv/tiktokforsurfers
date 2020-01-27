import React, { PureComponent } from 'react';
import { TouchableOpacity, View, Image, BackHandler, AppState, Text } from 'react-native';
import Video from 'react-native-video';
import NavigationService from '../../services/NavigationService';
import ProgressBar from './ProgressBarWrapper';
import playIcon from '../../assets/preview_play_icon.png';
import Store from '../../store';
import { upsertRecordedVideo, videoInProcessing } from '../../actions';
import { ActionSheet } from 'native-base';
import styles from './styles';
import closeIcon from '../../assets/camera-cross-icon.png';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import multipleClickHandler from '../../services/MultipleClickHandler';
import AppConfig from '../../constants/AppConfig';

const ACTION_SHEET_BUTTONS = ['Reshoot', 'Discard', 'Cancel'];
const ACTION_SHEET_CANCEL_INDEX = 2;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 1;
const ACTION_SHEET_RESHOOT_INDEX = 0;

class PreviewRecordedVideo extends PureComponent {
  constructor(props) {
    super(props);

    this.videoUrlsList = this.props.videoUrlsList;
    this.state = {
      progress: 0,
      currentActiveComponent: 'video-component-0',
      paused: true
    };
    this._progressRef = null;
    this.indexOfVideo = 0;
    this.nextUrlComponentZero = this.videoUrlsList[0] || {};
    this.nextUrlComponentOne = {};
    this.completedVideosDuration = 0;
    this.currentVideoDuration = 0;
    this.pauseVideo = false;
    this._video = null;
    this.seekCount = 0;
    this.currentTime = 0;
    this.duration = 0;
    this.totalVideoLength = this.props.totalVideoLength;
    this.appStateTimeOut = 0;
    // this.nextUrlComponentZero = this.videoUrlsList[0];


    this.currentTime = 0;
    this.duration = 0;
    this.seekCount = 0;
    this.appStateTimeOut = 0;
    // this.cachedVideoUri = this.props.cachedvideoUrl;

    this.cancleVideoHandling = this.cancleVideoHandling.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    AppState.addEventListener('change', this._handleAppStateChange);

    Store.dispatch(upsertRecordedVideo({ raw_video_list: this.videoUrlsList, video_length: this.totalVideoLength }));

    // Store.dispatch(upsertRecordedVideo({ raw_video: this.cachedVideoUri }));

    this.didFocus = this.props.navigation.addListener('didFocus', (payload) => {
      this.playVideo();
    });
    this.willBlur = this.props.navigation.addListener('willBlur', (payload) => {
      this.pauseVideo();
    });
    setTimeout(()=> {
     if(!this.shouldPlay()) return;
      this.playVideo();
    }, 100)
  }

  playVideo(state={}){
    state["paused"] = false;
    this.setState(state);
  }

  pauseVideo(state={}){
    state["paused"] = true;
    this.setState(state);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.didFocus && this.didFocus.remove && this.didFocus.remove();
    this.willBlur.remove();
  }

  _handleAppStateChange = (nextAppState) => {
    clearTimeout(this.appStateTimeOut);
    this.appStateTimeOut = setTimeout(()=> {
      let currentRoute = NavigationService.findCurrentRoute();
      if(currentRoute !== 'CaptureVideo') return;
      if (nextAppState === 'active' ) {
        this.playVideo();
      }else {
        this.pauseVideo();
      }
    } , 100)
  };

  handleBackButtonClick = () => {
    if (this.props.navigation.isFocused()) {
      this.cancleVideoHandling();
      return true;
    }
  };

  handleProgress = (progress) => {

    console.log(this.completedVideosDuration, 'this.completedVideosDuration');
    console.log(  progress.currentTime, 'progress.currentTime');
    console.log(this.totalVideoLength, 'totalVideoLength');
    let totalProgress = (this.completedVideosDuration / 1000) + progress.currentTime;
    this.setState({
      progress: totalProgress / (this.totalVideoLength/1000)
    });
  };

  handleEnd = () => {
    console.log('handleEnd-------====-------',
      this.videoUrlsList,
      this.videoUrlsList[this.indexOfVideo].progress * 100 * 300);
    this.completedVideosDuration += this.currentVideoDuration;
    this.currentVideoDuration = this.videoUrlsList[this.indexOfVideo].progress * 100 * 300;

    if (this.videoUrlsList.length - 1 === this.indexOfVideo) {
      this.setState({progress: 1});
      if (this.videoUrlsList.length === 1) {
        this.indexOfVideo = 1;
        // This is hack to replay single video\.
      }
    } else {
      this.indexOfVideo = this.indexOfVideo + 1;
      // this.setState({indexOfVideo:  this.state.indexOfVideo + 1});
      setTimeout(() => {
        this.setState(
          {
            currentActiveComponent: this.state.currentActiveComponent === 'video-component-1'
              ? 'video-component-0' :
              'video-component-1'
          })
      }, 1)

    }
    ;
  }

    // handleProgress = ()=>{
    // if(this.isPaused()) return;
    // this.currentTime = progress.currentTime;
    // this.updateProgress(progress.currentTime / this.duration);
    // };

  // handleLoad = (meta) => {
  //   this.duration = meta.duration;
  //   Store.dispatch(upsertRecordedVideo({ video_length : meta.duration }));
  // };

  // handleEnd = () => {
  //   this.currentTime = this.duration;
  //   this.seekCount = 0;
  //   this.pauseVideo();
  //   this.updateProgress(1);
  //
  // };

  cancleVideoHandling() {
    ActionSheet.show(
      {
        options: ACTION_SHEET_BUTTONS,
        cancelButtonIndex: ACTION_SHEET_CANCEL_INDEX,
        destructiveButtonIndex: ACTION_SHEET_DESCTRUCTIVE_INDEX,
        title: 'Discard or reshoot?'
      },
      (buttonIndex) => {
        if (buttonIndex == ACTION_SHEET_RESHOOT_INDEX) {
          // This will take to VideoRecorder component
          Store.dispatch(
            upsertRecordedVideo({
              do_discard: true
            })
          );
          this.props.saveVideoPrimaryInfo();
          this.props.goToRecordScreen();
        } else if (buttonIndex == ACTION_SHEET_DESCTRUCTIVE_INDEX) {
          this.props.navigation.goBack(null);
          Store.dispatch(
            upsertRecordedVideo({
              do_discard: true
            })
          );
          Store.dispatch(videoInProcessing(false));
        }
      }
    );
  }


  setRef = (ref) => {
    this._video = ref;
  }

  setProgressBarRef = (ref) => {
    this._progressRef = ref;
  }

  updateProgress = (val) => {
    this._progressRef && this._progressRef.updateProgress(val);
  }

  isPaused(){
    return this.state.paused || !this.shouldPlay();
  }

  shouldPlay(){
    return AppState.currentState === AppConfig.appStateMap.active;
  }

  showVideoComp = () => {
    const isShowingComponent1 = this.state.currentActiveComponent === 'video-component-0';
    const isShowingComponent2 = !isShowingComponent1;
    console.log(isShowingComponent1, 'isShowingComponent1');
    console.log(isShowingComponent2, 'isShowingComponent2');
    console.log(this.nextUrlComponentOne, this.nextUrlComponentZero, '===++++=====++++====+====+=+=+==');

    return <View style={{flex: 1}}>
      <Video
        source={{uri: this.nextUrlComponentZero.uri || 'INVALID'}}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          flex: (isShowingComponent1 ? 1 : 0)
        }}
        onPlaybackRateChange={this.onPlaybackRateChange}
        posterResizeMode={'cover'}
        resizeMode={'cover'}
        onProgress={this.handleProgress}
        onEnd={this.handleEndZero}
        repeat={true}
        ref={(component) => {
          // if (this.state.indexOfVideo == 0) {
          //   this._video = component
          // }
        }}
        paused={isShowingComponent1 ? this.pauseVideo : true}
      />
      <Video
        source={{uri: this.nextUrlComponentOne.uri || 'INVALID'}}
        style={{
          flex: isShowingComponent2 ? 1 : 0
        }}
        posterResizeMode={'cover'}
        resizeMode={'cover'}
        onProgress={this.handleProgress}
        onEnd={this.handleEndOne}
        repeat={true}
        // ref={(component) =>   { if(this.indexOfVideo == 0){ this._video = component } }}
        paused={isShowingComponent2 ? this.pauseVideo : true}
      />
    </View>
  }

  onPlaybackRateChange = (args) => {
    if(this.isPaused()) return;
    const playRate = args && args.playbackRate;
    /*
    * PlayRate is zero that means its video start or paused in between.
    * this.state.progress > 0  that means video hard started playing
    * !this.pauseVideo that means video is expedted to play
    * The below condition says that video was accidentally paused as playRate = 0 , but pauseVideo is false and video had progress.
    * */
    if (playRate == 0 && this.currentTime > 0 && !this.isPaused() ){
      this.seekCount++;
      if (this.seekCount <= 3 ) {
        this._video && this._video.seek(this.currentTime);
      } else {
        // this.pauseVideo();
      }
    }}



  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <Video
  //         ref={this.setRef}
  //         source={{ uri: this.cachedVideoUri }}
  //         style={{flex:1}}
  //         onPlaybackRateChange={this.onPlaybackRateChange}
  //
  //         posterResizeMode={'cover'}
  //         resizeMode={'cover'}
  //         onProgress={this.handleProgress}
  //
  //         onEnd={this.handleEndZero}
  //         ref={(component) => {
  //           // if (this.state.indexOfVideo == 0) {
  //           //   this._video = component
  //           // }
  //         }}
  //         paused={isShowingComponent1 ? this.pauseVideo : true}
  //       />
  //       <Video
  //         source={{ uri: this.nextUrlComponentOne.uri || 'INVALID' }}
  //         style={{
  //           flex: isShowingComponent2 ? 1 : 0
  //         }}
  //         posterResizeMode={'cover'}
  //         resizeMode={'cover'}
  //         onProgress={this.handleProgress}
  //         onEnd={this.handleEndOne}
  //         // ref={(component) =>   { if(this.indexOfVideo == 0){ this._video = component } }}
  //         paused={isShowingComponent2 ? this.pauseVideo : true}
  //       />
  //     </View>
  // };


  handleEndOne = () => {
    console.log('handleEndOne', this.indexOfVideo );
    this.nextUrlComponentZero =  this.getNextVideoUri();
    // this.setState ({nextUrlComponentOne : this.videoUrlsList[this.state.indexOfVideo + 1]});
    this.handleEnd();


  };

  handleEndZero = () => {
    console.log('handleEndZero', this.indexOfVideo );
    this.nextUrlComponentOne = this.getNextVideoUri();
    // this.setState ({nextUrlComponentOne : this.videoUrlsList[this.state.indexOfVideo + 1]});
    this.handleEnd();
  };

  getNextVideoUri = () => {
    return this.videoUrlsList[this.indexOfVideo + 1] || {} ;
  };


  render() {
    return (
      <View style={styles.container}>
        {this.showVideoComp()}

        <ProgressBar ref={this.setProgressBarRef}/>
        <TouchableOpacity onPressIn={this.cancleVideoHandling} style={styles.closeBtWrapper}>
          <Image style={styles.closeIconSkipFont} source={closeIcon} />
        </TouchableOpacity>

        <View style={styles.bottomControls}>
          <View style={{flex :1}}></View>
          <View style={{flex :1, alignItems: 'center', justifyContent: 'center'}}>
            {this.isPaused() ? (
              <TouchableOpacity
                onPress={() => {
                  this.replay();
                }}
              >
                <Image style={styles.playIconSkipFont} source={playIcon} />
              </TouchableOpacity>
            ) : (
              <View style={styles.playIconSkipFont} />
            )}
          </View>

            <View style={{flex :1, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{ flexDirection: 'row' }}>
                <LinearGradient
                  colors={['#ff7499', '#ff5566']}
                  locations={[0, 1]}
                  style={{
                    borderRadius: 0,
                    borderTopLeftRadius: 3,
                    borderBottomLeftRadius: 3,
                    paddingLeft: 15,
                    paddingRight: 10
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <TouchableOpacity
                    onPress={multipleClickHandler(() => {
                      this.props.goToDetailsScreen();
                    })}
                    style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: '#fff', fontSize: 16 }}>NEXT</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <View style={styles.triangleRight}></View>
              </View>
            </View>
        </View>
      </View>
    );
  }

  replay() {

    this.completedVideosDuration = 0;
    this.currentVideoDuration = 0;
    this.indexOfVideo  = 0;
    if (this.state.currentActiveComponent === 'video-component-0') {
      this.nextUrlComponentOne = this.videoUrlsList[this.indexOfVideo] || {};
      this.nextUrlComponentZero = {};
      this.setState( {
        progress: 0,
        currentActiveComponent:'video-component-1'
      });
    } else if (this.state.currentActiveComponent === 'video-component-1') {
      this.nextUrlComponentOne = {};
      this.nextUrlComponentZero = this.videoUrlsList[this.indexOfVideo] || {};
      this.setState( {
        progress: 0,
        currentActiveComponent:'video-component-0'
      });
    }

    // this.playVideo();
    // this.updateProgress(0);

  }
}

//make this component available to the app
export default withNavigation(PreviewRecordedVideo);
