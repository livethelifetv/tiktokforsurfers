import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import CurrentUser from '../../models/CurrentUser';
import reduxGetter from '../../services/ReduxGetters';
import PepoApi from '../../services/PepoApi';
import Colors from '../../theme/styles/Colors';
import loggedOutIcon from '../../assets/drawer-logout-icon.png';
import twitterDisconnectIcon from '../../assets/drawer-twitter-icon.png';

import BackArrow from '../../assets/back-arrow.png';

function twitterDisconnect() {
  new PepoApi('/auth/twitter-disconnect')
    .post()
    .catch((error) => {
      Alert.alert('Twitter Disconnect failed', error);
    })
    .then(async (res) => {
      console.log('Twitter disconnect', res);
      if (res && res.success) {
        await CurrentUser.logout();
      } else {
        Alert.alert('Twitter Disconnect failed', res);
      }
    });
}

let userName;
export default (props) => {
  let currentUserName = reduxGetter.getName(CurrentUser.getUserId());
  userName = currentUserName || userName;
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView forceInset={{ top: 'always' }}>
        <View
          style={{
            paddingVertical: 10,
            borderBottomColor: Colors.seaMist,
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 5,
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            onPress={props.navigation.closeDrawer}
            style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
          >
            <Image style={{ width: 10, height: 18 }} source={BackArrow} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{userName}</Text>
        </View>
        <TouchableOpacity onPress={twitterDisconnect}>
          <View style={styles.itemParent}>
            <Image style={{ height: 24, width: 25.3 }} source={twitterDisconnectIcon} />
            <Text style={styles.item}>Twitter Disconnect</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={CurrentUser.logout.bind(CurrentUser)}>
          <View style={styles.itemParent}>
            <Image style={{ height: 24, width: 25.3 }} source={loggedOutIcon} />
            <Text style={styles.item}>Log out</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.seaMist
  },
  headerText: {
    fontWeight: '600',
    fontSize: 17,
    flex: 1,
    textAlign: 'center'
  },
  itemParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.whisper,
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  item: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'AvenirNext-Regular'
  }
});
