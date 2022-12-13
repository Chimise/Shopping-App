import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Text,
  Platform,
  StyleSheet,
  View,
  ActivityIndicator,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import * as orderActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";

const OrdersScreen = (props) => {
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const loadOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(orderActions.fetchOrders());
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [setError, dispatch, setIsLoading]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const listener = props.navigation.addListener('focus', loadOrders);
    return () => {
      listener();
    }
  }, [loadOrders])

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ marginBottom: 10 }}>{error}</Text>
        <Button title="Try Again" color={Colors.primary} onPress={loadOrders} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={Platform.OS === 'android' ? 50 : "large" } color={Colors.primary} />
      </View>
    )
  }

  if(orders.length === 0) {
    return <View style={styles.centered}><Text style={{width: '90%'}}>No order found, maybe start ordering some products</Text></View>
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const screenOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
    headerLeft: (props) => (
      <HeaderButtons {...props} HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => navData.navigation.toggleDrawer()}
        />
      </HeaderButtons>
    ),
  };
};

export default OrdersScreen;
