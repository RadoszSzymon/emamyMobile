import React from "react";
import { Text, View, TouchableHighlight } from "react-native";
import styles from "./style";

const ActiveFilters = (props: any) => (
  <View>
    {props.filterDistance ||
    props.filterChildAge ||
    props.filterChildGender ||
    props.filterHobbyName
      ? !props.showFilterModal && (
          <Text style={styles.activeFiltersText}>Aktywne filtry: </Text>
        )
      : null}

    <View style={styles.activeFiltersConatiner}>
      {props.filterDistance && !props.showFilterModal ? (
        <View style={styles.removeFilterBtnContainer}>
          <Text style={styles.removeFilterText}>
            Odległość - {props.filterDistance}
          </Text>
          <TouchableHighlight
            style={styles.removeFilterBtn}
            onPress={() => props.removeFilter("Odległość")}
          >
            <Text style={styles.removeFilterBtnText}>-</Text>
          </TouchableHighlight>
        </View>
      ) : null}

      {props.filterChildAge && !props.showFilterModal ? (
        <View style={styles.removeFilterBtnContainer}>
          <Text style={styles.removeFilterText}>
            Wiek dziecka - {props.filterChildAge}
          </Text>
          <TouchableHighlight
            style={styles.removeFilterBtn}
            onPress={() => props.removeFilter("Wiek dziecka")}
          >
            <Text style={styles.removeFilterBtnText}>-</Text>
          </TouchableHighlight>
        </View>
      ) : null}

      {props.filterChildGender && !props.showFilterModal ? (
        <View style={styles.removeFilterBtnContainer}>
          <Text style={styles.removeFilterText}>
            Płeć dziecka - {props.filterChildGender}
          </Text>
          <TouchableHighlight
            style={styles.removeFilterBtn}
            onPress={() => props.removeFilter("Płeć dziecka")}
          >
            <Text style={styles.removeFilterBtnText}>-</Text>
          </TouchableHighlight>
        </View>
      ) : null}

      {props.filterHobbyName && !props.showFilterModal ? (
        <View style={styles.removeFilterBtnContainer}>
          <Text style={styles.removeFilterText}>
            Hobby - {props.filterHobbyName}
          </Text>
          <TouchableHighlight
            style={styles.removeFilterBtn}
            onPress={() => props.removeFilter("Hobby")}
          >
            <Text style={styles.removeFilterBtnText}>-</Text>
          </TouchableHighlight>
        </View>
      ) : null}

      {props.filterPrice && !props.showFilterModal ? (
        <View style={styles.removeFilterBtnContainer}>
          <Text style={styles.removeFilterText}>
            Cena - {props.filterPrice}
          </Text>
          <TouchableHighlight
            style={styles.removeFilterBtn}
            onPress={() => props.removeFilter("Cena")}
          >
            <Text style={styles.removeFilterBtnText}>-</Text>
          </TouchableHighlight>
        </View>
      ) : null}

      {props.filterStatus && !props.showFilterModal ? (
        <View style={styles.removeFilterBtnContainer}>
          <Text style={styles.removeFilterText}>
            Status - {props.filterStatus}
          </Text>
          <TouchableHighlight
            style={styles.removeFilterBtn}
            onPress={() => props.removeFilter("Status")}
          >
            <Text style={styles.removeFilterBtnText}>-</Text>
          </TouchableHighlight>
        </View>
      ) : null}
    </View>
  </View>
);

export default ActiveFilters;
