import React from 'react';
import { View } from 'react-native';
import { Root } from 'native-base';
import {
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';

import NavigationService from './src/services/NavigationService';
import AuthLoading from './src/components/AuthLoading';
import AuthScreen from './src/components/Authentication';
import Users from './src/components/Users';
import SetPin from './src/components/SetPin';
import ConfirmPin from './src/components/ConfirmPin';
import CustomTab from './src/components/CustomTab';
import Feed from './src/components/Feed';
import TransactionScreen from './src/components/Transaction/TransactionScreen';
import Colors from './src/theme/styles/Colors';
import UserFeedScreen from './src/components/UserFeed/UserFeedScreen';
import ProfileScreen from './src/components/Profile/ProfileScreen';
import { LoadingModalCover } from './src/theme/components/LoadingModalCover';

const FeedStack =  createStackNavigator(
  {
    FeedContent: Feed,
    UserFeedScreen: UserFeedScreen
  },
  {
    headerLayoutPreset: 'center'
  }
); 

const UserStack = createStackNavigator(
  {
    Users: Users,
    TransactionScreen: TransactionScreen
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: navigation.state.index == 1 ? false : true
    }),
    headerLayoutPreset: 'center'
  }
)

const ProfileStack = createStackNavigator(
  {
    ProfileScreen: ProfileScreen,
    UserFeedScreen: UserFeedScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const HomeScreen = createMaterialTopTabNavigator(
  {
    Feed: FeedStack,
    Users: UserStack,
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
    }
  }
);

const PinStack = createStackNavigator(
  {
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

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      AuthScreen,
      HomeScreen,
      PinStack
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);

const RootNavigationContainer = () => (
  <Root>
    <AppContainer
      ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
    <LoadingModalCover />
  </Root>
);

export default RootNavigationContainer;
