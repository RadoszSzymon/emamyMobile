import React from "react";
import { Text, View, TextInput, ImageBackground } from "react-native";
import styles from "./../style";
import ButtonComponent from "./../../../Utils/ButtonComponent";
import InputComponent from "./../../../Utils/InputComponent";
import TextAreaComponent from "./../../../Utils/TextAreaComponent";

const fillInfoBg: any = require("./../../../../assets/images/fillInfoBgMin.jpg");

const AgeDescScreen = (props: {
  handleChange: any;
  age: any;
  desc: string;
  nextStep: any;
}): any => {
  return (
    <View>
      <ImageBackground source={fillInfoBg} style={{ width: "100%" }}>
        <Text style={styles.headerText}>Opowiedz nam o{"\n"}sobie</Text>
      </ImageBackground>

      <View style={styles.infoContainer}>
        <Text style={styles.fillInfoHeader}>Uzupełnij ogólne informacje</Text>
        <Text style={styles.subText}>Wiek</Text>

        <InputComponent
          placeholder="Wiek"
          inputOnChange={(age: string) => props.handleChange("age", age)}
          value={String(props.age)}
          secureTextEntry={false}
          maxLength={2}
        />

        <Text style={styles.subText}>
          Opis * ({props.desc.length}/250 znaków)
        </Text>

        <TextAreaComponent
          placeholder="Napisz kilka słów o sobie..."
          inputOnChange={(desc: string) => props.handleChange("desc", desc)}
          value={props.desc}
          maxLength={250}
          multiline={true}
          numberOfLines={10}
        />
      </View>

      {props.age != 0 && (
        <ButtonComponent
          pressButtonComponent={props.nextStep}
          buttonComponentText="Dalej"
          fullWidth={true}
          underlayColor="#dd904d"
        />
      )}
    </View>
  );
};

export default AgeDescScreen;
