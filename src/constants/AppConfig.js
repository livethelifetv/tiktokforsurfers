import pepo_icon from '../assets/pepo-white-icon.png';
import balance_header_pepo_icon from '../assets/balance_header_pepo_icon.png';
import twitterDisconnectIcon from '../assets/drawer-twitter-icon.png';
import defaultLinkIcon from '../assets/default_link_icon.png';
import feedLinkIcon from '../assets/Link.png';
import {getBottomSpace, ifIphoneX} from "react-native-iphone-x-helper";
import {CUSTOM_TAB_Height} from "../theme/constants";
import NotchHelper from "../helpers/NotchHelper";
import {Dimensions, NativeModules, StatusBar} from "react-native";

const statusBarHeight = StatusBar.currentHeight;
const {height} = Dimensions.get('window');
let RNDeviceInfo = NativeModules.RNDeviceInfo;
let modalDeviceName = RNDeviceInfo.model === "Redmi Note 7 Pro" && RNDeviceInfo.brand === "xiaomi";
let btmSpace = modalDeviceName ? 5 : 0;

const PROFILE_TX_SEND_SUCCESS = 'PROFILE_TX_SEND_SUCCESS',
  PROFILE_TX_RECEIVE_SUCCESS = 'PROFILE_TX_RECEIVE_SUCCESS',
  VIDEO_TX_SEND_SUCCESS = 'VIDEO_TX_SEND_SUCCESS',
  VIDEO_TX_RECEIVE_SUCCESS = 'VIDEO_TX_RECEIVE_SUCCESS',
  VIDEO_ADD = 'VIDEO_ADD',
  USER_MENTION = 'USER_MENTION',
  REPLY_USER_MENTION = 'REPLY_USER_MENTION',
  REPLY_SENDER_WITH_AMOUNT = 'REPLY_SENDER_WITH_AMOUNT',
  REPLY_SENDER_WITHOUT_AMOUNT = 'REPLY_SENDER_WITHOUT_AMOUNT',
  REPLY_RECEIVER_WITH_AMOUNT = 'REPLY_RECEIVER_WITH_AMOUNT',
  REPLY_RECEIVER_WITHOUT_AMOUNT = 'REPLY_RECEIVER_WITHOUT_AMOUNT',
  CONTRIBUTION_THANKS = 'CONTRIBUTION_THANKS',
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',
  PROFILE_TX_SEND_FAILURE = 'PROFILE_TX_SEND_FAILURE',
  VIDEO_TX_SEND_FAILURE = 'VIDEO_TX_SEND_FAILURE',
  TOPUP_DONE = 'TOPUP_DONE',
  AIRDROP_DONE = 'AIRDROP_DONE',
  RECOVERY_INITIATE='RECOVERY_INITIATE';

export default {

  logoutTimeOut : 2000,

  beKnownErrorCodeMaps : {
    entityDeleted: "not_found",
    validateUploadError: "precondition_failed"
  },

  userStatusMap: {
    activated: 'activated',
    activating: 'activating',
    inActive: 'inactive'
  },

  videoStatusMap:{
    deleted: 'deleted'
  },

  replyStatusMap:{
    deleted: 'deleted'
  },

  deviceStatusMap: {
    registered: 'registered',
    authorizing: 'authorizing',
    authorized: 'authorized',
    revoking: 'revoking',
    recovering: 'recovering',
    revoked: 'revoked'
  },

  ruleTypeMap: {
    directTransfer: 'direct transfer',
    pricer: 'pricer'
  },

  metaProperties: {
    type: 'user_to_user',
    name: 'profile'
  },

  replyMetaProperties: {
    type: 'user_to_user',
    name: 'reply_on_video'
  },

  redemptionMetaProperties : {
    type: 'user_to_company',
    name: 'redemption'
  },

  executeTransactionPrivacyType: {
    public: 'PUBLIC',
    private: 'PRIVATE'
  },

  transactionStatus: {
    done: 'DONE'
  },

  tokenSymbols: {
    pepo: {
      image1: pepo_icon,
      image2: balance_header_pepo_icon
    }
  },

  giphySizes: {
    search: 'preview_gif',
    activity: 'downsized'
  },

  maxBtAllowedInSingleTransfer: 50,

  fileUploadTypes: {
    video: 'videos',
    image: 'images'
  },

  storageKeys: {
    RAW_VIDEO: 'raw-video',
    COMPRESSED_VIDEO: 'compressed-video',
    S3_VIDEO: 's3-video',

    VIDEO_THUMBNAIL_IMAGE: 'video-thumbnail-image',
    S3_VIDEO_THUMBNAIL_IMAGE: 's3-video-thumbnail-image',

    PROFILE_RAW_IMAGE: 'profile-raw-image',
    PROFILE_CROPPED_IMAGE: 'profile-cropped-image',
    S3_PROFILE_IMAGE: 's3-profile-image',
    ENABLE_START_UPLOAD: 'enable-start-upload'
  },

  cameraConstants: {
    RATIO: '16:9',
    VIDEO_QUALITY: '720p',
    VIDEO_WIDTH: 720,
    VIDEO_HEIGHT: 1280
  },

  compressionConstants: {
    COMPRESSION_SIZE: '720X1280',
    CRF: '28',
    PRESET: 'superfast',
    PIX_FMT: 'yuv420p'
  },

  cameraCropConstants: {
    WIDTH: 480,
    HEIGHT: 480
  },

  videoConstant: {
    videoWidth: '576w',
    videoImageWidth: 'original'
  },

  profileImageConstants: {
    imageWidth: '144w'
  },

  userVideos: {
    userScreenCoverImageWidth: '288w'
  },

  cameraHeightRatio: 0.6,

  notificationConstants: {
    profileTxSendKind: PROFILE_TX_SEND_SUCCESS,
    profileTxReceiveKind: PROFILE_TX_RECEIVE_SUCCESS,
    videoTxSendKind: VIDEO_TX_SEND_SUCCESS,
    videoTxReceiveKind: VIDEO_TX_RECEIVE_SUCCESS,
    videoAddKind: VIDEO_ADD,
    userMention: USER_MENTION,
    replyUserMention: REPLY_USER_MENTION,
    replySenderWithAmount: REPLY_SENDER_WITH_AMOUNT,
    replySenderWithoutAmount: REPLY_SENDER_WITHOUT_AMOUNT,
    replyReceiverWithAmount: REPLY_RECEIVER_WITH_AMOUNT,
    replyReceiverWithoutAmount: REPLY_RECEIVER_WITHOUT_AMOUNT,
    AppreciationKind: CONTRIBUTION_THANKS,
    systemNotification: SYSTEM_NOTIFICATION,
    airDropNotification: AIRDROP_DONE,
    topupNotification: TOPUP_DONE,
    recoveryInitiate:RECOVERY_INITIATE,
    showCoinComponentArray: [
      PROFILE_TX_SEND_SUCCESS,
      PROFILE_TX_RECEIVE_SUCCESS,
      VIDEO_TX_SEND_SUCCESS,
      VIDEO_TX_RECEIVE_SUCCESS,
      PROFILE_TX_SEND_FAILURE,
      VIDEO_TX_SEND_FAILURE,
      AIRDROP_DONE,
      TOPUP_DONE,
      REPLY_SENDER_WITH_AMOUNT,
      REPLY_RECEIVER_WITH_AMOUNT
    ],
    whitelistedNotificationKinds: [
      PROFILE_TX_SEND_SUCCESS,
      PROFILE_TX_RECEIVE_SUCCESS,
      VIDEO_TX_SEND_SUCCESS,
      VIDEO_TX_RECEIVE_SUCCESS,
      VIDEO_ADD,
      CONTRIBUTION_THANKS,
      SYSTEM_NOTIFICATION,
      PROFILE_TX_SEND_FAILURE,
      VIDEO_TX_SEND_FAILURE
    ]
  },
  tabConfig: {
    tab1: {
      rootStack: 'Home',
      childStack: 'HomeScreen',
      navigationIndex: 0
    },
    tab2: {
      rootStack: 'Search',
      childStack: 'SearchScreen',
      navigationIndex: 1
    },
    tab3: {
      rootStack: 'CaptureVideo',
      childStack: 'CaptureVideo',
      navigationIndex: null
    },
    tab4: {
      rootStack: 'Notification',
      childStack: 'NotificationScreen',
      navigationIndex: 2
    },
    tab5: {
      rootStack: 'Profile',
      childStack: 'ProfileScreen',
      navigationIndex: 3
    }
  },

  videoLinkConfig: {
    HOME_FEED: {
      SOCIAL_ICONS: {
        TWITTER: twitterDisconnectIcon,
        DEFAULT: feedLinkIcon
      }
    },
    VIDEO: {
      SOCIAL_ICONS: {
        TWITTER: twitterDisconnectIcon,
        DEFAULT: defaultLinkIcon
      }
    },
    WHITELISTED_DOMAINS: {
      // TWITTER: 'twitter.com'
    }
  },

  appInstallInviteCodeASKey : "app_install_invite_code",

  searchConfig: {
    MIN_SEARCH_CHAR: 2
  },

  paymentFlowMessages : {
    transactionSuccess: "Your account is recharged.",
    transactionPending: "We are processing your transaction we'll update you shortly." ,
    sendingPepo: "Topping up please wait."
  },

  nativeStoreMap : {
    ios : {
      storeName : "app store"
    },
    android: {
      storeName: "play store"
    }
  },

  appStateMap :{
    active : "active",
    inactive: "inactive",
    background : "background"
  },

  redemption:{
    pepoCornsName : "Unicorns",
    learnMoreLink : "https://intercom.help/pepo/en/articles/3418202-what-are-pepo-unicorns"
  },

  pepoCornsActivityKinds : ["CREDIT_PEPOCORN_SUCCESS" , "CREDIT_PEPOCORN_FAILURE"],

  routesAnalyticsMap: {
    InAppBrowserStack: 'InAppBrowser',
    UserActivatingScreen: 'UserActivating',
    SetPinScreen: 'SetPin',
    ConfirmPinScreen: 'ConfirmPin',
    Home: 'HomeFeed',
    HomeScreen: 'HomeFeed',
    Search: 'Search',
    SearchScreen: 'Search',
    Notification: 'Activity',
    NotificationScreen: 'Activity',
    Profile: 'MyProfile',
    ProfileScreen: 'MyProfile',
    CaptureVideo: 'CaptureVideo',
    TransactionScreen: 'Transaction',
    TransactionSuccess: 'Transaction/Success',
    UsersProfileScreen: 'UsersProfile',
    SupportingListScreen: 'SupportingList',
    SupportersListScreen: 'SupportersList',
    UserVideoHistory: 'UsersProfile/VideoHistory',
    CaptureImageScreen: 'CaptureImage',
    ImageGalleryScreen: 'ImageGallery',
    StoreProductsScreen: 'InAppPurchase',
    ProfileEdit: 'MyProfile/Edit',
    BioScreen: 'MyProfile/Edit/Bio',
    EmailScreen: 'MyProfile/Edit/Email',
    ReferAndEarn: 'ReferAndEarn',
    Invites: 'Invites',
    WalletSettingScreen: 'WalletSetting',
    WalletDetails: 'WalletDetails',
    SayThanksScreen: 'SayThanks',
    VideoPlayer: 'VideoPlayer',
    InviteCodeScreen: 'InviteCode',
    AddEmailScreen: 'AddEmail',
    InAppBrowserComponent: 'InAppBrowser',
    FanVideoDetails: 'CaptureVideo/VideoDetails',
    VideoTags: 'Tags',
    FullScreenVideoCollection: 'Tags/VideoHistory',
    RedemptiomScreen: 'Redemption',
    RedemptionSuccess: 'Redemption/Success',
    CouchMarks: 'CouchMarks',
    AuthDeviceDrawer: 'DeviceUnauthorized',
    TwitterLogin: 'TwitterLogin',
    FullScreenReplyCollection: 'FullScreenReplyCollection',
    VideoReplyPlayer: 'VideoReplyPlayer',
    VideoReplies: 'VideoReplies'
  },
  default_bt_amt : 10,

  videoTypes: {
    post : 'post',
    reply: 'reply'
  },

  MaxDescriptionArea: 35250,
  thumbnailListConstants: {
    separatorHeight: 25,
    separatorWidth: 1,
    // this is height of profile icon + shadow around it.
    iconHeight: 48,
    // this is width of profile icon + shadow around it.
    iconWidth: 48,
    parentIconHeight: 46,
    parentIconWidth: 46,
    borderWidth: 2,
    transparentGap: 2,

    // this is Margin to place an icon element on top and bottom of the bordered(both red and white colored) wrapper
    cellHeight: function() {
      return this.iconHeight + (2 * this.borderWidth);
    },
    separatorMargin: function () {
      return (this.borderWidth + this.transparentGap);
    }
  },
  VideoScreenObject : {
    ...ifIphoneX(
      {
        height: height - CUSTOM_TAB_Height - getBottomSpace([true])
      },
      {
        height:
          NotchHelper.hasNotch()
            ? height + statusBarHeight - CUSTOM_TAB_Height - btmSpace
            : height - CUSTOM_TAB_Height
      }
    )
  }

};
