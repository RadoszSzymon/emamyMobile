import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image
} from "react-native";
import Alert from "./../Alert/Alert";
import BottomPanel from "./../SharedComponents/BottomPanel";
import styles from "./style";
import ButtonComponent from "./../Utils/ButtonComponent";
import TextAreaComponent from "./../Utils/TextAreaComponent";
import { GlobalContext } from "./../../Context/GlobalContext";
import axios from "axios";
import { withNavigation } from "react-navigation";

const loaderImage: any = require("./../../assets/images/loader.gif");

interface FeedbackModalState {
  feedbackMessage: string;
  feedbackTopic: any;
  activeTopic: string;
}

interface FeedbackModalProps {
  navigation: any;
}

class FeedbackModal extends Component<FeedbackModalProps, FeedbackModalState> {
  constructor(props: FeedbackModalProps) {
    super(props);
    this.state = {
      feedbackMessage: "",
      feedbackTopic: [
        { index: 0, text: "Zgłoszenie błędu w aplikacji" },
        { index: 1, text: "Rozbudowanie funkcjonalności" },
        { index: 2, text: "Dodanie nowej funkcjonalności" },
        { index: 3, text: "Inne" }
      ],
      activeTopic: ""
    };
  }

  setFeedbackTopic = (index: number) => {
    let activeTopic = this.state.feedbackTopic.find((obj: any) => {
      return obj.index === index;
    });

    this.setState({ activeTopic: activeTopic.text });
  };

  setFeedbackMessage = (message: string) => {
    this.setState({ feedbackMessage: message });
  };

  sendFeedback = async () => {
    let topic = this.state.activeTopic;
    let message = this.state.feedbackMessage;
    let userId = this.context.userData.id;
    let API_URL = this.context.API_URL;

    let that = this;

    if (!topic || !message) {
      this.context.setAlert(
        true,
        "danger",
        "Prosimy o uzupełnienie wszystkich danych."
      );
    }

    if (topic && message && userId && API_URL) {
      await this.context.setShowLoader(true);

      axios
        .post(API_URL + "/api/saveUserFeedback", {
          topic: topic,
          message: message,
          userId: userId
        })
        .then(function(response) {
          if (response.data.status === "OK") {
            that.setState({
              activeTopic: "",
              feedbackMessage: ""
            });

            that.context.setAlert(true, "success", "Dziękujemy za wiadomość.");

            that.context.setShowLoader(false);

            that.props.navigation.goBack(null);
          }
        })
        .catch(function(error) {
          //console.log(error);
          that.context.setAlert(
            true,
            "danger",
            "Problem z wysłaniem wiadomości."
          );

          that.context.setShowLoader(false);

          that.props.navigation.goBack(null);
        });
    }
  };

  componentDidMount = (): void => {
    //console.log("FindUsers did mount");
    /*let user = this.context.userData;
    if (user && user.lattitude && user.longitude) {
      this.loadUsersNearCoords();
    }*/

    const { navigation } = this.props;
    this.focusListener = navigation.addListener("willFocus", () => {
      this.context.setCurrentNavName("");
    });
  };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  render() {
    const { feedbackTopic, activeTopic, feedbackMessage } = this.state;
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
            data-test="FindUsers"
          >
            {this.context.showLoader ? (
              <View style={styles.loaderContainer} data-test="loader">
                <Image
                  style={{ width: 100, height: 100 }}
                  source={loaderImage}
                />
              </View>
            ) : (
              <React.Fragment>
                <ScrollView keyboardShouldPersistTaps={"always"}>
                  <Text style={styles.feedbackHeaderText}>Napisz do nas!</Text>
                  <Text style={styles.feedbackSubHeaderText}>
                    Podziel się z nami swoją opinią co możemy poprawić lub zgłoś
                    błąd działania aplikacji.
                  </Text>

                  <Text style={styles.feedbackTopic}>Temat wiadomości</Text>

                  {feedbackTopic.map((topic: any, index: number) => {
                    return (
                      <View
                        style={styles.checkboxWrapper}
                        key={`FeedbackModal-${index}`}
                      >
                        <TouchableOpacity
                          onPress={() => this.setFeedbackTopic(index)}
                          style={
                            activeTopic == topic.text
                              ? styles.activeCheckbox
                              : styles.inActiveCheckbox
                          }
                        />
                        <Text
                          onPress={() => this.setFeedbackTopic(index)}
                          style={
                            activeTopic == topic.text
                              ? styles.checkboxTextActive
                              : styles.checkboxText
                          }
                        >
                          {topic.text}
                        </Text>
                      </View>
                    );
                  })}

                  <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <TextAreaComponent
                      placeholder="Napisz wiadomość..."
                      inputOnChange={(feedbackMessage: string) =>
                        this.setFeedbackMessage(feedbackMessage)
                      }
                      value={feedbackMessage}
                      maxLength={800}
                      multiline={true}
                      numberOfLines={10}
                    />
                  </View>

                  <ButtonComponent
                    pressButtonComponent={this.sendFeedback}
                    buttonComponentText="Wyślij"
                    fullWidth={true}
                    underlayColor="#dd904d"
                    whiteBg={false}
                    showBackIcon={false}
                  />
                </ScrollView>

                <BottomPanel
                  data-test="BottomPanel"
                  navigation={this.props.navigation}
                />
              </React.Fragment>
            )}
          </View>
        </SafeAreaView>
      </React.Fragment>
    );
  }
}
FeedbackModal.contextType = GlobalContext;
export default withNavigation(FeedbackModal);
