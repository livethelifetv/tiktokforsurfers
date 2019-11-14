import React from 'react';
import { View, Dimensions, Easing, Animated , Platform} from 'react-native';
import { Root } from 'native-base';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator , StackViewTransitionConfigs} from 'react-navigation-stack';
import NavigationAnimation from "./src/helpers/NavigationAnimation";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import deepGet from 'lodash/get';

import NavigationService from './src/services/NavigationService';
import AuthLoading from './src/components/AuthLoading';
import SetPin from './src/components/SetPin';
import ConfirmPin from './src/components/ConfirmPin';
import CustomTab from './src/components/CustomTab';
import TransactionScreen from './src/components/Transaction/TransactionScreen';
import SayThanksScreen from './src/components/SayThanks';
import Colors from './src/theme/styles/Colors';
import ProfileScreen from './src/components/Profile/ProfileScreen';
import ProfileEdit from './src/components/Profile/ProfileEditScreen';
import HomeScreen from './src/components/Home/HomeScreen';
import { LoadingModalCover } from './src/theme/components/LoadingModalCover';
import UserActivatingScreen from './src/components/UserActivating';
import { LoginPopover } from './src/components/LoginPopover';
import UsersProfileScreen from './src/components/UsersProfile';
import SupportingListScreen from './src/components/SupportingList';
import SupportersListScreen from './src/components/SupportersList';
import CameraWorker from './src/services/CameraWorker';
import PictureWorker from './src/services/PictureWorker';
import UserVideoHistory from './src/components/UserVideoHistory';
import CaptureImage from './src/components/CaptureImage';
import ImageGallery from './src/components/ImageGallery';
import BioScreen from './src/components/Bio';
import CaptureVideo from './src/components/CaptureVideo';
import NotificationScreen from './src/components/Notification';
import { NavigationStateHandler } from './src/services/NavigationStateHandler';
import AllowAccessModalScreen from './src/components/AllowAccessModalScreen';
import VideoPlayer from './src/components/CommonComponents/VideoPlayer';
import utilities from './src/services/Utilities';
import { NotificationToastComponent } from './src/theme/components/NotificationToast';
import SocketManager from './src/services/SocketManager';
import SearchScreen from './src/components/Search';
import FanVideoDetails from './src/components/FanVideoDetails';
import FanVideoReplyDetails from './src/components/FanVideoReplyDetails';

import WalletSettingScreen from './src/components/WalletSetting';
import StoreProductsScreen from './src/components/StoreProducts';
import PaymentWorker from './src/components/PaymentWorker';
import PushNotificationManager from './src/services/PushNotificationManager';
import ReferAndEarn from './src/components/ReferAndEarn';
import Invites from './src/components/Invites';
import InviteCodeScreen from './src/components/InviteCode';
import AddEmailScreen from './src/components/AddEmail';
import EmailScreen from './src/components/Email';
import UniversalLinksManager from './src/services/UniversalLinksManager';
import WalletDetails from './src/components/WalletSetting/WalletDetails';
import AuthDeviceDrawer from './src/components/Home/AuthDeviceDrawer';
import InAppBrowserComponent from './src/components/CommonComponents/InAppBrowser';
import CouchMarks from './src/components/CouchMarks';
import RedemptiomScreen from './src/components/Redemption';
import VideoTags from './src/components/VideoTags';
import FullScreenVideoCollection from './src/components/FullScreenVideoCollection';
import VideoReplies from './src/components/VideoReplies';
import FullScreenReplyCollection from './src/components/FullScreenReplyCollection';

const customTabHiddenRoutes = [
  'CaptureVideo',
  'FanVideoDetails',
  'FanVideoReplyDetails',
  'InviteCodeScreen',
  'AddEmailScreen',
  'InAppBrowserComponent',
  'CouchMarks',
  'VideoReplies',
  'FullScreenReplyCollection'
];

const modalStackConfig = {
  headerLayoutPreset: 'center',
  headerMode: 'none',
  mode: 'modal',
  navigationOptions: ({ navigation }) => {
    const routeName = utilities.getLastChildRoutename(navigation.state);
    return {
      tabBarVisible: !customTabHiddenRoutes.includes(routeName)
    };
  }
};

const txModalConfig = { 
  transparentCard: true,
  cardStyle: { backgroundColor: 'rgba(0,0,0,0)' },
  gesturesEnabled: false,
  transitionConfig: (transitionProps, prevTransitionProps) => {    
    const scenes = transitionProps["scenes"];
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];
    if (prevScene
      && prevScene.route.routeName === 'VideoReplies'
      && nextScene.route.routeName === 'FullScreenReplyCollection') {
      return  NavigationAnimation.zoomIn();
    }
    else if (prevScene
      && prevScene.route.routeName === 'FullScreenReplyCollection'
      && nextScene.route.routeName === 'VideoReplies') {
      return  NavigationAnimation.zoomOut();
    }
    return  NavigationAnimation.defaultTransition();
  }
};


const CaptureVideoStack = createStackNavigator(
  {
    CaptureVideo: CaptureVideo,
    FanVideoDetails: FanVideoDetails,
    FanVideoReplyDetails: FanVideoReplyDetails,
    WalletSettingScreen: WalletSettingScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const InAppBrowserStack = createStackNavigator(
  {
    InAppBrowserComponent: InAppBrowserComponent
  },
  {
    headerLayoutPreset: 'center'
  }
);

const FullScreenReplyStack = createStackNavigator(
  {
    FullScreenReplyCollection: FullScreenReplyCollection,
    UsersProfileScreen: UsersProfileScreen,
    UserVideoHistory: UserVideoHistory,
    SupportingListScreen: SupportingListScreen,
    SupportersListScreen: SupportersListScreen,
    VideoTags: VideoTags,
  },
  {
    headerLayoutPreset: 'center'
  }
);


const HomePushStack = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    UsersProfileScreen: UsersProfileScreen,
    UserVideoHistory: UserVideoHistory,
    SupportingListScreen: SupportingListScreen,
    SupportersListScreen: SupportersListScreen,
    VideoTags: VideoTags,
    FullScreenVideoCollection: FullScreenVideoCollection
  },
  {
    initialRouteName: 'HomeScreen',
    headerLayoutPreset: 'center' 
  }
);

const HomeStack = createStackNavigator(
  {
    HomePushStack: HomePushStack,
    TransactionScreen: TransactionScreen,
    CaptureVideo: CaptureVideoStack,
    InAppBrowserStack: InAppBrowserStack,
    StoreProductsScreen: StoreProductsScreen,
    InviteCodeScreen: InviteCodeScreen,
    AuthDeviceDrawer: AuthDeviceDrawer,
    AddEmailScreen: AddEmailScreen,
    VideoReplies:VideoReplies ,
    FullScreenReplyCollection: FullScreenReplyStack,
    CouchMarks: CouchMarks
  },
  {
    ...modalStackConfig,
    ...txModalConfig
  }
);

const NotificationPushStack = createStackNavigator(
  {
    NotificationScreen: NotificationScreen,
    UsersProfileScreen: UsersProfileScreen,
    UserVideoHistory: UserVideoHistory,
    VideoPlayer: VideoPlayer,
    SupportingListScreen: SupportingListScreen,
    SupportersListScreen: SupportersListScreen,
    VideoTags: VideoTags,
    FullScreenVideoCollection: FullScreenVideoCollection
  },
  {
    headerLayoutPreset: 'center'
  }
);

const NotificationStack = createStackNavigator(
  {
    NotificationPushStack: NotificationPushStack,
    TransactionScreen: TransactionScreen,
    AuthDeviceDrawer: AuthDeviceDrawer,
    SayThanksScreen: SayThanksScreen,
    CaptureVideo: CaptureVideoStack,
    VideoReplies:VideoReplies ,
    FullScreenReplyCollection: FullScreenReplyStack,
    InAppBrowserStack: InAppBrowserStack
  },
  { ...modalStackConfig, ...txModalConfig }
);

const ProfilePushStack = createStackNavigator(
  {
    ProfileScreen: ProfileScreen,
    UserVideoHistory: UserVideoHistory,
    SupportingListScreen: SupportingListScreen,
    SupportersListScreen: SupportersListScreen,
    UsersProfileScreen: UsersProfileScreen,
    ProfileEdit: ProfileEdit,
    BioScreen: BioScreen,
    EmailScreen: EmailScreen,
    ReferAndEarn: ReferAndEarn,
    Invites: Invites,
    WalletSettingScreen: WalletSettingScreen,
    WalletDetails: WalletDetails,
    VideoTags: VideoTags,
    FullScreenVideoCollection: FullScreenVideoCollection
  },
  {
    headerLayoutPreset: 'center'
  }
);

const ProfileStack = createStackNavigator(
  {
    ProfilePushStack: ProfilePushStack,
    CaptureImageScreen: CaptureImage,
    ImageGalleryScreen: ImageGallery,
    TransactionScreen: TransactionScreen,
    AuthDeviceDrawer: AuthDeviceDrawer,
    CaptureVideo: CaptureVideoStack,
    InAppBrowserStack: InAppBrowserStack,
    StoreProductsScreen: StoreProductsScreen,
    VideoReplies: VideoReplies,
    FullScreenReplyCollection: FullScreenReplyStack,
    RedemptiomScreen: RedemptiomScreen
  },
  {
    headerLayoutPreset: 'center',
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: ({ navigation }) => {
      return {
        tabBarVisible: deepGet(navigation, 'state.index') === 0
      };
    },
    ...txModalConfig
  }
);

const SearchPushStack = createStackNavigator(
  {
    SearchScreen: SearchScreen,
    UsersProfileScreen: UsersProfileScreen,
    SupportingListScreen: SupportingListScreen,
    SupportersListScreen: SupportersListScreen,
    UserVideoHistory: UserVideoHistory,
    VideoTags: VideoTags,
    FullScreenVideoCollection: FullScreenVideoCollection
  },
  {
    headerLayoutPreset: 'center'
  }
);

const SearchStack = createStackNavigator(
  {
    SearchPushStack: SearchPushStack,
    CaptureVideo: CaptureVideoStack,
    InAppBrowserStack: InAppBrowserStack,
    TransactionScreen: TransactionScreen,
    VideoReplies: VideoReplies,
    FullScreenReplyCollection: FullScreenReplyStack,
    AuthDeviceDrawer: AuthDeviceDrawer
  },
  {
    ...modalStackConfig,
    ...txModalConfig
  }
);

const CustomTabStack = createBottomTabNavigator(
  {
    Home: HomeStack,
    Search: SearchStack,
    Notification: NotificationStack,
    Profile: ProfileStack
  },
  {
    tabBarComponent: CustomTab,
    tabBarPosition: 'bottom',
    defaultNavigationOptions: {
      headerTitleStyle: {
        color: Colors.dark
      },
      headerStyle: {
        backgroundColor: Colors.white
      }
    },
    lazy: true
  }
);

const PinPushStack = createStackNavigator(
  {
    UserActivatingScreen: UserActivatingScreen,
    SetPinScreen: SetPin,
    ConfirmPinScreen: ConfirmPin
  },
  {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      headerTitleStyle: {
        color: Colors.dark,
        flex: 1,
        textAlign: 'center'
      },
      headerStyle: {
        backgroundColor: Colors.white
      },
      headerRight: <View />
    }
  }
);

const PinStack = createStackNavigator(
  {
    PinPushStack: PinPushStack,
    InAppBrowserStack: InAppBrowserStack
  },
  {
    ...modalStackConfig
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      PinStack,
      CustomTabStack
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);

const RootNavigationContainer = () => (
  <Root>
    <AppContainer
      onNavigationStateChange={(prevState, currentState, action) => NavigationStateHandler(prevState, currentState, action)}
      ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
    <CameraWorker />
    <PictureWorker />
    <LoadingModalCover />
    <LoginPopover />
    <AllowAccessModalScreen />
    <NotificationToastComponent />
    <SocketManager />
    <PaymentWorker />
    <PushNotificationManager />
    <UniversalLinksManager />
  </Root>
);

export default RootNavigationContainer;
