import React, { Component } from "react";
import {
  Platform,
  Button,
  Image,
  Text,
  View,
  TouchableHighlight
} from "react-native";
import { peachColor } from "./../../../assets/global/globalStyles";
import styles from "./../style";
import Alert from "./../../../Alert/Alert";

interface UserOnListState {}

interface UserOnListProps {
  setUserDetailsId: any;
  user: {
    id: number;
    photo_path: string;
    name: string;
    age: string;
    kids: any;
    hobbies: any;
  };
  API_URL: string;
  senderId: number;
  openMessages: any;
  setShowUserDetails: any;
  alertMessage: string;
  alertType: string;
}

export default class UserOnList extends Component<
  UserOnListProps,
  UserOnListState
> {
  constructor(props: UserOnListProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.userListContainer}>
        <View style={styles.userListSingleUserContainer}>
          <Image
            style={styles.userListSingleUserImage}
            source={{
              uri: `${this.props.API_URL}userPhotos/${
                this.props.user.photo_path
              }`
            }}
          />
          <Text style={styles.userListText}>
            {this.props.user.name}, {this.props.user.age}
          </Text>
          <TouchableHighlight>
            <Button
              title="Podgląd"
              color={peachColor}
              onPress={() => {
                this.props.setShowUserDetails(this.props.user.id);
                this.props.setUserDetailsId(this.props.user.id);
              }}
            />
          </TouchableHighlight>

          {this.props.alertMessage != "" && (
            <Alert
              alertType={this.props.alertType}
              alertMessage={this.props.alertMessage}
            />
          )}
        </View>
      </View>
    );
  }
}
