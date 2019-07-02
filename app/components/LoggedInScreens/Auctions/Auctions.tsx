import React, { Component, Suspense } from "react";
import {
  TouchableHighlight,
  ImageBackground,
  Button,
  Text,
  View
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { btnFullWidthFilledContainer } from "./../../../assets/global/globalStyles";
import { btnFullWidth } from "./../../../assets/global/globalStyles";
import axios from "axios";
import SingleAuctionOnList from "./utils/SingleAuctionOnList";
import styles from "./style";
import { v4 as uuid } from "uuid";
import Alert from "./../../../Alert/Alert";
const auctionsBg: any = require("./../../../assets/images/auctionsBgMin.jpg");

const ProductDetails = React.lazy(() => import("./utils/ProductDetails"));
const AddNewProductBox = React.lazy(() => import("./utils/AddNewProductBox"));
const FilterModal = React.lazy(() =>
  import("./../SharedComponents/FilterModal")
);
const ActiveFilters = React.lazy(() =>
  import("./../SharedComponents/ActiveFilters")
);

interface AuctionsProps {
  API_URL: string;
  user: {
    lattitude: number;
    longitude: number;
    id: number;
  };
  openMessages: any;
  openAuctionId: number;
  openAuctionUserId: number;
}

interface AuctionsState {
  productList: any;
  displayProductDetails: boolean;
  displayNewProductBox: boolean;
  selectedProductId: number;
  selectedProductUserId: number;
  filterDistance: string;
  filterPrice: string;
  filterStatus: string;
  showFilterModal: boolean;
  filterOptions: any;
  filterModalName: string;
  filterData: any;
  showAlert: boolean;
  alertType: string;
  alertMessage: string;
}

export default class Auctions extends Component<AuctionsProps, AuctionsState> {
  constructor(props: AuctionsProps) {
    super(props);
    this.state = {
      productList: [],
      displayProductDetails: false,
      displayNewProductBox: false,
      selectedProductId: 0,
      selectedProductUserId: 0,
      filterDistance: "",
      filterPrice: "",
      filterStatus: "",
      showFilterModal: false,
      filterModalName: "",
      filterData: {
        distance: [
          { text: "1km" },
          { text: "2km" },
          { text: "5km" },
          { text: "10km" },
          { text: "50km" },
          { text: "100km" }
        ],
        price: [
          { text: "0-20zł" },
          { text: "21zł-50zł" },
          { text: "51zł-100zł" },
          { text: "100zł-200zł" },
          { text: "201zł +" }
        ],
        status: [{ text: "Nowe" }, { text: "Używane" }]
      },
      filterOptions: [
        {
          title: "Odległość",
          index: 0
        },
        {
          title: "Cena",
          index: 1
        },
        {
          title: "Status",
          index: 2
        }
      ],
      showAlert: false,
      alertType: "",
      alertMessage: ""
    };

    this.getProducts = this.getProducts.bind(this);
    this.setSelectedProduct = this.setSelectedProduct.bind(this);
    this.changeDisplayNewProductBox = this.changeDisplayNewProductBox.bind(
      this
    );
    this.setDisplayProductDetails = this.setDisplayProductDetails.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.filterResults = this.filterResults.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.addNewProduct = this.addNewProduct.bind(this);
  }

  addNewProduct = (
    photos: any,
    maleGender: boolean,
    femaleGender: boolean,
    newProduct: boolean,
    secondHandProduct: boolean,
    currentUser: any,
    name: string,
    description: string,
    selectedCategoryId: any,
    price: number
  ): void => {
    let childGender;
    let productState;
    let API_URL = this.props.API_URL;
    let photosArray = "[" + '"' + photos.join('","') + '"' + "]";

    if (maleGender) {
      childGender = "boy";
    } else if (femaleGender) {
      childGender = "girl";
    }

    if (newProduct) {
      productState = 0;
    } else if (secondHandProduct) {
      productState = 1;
    }

    let that = this;

    axios
      .post(API_URL + "/api/saveProduct", {
        userId: currentUser.id,
        name: name,
        description: description,
        categoryId: selectedCategoryId,
        childGender: childGender,
        price: price,
        lat: currentUser.lattitude,
        lng: currentUser.longitude,
        status: 0,
        state: productState,
        photos: photosArray
      })
      .then(function(response) {
        if (response.data.status === "OK") {
          that.setState({ showAlert: false });

          that.setState({
            showAlert: true,
            alertType: "success",
            alertMessage: "Dziękujemy za dodanie nowego produktu."
          });
          that.changeDisplayNewProductBox();
        }
      })
      .catch(function(error) {
        that.setState({ showAlert: false });

        that.setState({
          showAlert: true,
          alertType: "danger",
          alertMessage: "Problem z dodaniem nowego produktu"
        });
        console.log(error);
      });
  };

  removeFilter = (filterName: string): void => {
    const { filterDistance, filterPrice, filterStatus } = this.state;

    if (filterName === "Odległość") {
      this.getFilteredAuctionsList("", filterPrice, filterStatus, false);
    } else if (filterName === "Cena") {
      this.getFilteredAuctionsList(filterDistance, "", filterStatus, false);
    } else if (filterName === "Status") {
      this.getFilteredAuctionsList(filterDistance, filterPrice, "", false);
    }
  };

  filterResults = (filterName: string, filterValue: string): void => {
    const { filterDistance, filterPrice, filterStatus } = this.state;
    if (filterName === "Odległość") {
      this.getFilteredAuctionsList(
        filterValue,
        filterPrice,
        filterStatus,
        true
      );
    } else if (filterName === "Cena") {
      this.getFilteredAuctionsList(
        filterDistance,
        filterValue,
        filterStatus,
        true
      );
    } else if (filterName === "Status") {
      this.getFilteredAuctionsList(
        filterDistance,
        filterPrice,
        filterValue,
        true
      );
    }
  };

  setShowFilterModal = (selectedName = ""): void => {
    if (selectedName !== "") {
      this.setState({
        showFilterModal: !this.state.showFilterModal,
        filterModalName: selectedName
      });
    } else {
      this.setState({ showFilterModal: !this.state.showFilterModal });
    }
  };

  renderItem(item: any, index: any) {
    return (
      <TouchableHighlight
        style={btnFullWidthFilledContainer}
        onPress={() => this.setShowFilterModal(item.item.title)}
      >
        <Text
          style={{
            fontSize: 14,
            textAlign: "center",
            lineHeight: 30,
            color: "#fff"
          }}
        >
          {item.item.title}
        </Text>
      </TouchableHighlight>
    );
  }

  getFilteredAuctionsList = (
    distance: string,
    price: string,
    status: string,
    showFilterModal: boolean
  ): void => {
    let API_URL = this.props.API_URL;
    let userLat = this.props.user.lattitude;
    let userLng = this.props.user.longitude;

    let that = this;

    if (distance || price || status) {
      axios
        .post(API_URL + "/api/loadProductsFilter", {
          distance: distance,
          price: price,
          status: status,
          currentUserLat: userLat,
          currentUserLng: userLng
        })
        .then(function(response) {
          if (response.data.status === "OK") {
            let newDistance = "";
            let newPrice = "";
            let newStatus = "";

            response.data.resultParameters.map(
              (resultParameter: any, i: number) => {
                //resultParameter.default means we get that parameter to loadUsersFilter
                if (
                  resultParameter.name === "distance" &&
                  resultParameter.default === false
                ) {
                  newDistance = resultParameter.value;
                } else if (
                  resultParameter.name === "price" &&
                  resultParameter.default === false
                ) {
                  newPrice = resultParameter.value;
                } else if (
                  resultParameter.name === "status" &&
                  resultParameter.default === false
                ) {
                  newStatus = resultParameter.value;
                }
              }
            );

            if (showFilterModal) {
              that.setState({
                productList: response.data.result,
                filterDistance: newDistance,
                filterPrice: newPrice,
                filterStatus: newStatus,
                showFilterModal: !that.state.showFilterModal
              });
            } else {
              that.setState({
                productList: response.data.result,
                filterDistance: newDistance,
                filterPrice: newPrice,
                filterStatus: newStatus
              });
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.getProducts();
    }
  };

  changeDisplayNewProductBox = (): void => {
    this.setState({ displayNewProductBox: !this.state.displayNewProductBox });
    this.getProducts();
  };

  getProducts = (): void => {
    let API_URL = this.props.API_URL;
    let userLat = this.props.user.lattitude;
    let userLng = this.props.user.longitude;

    let that = this;

    axios
      .post(API_URL + "/api/loadProductBasedOnCoords", {
        lat: userLat,
        lng: userLng
      })
      .then(function(response) {
        if (response.data.status === "OK") {
          that.setState({
            productList: response.data.result,
            filterDistance: "",
            filterPrice: "",
            filterStatus: ""
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  setDisplayProductDetails = (): void => {
    this.setState(prevState => ({
      displayProductDetails: !prevState.displayProductDetails
    }));
  };

  setSelectedProduct = (id: number, productUserId: number) => {
    this.setState({
      selectedProductId: id,
      displayProductDetails: true,
      selectedProductUserId: productUserId
    });
  };

  componentDidMount = (): void => {
    //load all products based on user coords
    this.getProducts();

    if (
      this.props.openAuctionId &&
      this.props.openAuctionId !== 0 &&
      this.props.openAuctionUserId &&
      this.props.openAuctionUserId !== 0
    ) {
      this.setSelectedProduct(
        this.props.openAuctionId,
        this.props.openAuctionUserId
      );
    }
  };

  render() {
    const {
      displayProductDetails,
      selectedProductUserId,
      displayNewProductBox,
      productList,
      selectedProductId,
      showFilterModal,
      filterOptions,
      filterData,
      filterModalName,
      filterDistance,
      filterPrice,
      filterStatus,
      showAlert,
      alertType,
      alertMessage
    } = this.state;
    return (
      <View>
        {!displayProductDetails && !displayNewProductBox && !showFilterModal && (
          <ImageBackground source={auctionsBg} style={{ width: "100%" }}>
            <Text style={styles.pageTitle}>Sprzedawaj i{"\n"}kupuj</Text>
          </ImageBackground>
        )}

        {!displayProductDetails &&
          !displayNewProductBox &&
          productList &&
          showFilterModal && (
            <Suspense fallback={<Text>Wczytywanie...</Text>}>
              <FilterModal
                filterOptions={filterData}
                closeFilter={this.setShowFilterModal}
                filterModalName={filterModalName}
                filterResults={this.filterResults}
              />
            </Suspense>
          )}

        {!displayProductDetails &&
          !displayNewProductBox &&
          productList &&
          !showFilterModal && (
            <View>
              <Text style={styles.filterResultsHeaderText}>Filtruj wyniki</Text>
              <View style={styles.filterResultsCarousel}>
                <Carousel
                  layout={"default"}
                  activeSlideAlignment={"start"}
                  data={filterOptions}
                  renderItem={this.renderItem}
                  itemWidth={100}
                  sliderWidth={styles.fullWidth}
                  removeClippedSubviews={false}
                />
              </View>
            </View>
          )}

        {!displayProductDetails && !displayNewProductBox && (
          <Suspense fallback={<Text>Wczytywanie...</Text>}>
            <ActiveFilters
              filterDistance={filterDistance}
              filterPrice={filterPrice}
              filterStatus={filterStatus}
              showFilterModal={showFilterModal}
              removeFilter={this.removeFilter}
            />
          </Suspense>
        )}

        {!displayProductDetails && !displayNewProductBox && !showFilterModal && (
          <View>
            <View style={styles.productListContainer}>
              {productList && productList.length > 0 ? (
                productList.map((product: any, i: number) => {
                  return (
                    <SingleAuctionOnList
                      product={product}
                      key={uuid()}
                      API_URL={this.props.API_URL}
                      setSelectedProduct={this.setSelectedProduct}
                    />
                  );
                })
              ) : (
                <Text>Brak wyników</Text>
              )}
            </View>
            <View style={{ marginBottom: 10 }}>
              <TouchableHighlight
                style={styles.productDetailsBtn}
                onPress={() => this.changeDisplayNewProductBox()}
              >
                <Text style={styles.peachBtnText}>Dodaj produkt</Text>
              </TouchableHighlight>
            </View>
          </View>
        )}

        {displayProductDetails && !showFilterModal && (
          <Suspense fallback={<Text>Wczytywanie...</Text>}>
            <ProductDetails
              currentUser={this.props.user}
              API_URL={this.props.API_URL}
              openMessages={this.props.openMessages}
              productId={selectedProductId}
              productUserId={selectedProductUserId}
              setDisplayProductDetails={this.setDisplayProductDetails}
            />
          </Suspense>
        )}

        {displayNewProductBox && !showFilterModal && (
          <Suspense fallback={<Text>Wczytywanie...</Text>}>
            <AddNewProductBox
              currentUser={this.props.user}
              API_URL={this.props.API_URL}
              changeDisplayNewProductBox={this.changeDisplayNewProductBox}
              addNewProduct={this.addNewProduct}
            />
          </Suspense>
        )}

        {showAlert != false && (
          <Alert alertType={alertType} alertMessage={alertMessage} />
        )}
      </View>
    );
  }
}
