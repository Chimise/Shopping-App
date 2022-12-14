import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import CartItem from "./CartItem";
import Colors from "../../constants/Colors";
import Card from '../UI/Card';

const OrderItem = (props) => {
  const [showDetail, setShowDetail] = useState(false); 
  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <Button
        color={Colors.primary}
        title={showDetail ? 'Hide Details' : 'Show Details'}
        onPress={() => {
          setShowDetail((prevState) => !prevState); 
        }}
      />
      {showDetail && <View style={styles.detailItems}>
        {props.items.map(cartItem => <CartItem key={cartItem.productId} quantity={cartItem.quantity} amount={cartItem.sum} title={cartItem.productTitle} />)}
        </View>}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    alignItems: "center",
    margin: 20,
    padding: 10,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  date: {
    fontSize: 13,
    fontFamily: "open-sans",
    color: "#888",
  },
  detailItems: {
      width: '100%'
  }
});

export default OrderItem;
