import React, { Component, Suspense } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from "react-native";
import ProfileHeader from "./../SharedComponents/ProfileHeader";
import ProfileOptions from "./utils/ProfileOptions";
import UserAuctionsList from "./utils/UserAuctionsList";
import About from "./utils/About";
import axios from "axios";
import PageHeader from "./../SharedComponents/PageHeader";
import styles from "./style";
import BottomPanel from "./../SharedComponents/BottomPanel";
import Alert from "./../../../Alert/Alert";
import { GlobalContext } from "./../../Context/GlobalContext";

const UserPreview = React.lazy(() =>
  import("./../SharedComponents/UserPreview")
);

interface NavigationScreenInterface {
  navigation: {
    navigate: any;
    getParam: any;
    state: any;
  };
}

interface ProfileState {
  locationDetails: any;
  countFriends: number;
  showProfilePreview: boolean;
  showEditUserData: boolean;
  userHobbies: any;
}

interface ProfileProps {
  showUserFriends: boolean;
  setOpenFindUsers: any;
  setOpenAuctions: any;
  navigation: any;
  openMessages: any;
  openForum: any;
  setShowFeedbackModal: any;
}

class Profile extends Component<
  ProfileProps,
  ProfileState,
  NavigationScreenInterface
> {
  constructor(props: ProfileProps) {
    super(props);
    this.state = {
      locationDetails: [],
      countFriends: 0,
      showProfilePreview: false,
      showEditUserData: false,

      userHobbies: []
    };
    this.getAmountOfFriends = this.getAmountOfFriends.bind(this);
    this.setShowProfilePreview = this.setShowProfilePreview.bind(this);

    console.log(["profile", this.props]);
  }

  componentDidMount() {
    console.log(this.context);
    if (this.context.userData) {
      this.getAmountOfFriends(this.context.userData.id);
    }
  }

  setShowProfilePreview = (): void => {
    this.setState({ showProfilePreview: !this.state.showProfilePreview });
  };

  getAmountOfFriends = (id: number): void => {
    let that = this;

    axios
      .post(this.context.API_URL + "/api/countFriends", {
        userId: id
      })
      .then(function(response) {
        if (response.data.status === "OK") {
          that.setState({ countFriends: response.data.result.countFriends });
        }
      })
      .catch(function(error) {});
  };

  render() {
    const {
      locationDetails,
      countFriends,
      showProfilePreview,
      showEditUserData
    } = this.state;
    return (
      <React.Fragment>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#fff"
          }}
        >
          {this.context.showAlert && (
            <Alert
              alertType={this.context.alertType}
              alertMessage={this.context.alertMessage}
              closeAlert={this.context.closeAlert}
            />
          )}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between"
            }}
            data-test="ProfileContainer"
          >
            <ScrollView>
              {/* user preview page header */}
              {showProfilePreview && !showEditUserData && (
                <PageHeader
                  boldText={this.context.userData.name}
                  normalText={""}
                  closeMethod={this.setShowProfilePreview}
                  closeMethodParameter={""}
                  data-test="PageHeader"
                />
              )}

              {!showEditUserData && (
                <ProfileHeader
                  API_URL={this.context.API_URL}
                  avatar={this.context.userData.photo_path}
                  name={this.context.userData.name}
                  cityDistrict={locationDetails.cityDistrict}
                  city={locationDetails.city}
                  age={this.context.userData.age}
                  countFriends={countFriends}
                  countKids={this.context.userData.kids.length}
                  locationString={this.context.userData.location_string}
                  showLogout={true}
                  navigation={this.props.navigation}
                />
              )}
              {!showProfilePreview && !showEditUserData && (
                <ProfileOptions
                  setShowProfilePreview={this.setShowProfilePreview}
                  navigation={this.props.navigation}
                  user={this.context.userData}
                  API_URL={this.context.API_URL}
                />
              )}
              {showProfilePreview && !showEditUserData && (
                <Suspense fallback={<Text>Wczytywanie...</Text>}>
                  <UserPreview
                    description={this.context.userData.description}
                    hobbies={this.context.userData.hobbies}
                    kids={this.context.userData.kids}
                  />
                </Suspense>
              )}
            </ScrollView>
            <BottomPanel
              data-test="BottomPanel"
              navigation={this.props.navigation}
            />
          </View>
        </SafeAreaView>
      </React.Fragment>
    );
  }
}
Profile.contextType = GlobalContext;
export default Profile;
