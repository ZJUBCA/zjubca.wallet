import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'
import SettingsScreen from '../screens/SettingsScreen'
import Colors from '../constants/Colors'


function createNavigationOptions( name, icon ) {
  let iconSet
  if (typeof icon === 'string') {
    iconSet = {
      active: icon,
      inactive: icon
    }
    console.log(iconSet)
  } else {
    iconSet = icon
  }
  return {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={
          focused ? iconSet.active : iconSet.inactive
        }
      />
    ),
    tabBarOptions: {
      activeTintColor: Colors.tabIconSelected,
      inactiveTintColor: Colors.tabIconDefault,
    }
  }
}


const HomeStack = createStackNavigator({
  Home: HomeScreen,
})
HomeStack.navigationOptions = createNavigationOptions('Home', 'md-information-circle')


const LinksStack = createStackNavigator({
  Links: LinksScreen,
})
LinksStack.navigationOptions = createNavigationOptions('Links', 'md-link')

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
})
SettingsStack.navigationOptions = createNavigationOptions('Settings', 'md-options')


export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
})
