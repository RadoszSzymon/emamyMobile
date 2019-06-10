import React, { Component } from "react";
import { View } from "react-native";
import AgeDescScreen from "./utils/AgeDescScreen";
import PhotoScreen from "./utils/PhotoScreen";
import CoordsScreen from "./utils/CoordsScreen";
import ChooseKidsScreen from "./utils/ChooseKidsScreen";
import ChooseHobbiesScreen from "./utils/ChooseHobbiesScreen";
import ImagePicker from "react-native-image-picker";
import axios from "axios";

interface NavigationScreenInterface {
  navigation: {
    navigate: any;
    getParam: any;
    state: any;
  };
}

interface FillNecessaryInfoState {
  age: number;
  desc: string;
  kids: any;
  hobbies: any;
  actualStep: number;
  photo: any;
  actualKidName: string;
  actualKidDate: string;
  actualKidGender: string;
  region: any;
  userSavedPhoto: string;
}

export default class FillNecessaryInfo extends Component<
  NavigationScreenInterface,
  FillNecessaryInfoState
> {
  constructor(props: NavigationScreenInterface) {
    super(props);
    this.state = {
      age: 0,
      desc: "",
      kids: [],
      hobbies: [],
      actualStep: 1,
      photo: null,
      userSavedPhoto: "",
      actualKidName: "",
      actualKidDate: "2016-05-15",
      actualKidGender: "female",
      region: {
        latitude: 52.237049,
        longitude: 21.017532,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.submitData = this.submitData.bind(this);
    this.setActualKidName = this.setActualKidName.bind(this);
    this.addKid = this.addKid.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.setActualKidDate = this.setActualKidDate.bind(this);
    this.saveUserData = this.saveUserData.bind(this);
    this.saveUserKids = this.saveUserKids.bind(this);
    this.getAllHobbies = this.getAllHobbies.bind(this);
    this.changeHobbyStatus = this.changeHobbyStatus.bind(this);
    this.saveHobbies = this.saveHobbies.bind(this);
    this.setGender = this.setGender.bind(this);
    this.cleanUserKids = this.cleanUserKids.bind(this);
    this.cleanUserHobbies = this.cleanUserHobbies.bind(this);
    this.removeKidFromState = this.removeKidFromState.bind(this);
  }

  componentDidMount = async () => {
    const navigation = this.props.navigation;

    if (navigation.getParam("user")) {
      console.log(
        navigation.getParam("user").age,
        navigation.getParam("user").description,
        navigation.getParam("user").hobbies,
        navigation.getParam("user").kids,
        navigation.getParam("user").photo_path,
        navigation.getParam("user").lattitude
      );
      this.setState({
        age: navigation.getParam("user").age,
        desc: navigation.getParam("user").description
          ? navigation.getParam("user").description
          : "",
        userSavedPhoto: navigation.getParam("user").photo_path,
        region: {
          latitude: navigation.getParam("user").lattitude,
          longitude: navigation.getParam("user").longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }
      });

      await this.getAllHobbies();

      //if user want to edit profile and have some kids, then we format that kids array and assign it to state
      if (navigation.getParam("user").kids.length > 0) {
        navigation.getParam("user").kids.map(async (kid: any, i: number) => {
          let kidObj = {
            name: kid.name,
            dateOfBirth: kid.date_of_birth,
            childGender: kid.child_gender
          };

          await this.setState(prevState => ({
            kids: [...prevState.kids, kidObj]
          }));
        });
      }
    }
  };

  removeKidFromState = (kidName: string): void => {
    console.log(["removeKidFromState", this.state.kids]);
    this.setState(prevState => ({
      kids: prevState.kids.filter((kid: any) => kid.name !== kidName)
    }));
  };

  cleanUserHobbies = (): void => {
    const navigation = this.props.navigation;

    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userId = navigation.getParam("user").id;

      axios
        .post(API_URL + "/api/cleanUserHobbies", {
          userId: userId
        })
        .then(response => {
          if (response.data.status === "OK") {
            console.log(["cleanUserHobbies", response.data]);
          }
        })
        .catch(function(error) {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  cleanUserKids = (): void => {
    const navigation = this.props.navigation;

    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userId = navigation.getParam("user").id;

      axios
        .post(API_URL + "/api/cleanUserKids", {
          userId: userId
        })
        .then(response => {
          if (response.data.status === "OK") {
            console.log(["cleanUserKids", response.data]);
          }
        })
        .catch(function(error) {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  setGender = (gender: string): void => {
    if (gender === "female") {
      this.setState({ actualKidGender: "female" });
    } else if (gender === "male") {
      this.setState({ actualKidGender: "male" });
    }
  };

  saveHobbies = (): void => {
    const navigation = this.props.navigation;
    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userEmailName = navigation.getParam("user").email;

      this.state.hobbies.map((hobby: { active: boolean; id: number }) => {
        if (hobby.active) {
          axios
            .post(API_URL + "/api/saveHobbyUser", {
              userEmail: userEmailName,
              hobby_id: hobby.id
            })
            .then(response => {
              if (response.data.status === "OK") {
                console.log(response);
              }
            })
            .catch(function(error) {
              console.log(error.message);
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  changeHobbyStatus = (hobbyKeyId: number): void => {
    let newHobbies = this.state.hobbies;

    //Find index of specific object using findIndex method.
    let hobbyUpdateElementIndex = newHobbies.findIndex(
      (obj: { keyId: number }) => obj.keyId == hobbyKeyId
    );

    newHobbies[hobbyUpdateElementIndex].active = !newHobbies[
      hobbyUpdateElementIndex
    ].active;

    this.setState({ hobbies: newHobbies });
  };

  onRegionChange = async (region: any) => {
    await this.setState({ region });
  };

  getAllHobbies = (): void => {
    const navigation = this.props.navigation;
    let API_URL = navigation.getParam("API_URL", "");
    let activeHobbies: { name: string }[] = [];
    //if user want to edit profile and have some hobbies, then we format that hobbies array and set active hobbies
    if (navigation.getParam("user").hobbies.length > 0) {
      navigation.getParam("user").hobbies.map(async (hobby: any, i: number) => {
        let activeHobbyObj = {
          name: hobby.name
        };
        activeHobbies.push(activeHobbyObj);
      });

      console.log(activeHobbies);
    }

    axios
      .get(API_URL + "/api/hobbiesList")
      .then(response => {
        if (response.data.status === "OK") {
          //loop through existing state list of all hobbies and check if name is element of activeHobbies
          response.data.result.map(
            (hobby: { name: string; id: number }, i: number) => {
              let hobbyObj = {};

              if (
                activeHobbies.filter(
                  activeHobby => activeHobby.name === hobby.name
                ).length > 0
              ) {
                hobbyObj = {
                  name: hobby.name,
                  id: hobby.id,
                  keyId: i,
                  active: true
                };
              } else {
                hobbyObj = {
                  name: hobby.name,
                  id: hobby.id,
                  keyId: i,
                  active: false
                };
              }

              this.setState(prevState => ({
                hobbies: [...prevState.hobbies, hobbyObj]
              }));

              //console.log(this.state);
            }
          );
        }
      })
      .catch(function(error) {
        console.log(error.message);
      });
  };

  setActualKidDate = (date: string): void => {
    this.setState({ actualKidDate: date });
  };

  setActualKidName = (name: string): void => {
    this.setState({ actualKidName: name });
  };

  addKid = async () => {
    if (this.state.actualKidName) {
      let kidObj = {
        name: this.state.actualKidName,
        dateOfBirth: this.state.actualKidDate,
        childGender: this.state.actualKidGender
      };

      await this.setState(prevState => ({
        kids: [...prevState.kids, kidObj]
      }));
      this.setState({
        actualKidName: "",
        actualKidDate: "2016-05-15",
        actualKidGender: "female"
      });
    }

    //console.log(["kids", this.state]);
  };

  handleChange = (name: string, value: string) => {
    // @ts-ignore
    this.setState((): void => ({ [name]: value }));

    //console.log(this.state);
  };

  handleChoosePhoto = (): void => {
    const options = {
      noData: true,
      maxWidth: 500,
      maxHeight: 500,
      quality: 1.0
    };
    ImagePicker.launchImageLibrary(options, response => {
      console.log(response);
      if (response.uri) {
        this.setState({ photo: response });
      }
    });
  };

  fileUpload = (): void => {
    const navigation = this.props.navigation;
    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userEmailName = navigation.getParam("user").email;

      console.log([
        this.state.photo.uri,
        userEmailName.split("@")[0],
        userEmailName
      ]);

      axios
        .post(
          API_URL + "/api/uploadUserPhoto",
          {
            file: this.state.photo.uri,
            fileName: userEmailName.split("@")[0],
            userEmail: userEmailName
          }
          /* {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }*/
        )
        .then(response => {
          console.log(["fileUpload", response]);
          if (response.data.status === "OK") {
            console.log(response);
          }
        })
        .catch(function(error) {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  saveUserData = (): void => {
    const navigation = this.props.navigation;
    const { age, desc, region } = this.state;
    //console.log(navigation.getParam("user"));
    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userEmailName = navigation.getParam("user").email;

      axios
        .post(API_URL + "/api/updateUserInfo", {
          userEmail: userEmailName,
          age: age,
          desc: desc,
          lat: region.latitude,
          lng: region.longitude
        })
        .then(response => {
          if (response.data.status === "OK") {
            console.log(response);
          }
        })
        .catch(function(error) {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  saveUserKids = (): void => {
    const navigation = this.props.navigation;
    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userEmailName = navigation.getParam("user").email;

      this.state.kids.map((kid: any) => {
        axios
          .post(API_URL + "/api/saveKid", {
            userEmail: userEmailName,
            name: kid.name,
            dateOfBirth: kid.dateOfBirth,
            childGender: kid.childGender
          })
          .then(response => {
            if (response.data.status === "OK") {
              console.log(response);
            }
          })
          .catch(function(error) {
            console.log(error.message);
          });
      });
    } catch (error) {
      console.log(error);
    }
  };

  nextStep = (): void => {
    //setState — it’s actually asynchronous.
    //React batches state changes for performance reasons, so
    //the state may not change immediately after setState is called.
    //That means you should not rely on the current state when calling
    //setState — since you can’t be sure what that state will be!
    this.setState(prevState => ({
      actualStep: prevState.actualStep + 1
    }));
    //this.setState({ actualStep: this.state.actualStep + 1 });
  };

  prevStep = (): void => {
    this.setState(prevState => ({
      actualStep: prevState.actualStep - 1
    }));
  };

  submitData = async () => {
    let navProps = this.props.navigation.state.params;

    //first remove user kids and hobbies and save new data
    await this.cleanUserKids();
    await this.cleanUserHobbies();

    await this.saveUserData();
    await this.fileUpload();
    await this.saveUserKids();
    await this.saveHobbies();

    navProps.setUserFilledInfo();
  };

  render() {
    const {
      age,
      desc,
      photo,
      region,
      kids,
      actualKidDate,
      actualKidName,
      hobbies,
      actualStep,
      actualKidGender,
      userSavedPhoto
    } = this.state;
    return (
      <View>
        {actualStep === 1 && (
          <AgeDescScreen
            handleChange={this.handleChange}
            age={age}
            desc={desc}
            nextStep={this.nextStep}
          />
        )}

        {actualStep === 2 && (
          <PhotoScreen
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            photo={photo}
            handleChoosePhoto={this.handleChoosePhoto}
            API_URL={this.props.navigation.getParam("API_URL", "")}
            userSavedPhoto={userSavedPhoto}
          />
        )}

        {actualStep === 3 && (
          <CoordsScreen
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            onRegionChange={this.onRegionChange}
            region={region}
          />
        )}

        {actualStep === 4 && (
          <ChooseKidsScreen
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            setActualKidName={this.setActualKidName}
            addKid={this.addKid}
            kids={kids}
            actualKidDate={actualKidDate}
            actualKidName={actualKidName}
            setActualKidDate={this.setActualKidDate}
            setGender={this.setGender}
            actualKidGender={actualKidGender}
            removeKidFromState={this.removeKidFromState}
          />
        )}

        {actualStep === 5 && (
          <ChooseHobbiesScreen
            prevStep={this.prevStep}
            submitData={this.submitData}
            hobbies={hobbies}
            changeHobbyStatus={this.changeHobbyStatus}
          />
        )}
      </View>
    );
  }
}
