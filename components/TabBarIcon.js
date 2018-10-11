import React from 'react';
// import { Icon } from 'expo';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';
// import FontAwesome5 from '@expo/vector-icons/vendor/react-native-vector-icons/FontAwesome5'

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <FontAwesome
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}
