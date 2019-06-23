import React, { Component, Suspense } from "react";
import { Text, View } from "react-native";
import ProfileHeader from "./../SharedComponents/ProfileHeader";
import ProfileOptions from "./utils/ProfileOptions";
import UserFriendsList from "./utils/UserFriendsList";
import UserAuctionsList from "./utils/UserAuctionsList";
import axios from "axios";
import PageHeader from "./../SharedComponents/PageHeader";
import UserNotificationList from "./utils/UserNotificationList";

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
  showAuctionHistory: boolean;
  showUserFriendsList: boolean;
  showUserNotificationList: boolean;
  showUserFriendId: number;
  userFriendsList: any;
  userAuctionList: any;
  userNotificationList: any;
}

interface ProfileProps {
  user: any;
  API_URL: string;
  showUserFriends: boolean;
  setOpenFindUsers: any;
  setOpenAuctions: any;
  navigation: any;
  openMessages: any;
  openForum: any;
}

export default class Profile extends Component<
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
      showAuctionHistory: false,
      showUserFriendsList: false,
      showUserNotificationList: false,
      showUserFriendId: 0,
      userNotificationList: [],
      userFriendsList: [],
      userAuctionList: []
    };
    this.getAmountOfFriends = this.getAmountOfFriends.bind(this);
    this.setShowProfilePreview = this.setShowProfilePreview.bind(this);
    this.loadUserFriendsList = this.loadUserFriendsList.bind(this);
    this.changeShowUserFriendsList = this.changeShowUserFriendsList.bind(this);
    this.getUserAuctionList = this.getUserAuctionList.bind(this);
    this.changeShowUserAuctionList = this.changeShowUserAuctionList.bind(this);
    this.getUserNotificationList = this.getUserNotificationList.bind(this);
    this.changeShowUserNotificationList = this.changeShowUserNotificationList.bind(
      this
    );
  }

  componentDidMount() {
    this.getAmountOfFriends(this.props.user.id);
  }

  changeShowUserNotificationList = (): void => {
    this.setState({
      showUserNotificationList: !this.state.showUserNotificationList
    });
  };

  changeShowUserAuctionList = (): void => {
    this.setState({ showAuctionHistory: !this.state.showAuctionHistory });
  };

  changeShowUserFriendsList = (): void => {
    this.setState({ showUserFriendsList: !this.state.showUserFriendsList });
  };

  loadUserFriendsList = (): void => {
    let userId = this.props.user.id;
    let that = this;

    axios
      .post(this.props.API_URL + "/api/friendsList", {
        userId: userId
      })
      .then(async function(response) {
        if (response.data.status === "OK") {
          console.log(["friendsList", response.data.result.friendsList]);

          await that.setState({
            userFriendsList: response.data.result.friendsList,
            showUserFriendsList: true,
            showUserNotificationList: false
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  setShowProfilePreview = (): void => {
    this.setState({ showProfilePreview: !this.state.showProfilePreview });
    console.log("setShowProfilePreview");
  };

  getUserAuctionList = (): void => {
    let that = this;

    axios
      .post(this.props.API_URL + "/api/loadUserProductList", {
        userId: this.props.user.id
      })
      .then(function(response) {
        if (response.data.status === "OK") {
          console.log(["loadUserProductList", response.data.result]);

          that.setState({
            userAuctionList: response.data.result,
            showAuctionHistory: true
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  getAmountOfFriends = (id: number): void => {
    console.log(["id: ", id]);
    let that = this;

    axios
      .post(this.props.API_URL + "/api/countFriends", {
        userId: id
      })
      .then(function(response) {
        if (response.data.status === "OK") {
          console.log(response.data);

          that.setState({ countFriends: response.data.result.countFriends });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  getUserNotificationList = (): void => {
    let id = this.props.user.id;
    let that = this;

    axios
      .post(this.props.API_URL + "/api/loadNotificationByUserId", {
        userId: id
      })
      .then(function(response) {
        if (response.data.status === "OK") {
          console.log(["loadNotificationByUserId", response.data]);

          that.setState({
            userNotificationList: response.data.result,
            showUserNotificationList: true
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    axios
      .post(this.props.API_URL + "/api/clearNotificationByUserId", {
        userId: id
      })
      .then(function(response) {
        if (response.data.status === "OK") {
          console.log(["clearNotificationByUserId", response.data]);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    const {
      locationDetails,
      countFriends,
      showProfilePreview,
      showEditUserData,
      showUserFriendsList,
      userFriendsList,
      showAuctionHistory,
      userAuctionList,
      showUserNotificationList,
      userNotificationList
    } = this.state;
    return (
      <View>
        {/* user preview page header */}
        {showProfilePreview &&
          !showEditUserData &&
          !showUserFriendsList &&
          !showAuctionHistory &&
          !showUserNotificationList && (
            <PageHeader
              boldText={this.props.user.name}
              normalText={""}
              closeMethod={this.setShowProfilePreview}
              closeMethodParameter={""}
            />
          )}
        {/* user friends list page header */}
        {!showProfilePreview &&
          !showEditUserData &&
          showUserFriendsList &&
          !showAuctionHistory &&
          userFriendsList &&
          !showUserNotificationList && (
            <PageHeader
              boldText={"Moje znajome"}
              normalText={""}
              closeMethod={this.changeShowUserFriendsList}
              closeMethodParameter={""}
            />
          )}

        {/* user auction list page header */}
        {!showProfilePreview &&
          !showEditUserData &&
          !showUserFriendsList &&
          showAuctionHistory &&
          userAuctionList &&
          !showUserNotificationList && (
            <PageHeader
              boldText={"Wystawione przedmioty"}
              normalText={""}
              closeMethod={this.changeShowUserAuctionList}
              closeMethodParameter={""}
            />
          )}
        {/* user notification list page header */}
        {!showProfilePreview &&
          !showEditUserData &&
          !showUserFriendsList &&
          !showAuctionHistory &&
          showUserNotificationList && (
            <PageHeader
              boldText={"Powiadomienia"}
              normalText={""}
              closeMethod={this.changeShowUserNotificationList}
              closeMethodParameter={""}
            />
          )}
        {!showEditUserData &&
          !showUserFriendsList &&
          !showAuctionHistory &&
          !showUserNotificationList && (
            <ProfileHeader
              API_URL={this.props.API_URL}
              avatar={this.props.user.photo_path}
              name={this.props.user.name}
              cityDistrict={locationDetails.cityDistrict}
              city={locationDetails.city}
              age={this.props.user.age}
              countFriends={countFriends}
              countKids={this.props.user.kids.length}
              locationString={this.props.user.location_string}
            />
          )}
        {!showProfilePreview &&
          !showEditUserData &&
          !showUserFriendsList &&
          !showAuctionHistory &&
          !showUserNotificationList && (
            <ProfileOptions
              setShowProfilePreview={this.setShowProfilePreview}
              loadUserFriendsList={this.loadUserFriendsList}
              getUserAuctionList={this.getUserAuctionList}
              getUserNotificationList={this.getUserNotificationList}
              navigation={this.props.navigation}
              user={this.props.user}
              API_URL={this.props.API_URL}
            />
          )}
        {showProfilePreview &&
          !showEditUserData &&
          !showUserFriendsList &&
          !showAuctionHistory &&
          !showUserNotificationList && (
            <Suspense fallback={<Text>Wczytywanie...</Text>}>
              <UserPreview
                description={this.props.user.description}
                hobbies={this.props.user.hobbies}
                kids={this.props.user.kids}
              />
            </Suspense>
          )}
        {!showProfilePreview &&
          !showEditUserData &&
          showUserFriendsList &&
          !showAuctionHistory &&
          !showUserNotificationList &&
          userFriendsList && (
            <View style={{ paddingTop: 10, paddingBottom: 10 }}>
              {/*<Text style={styles.optionHeader}>Moje znajome</Text>*/}
              <UserFriendsList
                userFriendsList={userFriendsList}
                loggedInUser={this.props.user.id}
                API_URL={this.props.API_URL}
                setOpenFindUsers={this.props.setOpenFindUsers}
              />
            </View>
          )}

        {!showProfilePreview &&
          !showEditUserData &&
          !showUserFriendsList &&
          showAuctionHistory &&
          !showUserNotificationList &&
          userAuctionList && (
            <View style={{ padding: 10 }}>
              {/*<Text style={styles.optionHeader}>Wystawione przedmioty</Text>*/}
              <UserAuctionsList
                userAuctionList={userAuctionList}
                loggedInUser={this.props.user.id}
                API_URL={this.props.API_URL}
                setOpenAuctions={this.props.setOpenAuctions}
              />
            </View>
          )}

        {!showProfilePreview &&
          !showEditUserData &&
          !showUserFriendsList &&
          !showAuctionHistory &&
          showUserNotificationList &&
          userNotificationList && (
            <View style={{ padding: 10 }}>
              <UserNotificationList
                openMessages={this.props.openMessages}
                userNotificationList={userNotificationList}
                loadUserFriendsList={this.loadUserFriendsList}
                openForum={this.props.openForum}
                userId={this.props.user.id}
              />
            </View>
          )}
      </View>
    );
  }
}
