import React from "react";
import {
  TouchableHighlight,
  View,
  Text,
  TextInput,
  Button
} from "react-native";
import styles from "./../style";
import { v4 as uuid } from "uuid";

const FeedbackModal = (props: {
  setFeedbackMessage: any;
  feedbackMessage: string;
  sendFeedback: any;
  feedbackTopic: any;
  setFeedbackTopic: any;
  activeTopic: string;
}): any => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <Text style={styles.feedbackHeaderText}>Napisz do nas!</Text>
      <Text style={styles.feedbackSubHeaderText}>
        Podziel się z nami swoją opinią co możemy poprawić lub zgłoś błąd
        działania aplikacji.
      </Text>

      <Text style={styles.feedbackTopic}>Temat wiadomości</Text>

      {props.feedbackTopic.map((topic: any, index: number) => {
        return (
          <View style={styles.checkboxWrapper} key={uuid()}>
            <TouchableHighlight
              onPress={() => props.setFeedbackTopic(index)}
              style={
                props.activeTopic == topic.text
                  ? styles.activeCheckbox
                  : styles.inActiveCheckbox
              }
            >
              <Button
                title=""
                color="#333"
                onPress={() => props.setFeedbackTopic(index)}
              />
            </TouchableHighlight>

            <Text
              onPress={() => props.setFeedbackTopic(index)}
              style={styles.checkboxText}
            >
              {topic.text}
            </Text>
          </View>
        );
      })}

      <TextInput
        multiline={true}
        numberOfLines={10}
        onChangeText={(feedbackMessage: string) =>
          props.setFeedbackMessage(feedbackMessage)
        }
        maxLength={800}
        style={styles.feedbackMessage}
        value={props.feedbackMessage}
        placeholder="Napisz wiadomość..."
        placeholderTextColor="#333"
      />

      <TouchableHighlight style={styles.feedbackBtn}>
        <Button
          title="Wyślij"
          color="#fff"
          onPress={() => props.sendFeedback()}
        />
      </TouchableHighlight>
    </View>
  );
};

export default FeedbackModal;
