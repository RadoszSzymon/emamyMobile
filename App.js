import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import NotLoggedInMain from "./app/NotLoggedInScreens/NotLoggedInMain";
import Welcome from "./app/NotLoggedInScreens/Welcome/Welcome";
import Login from "./app/NotLoggedInScreens/Auth/Login";
import Register from "./app/NotLoggedInScreens/Auth/Register";
import ConfirmAccount from "./app/NotLoggedInScreens/ConfirmAccount/ConfirmAccount";
import FillNecessaryInfo from "./app/NotLoggedInScreens/FillNecessaryInfo/FillNecessaryInfo";
import LoggedInMain from "./app/LoggedInScreens/LoggedInMain";
/*import FindUsers from "./app/LoggedInScreens/FindUsers/FindUsers";
import Profile from "./app/LoggedInScreens/Profile/Profile";
import Events from "./app/LoggedInScreens/Events/Events";
import BottomPanel from "./app/LoggedInScreens/inc/BottomPanel";
import Auctions from "./app/LoggedInScreens/Auctions/Auctions";*/
import { createStackNavigator, createAppContainer } from "react-navigation";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

const RootStack = createStackNavigator(
  {
    Welcome: Welcome,
    Login: Login,
    Register: Register,
    NotLoggedInMain: NotLoggedInMain,
    ConfirmAccount: ConfirmAccount,
    //FindUsers: FindUsers,
    FillNecessaryInfo: FillNecessaryInfo,
    LoggedInMain: LoggedInMain
    /*Profile: Profile,
    Events: Events,
    Auctions: Auctions,
    BottomPanel: BottomPanel*/
  },
  {
    initialRouteName: "NotLoggedInMain"
  }
);

const AppContainer = createAppContainer(RootStack);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
