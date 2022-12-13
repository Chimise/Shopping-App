import React from "react";
import { FlatList, Platform, View, Button, Alert, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Item, HeaderButtons } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

import ProductItem from "../../components/shop/ProductItem";
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = (id) => {
      props.navigation.navigate('EditProduct', {productId: id})
  }

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [{text: 'No', style: 'default'}, {text: 'Yes', style: 'destructive', onPress: () => {
      dispatch(productsActions.deleteProduct(id))
    }}])
  }

  if(userProducts.length === 0) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>No product found, maybe start creating some?</Text></View>
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id)
          }}
        >
          <View style={{width: '45%'}}>
            <Button
              title="Edit"
              color={Colors.primary}
              onPress={() => {
                  editProductHandler(itemData.item.id)
              }}
            ></Button>
          </View>
          <View style={{ width: "45%" }}>
            <Button title="Delete" color={Colors.primary} onPress={() => {
                deleteHandler(itemData.item.id)
            }} />
          </View>
        </ProductItem>
      )}
    />
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "Your Products",
    headerLeft: (props) => (
      <HeaderButtons {...props} HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => navData.navigation.toggleDrawer()}
        />
      </HeaderButtons>
    ),
    headerRight: (props) => (
        <HeaderButtons {...props} HeaderButtonComponent={HeaderButton}>
          <Item
            title="Add"
            iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
            onPress={() => navData.navigation.navigate('EditProduct')}
          />
        </HeaderButtons>
      ),
  };
};

export default UserProductsScreen;
