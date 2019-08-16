import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import SingleCategoryOnList from "./SingleCategoryOnList";
import styles from "../style";
import axios from "axios";

interface CategoriesListState {
  categories: [];
}

interface CategoriesListProps {
  API_URL: string;
  user: any;
  getPostByCategoryId: any;
}

export default class CategoriesList extends Component<
  CategoriesListProps,
  CategoriesListState
> {
  constructor(props: CategoriesListProps) {
    super(props);
    this.state = {
      categories: []
    };

    this.getCategories = this.getCategories.bind(this);
  }

  getCategories = (): void => {
    try {
      let API_URL = this.props.API_URL;
      let that = this;

      axios
        .get(API_URL + "/api/getPostsCategories")
        .then(function(response) {
          if (response.data.status === "OK") {
            that.setState({ categories: response.data.result });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount = (): void => {
    this.getCategories();
  };

  render() {
    let { categories } = this.state;

    return (
      <View style={styles.relative}>
        <View style={styles.categoriesListContainer}>
          <Text style={styles.categoriesListTextHeader}>Kategorie</Text>
          <View style={styles.categoriesListContainer}>
            {categories.map((category: any, i: number) => {
              return (
                <SingleCategoryOnList
                  key={`SingleCategoryOnList-${i}`}
                  getPostByCategoryId={this.props.getPostByCategoryId}
                  category={category}
                />
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}
