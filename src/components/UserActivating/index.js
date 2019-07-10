import React, { Component } from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import inlineStyles from './Style';
import LinearGradient from 'react-native-linear-gradient';

import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';
import air_drop from '../../assets/airdrop.png';

// create a component
export default class UserActivatingScreen extends Component {
  onCreatePin() {
    this.props.navigation.navigate('SetPinScreen');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Pepo</Text>
        <Text style={styles.subTitle}>Congratulations, you received</Text>
        <Text style={styles.coinsCount}>200 Pepo Coins</Text>
        <LinearGradient
          colors={['#ffffff', '#ffdea3', '#ffffff']}
          style={{paddingVertical: 25, paddingHorizontal: 50, marginTop: 25, alignItems: 'center'}}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
            <Text style={{fontSize: 16}}>Pepo coins can be used to</Text>
            <Text style={{fontSize: 16, marginTop: 3}}>support your favorite creators!</Text>
        </LinearGradient>
        <Image source={air_drop} style={{width: 199.5, height: 238, marginVertical: 30}} />
        <Text style={styles.descTxt}>Create a pin to access your wallet and</Text>
        <Text style={[styles.descTxt, {marginTop: 3}]}>claim Pepo Coins</Text>
        <TouchableButton
        TouchableStyles={[Theme.Button.btnPink, { width: '75%', marginTop: 30}]}
        TextStyles={[Theme.Button.btnPinkText]}
        text="Create PIN"
        onPress={() => {
          this.onCreatePin();
        }}
        />
      </View>
    );
  }
}
