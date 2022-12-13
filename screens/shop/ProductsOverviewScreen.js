import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Button,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import * as productActions from "../../store/actions/products";
import * as cartActions from "../../store/actions/cart";
import Colors from "../../constants/Colors";

const ProductOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadedProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadedProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadedProducts]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadedProducts)
    return () => {
      unsubscribe()
    }
  }, [loadedProducts])

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };




  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred</Text>
        <Button title="Try again" color={Colors.primary} onPress={loadedProducts} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={Platform.OS === 'android' ? 50 : "large"} color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && !products) {
    return (
      <View style={styles.centered}>
        <Text>No product found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadedProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={(item, index) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <View>
            <Button
              title="View Details"
              color={Colors.primary}
              onPress={() => {
                selectItemHandler(itemData.item.id, itemData.item.title);
              }}
            ></Button>
          </View>
          <View style={{ width: "45%" }}>
            <Button
              title="To Cart"
              color={Colors.primary}
              onPress={() => {
                dispatch(cartActions.addToCart(itemData.item));
              }}
            />
          </View>
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export const screenOptions = (navData) => {
  return {
    headerTitle: "All Products",
    headerLeft: (props) => {
      return (
        <HeaderButtons {...props} HeaderButtonComponent={HeaderButton}>
          <Item
            title="Menu"
            iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
            onPress={() => navData.navigation.toggleDrawer()}
          />
        </HeaderButtons>
      )
    },
    headerRight: (props) => (
      <HeaderButtons {...props} HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => navData.navigation.navigate("Cart")}
        />
      </HeaderButtons>
    ),
  };
};

export default ProductOverviewScreen;
