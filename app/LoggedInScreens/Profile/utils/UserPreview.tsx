import React from "react";
import { Platform, Text, View, Image } from "react-native";
import styles from "./../style";
import bike from "./../../../assets/images/bike.png";
import maternity from "./../../../assets/images/maternity.png";
import dotEmpty from "./../../../assets/images/dotEmpty.png";

const UserPreview = (props: any) => (
  <View>
    <View style={styles.userPreviewSectionContainer}>
      <View style={styles.userPreviewSectionHeaderContainer}>
        <Image style={styles.userPreviewSectionHeaderImage} source={bike} />
        <Text style={styles.userPreviewSectionHeaderText}>Hobby</Text>
      </View>
      {props.hobbies.map((hobby: any, i: number) => {
        return (
          <View style={styles.userPreviewListItemContainer}>
            <Image style={styles.userPreviewListItemImage} source={dotEmpty} />
            <Text style={styles.userPreviewSectionListText}>{hobby.name}</Text>
          </View>
        );
      })}
    </View>

    <View style={styles.userPreviewSectionContainer}>
      <View style={styles.userPreviewSectionHeaderContainer}>
        <Image
          style={styles.userPreviewSectionHeaderImage}
          source={maternity}
        />
        <Text style={styles.userPreviewSectionHeaderText}>Dzieci</Text>
      </View>
      {props.kids.map((kid: any, i: number) => {
        if (kid.child_gender === "male") {
          return (
            <View style={styles.userPreviewListItemContainer}>
              <Image
                style={styles.userPreviewListItemImage}
                source={dotEmpty}
              />
              <Text style={styles.userPreviewSectionListText}>
                {kid.name} - chłopiec - {kid.date_of_birth}
              </Text>
            </View>
          );
        } else if (kid.child_gender === "female") {
          return (
            <View style={styles.userPreviewListItemContainer}>
              <Image
                style={styles.userPreviewSectionHeaderImage}
                source={dotEmpty}
              />
              <Text style={styles.userPreviewSectionListText}>
                {kid.name} - dziewczynka - {kid.date_of_birth}
              </Text>
            </View>
          );
        }
      })}
    </View>
  </View>
);

export default UserPreview;
