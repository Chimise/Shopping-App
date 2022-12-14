import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import {Ionicons} from '@expo/vector-icons'

const CartItem = (props) => {
  return <View style={styles.cartItem}>
      <View style={styles.itemData}>
          <Text style={styles.quantity}>{props.quantity} </Text>
          <Text numberOfLines={1} style={styles.mainText}>{props.title.trim().length > 9 ? props.title.slice(0, 9) + '...' : props.title}</Text>
      </View>
      <View style={styles.itemData}>
          <Text style={styles.mainText}>{props.amount.toFixed(2)}</Text>
          {props.deletable && <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
              <Ionicons name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'} size={23} color="red" />
          </TouchableOpacity>}
      </View>
  </View>;
};

const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    quantity: {
        fontFamily: 'open-sans',
        color: '#888',
        fontSize: 16,
    },
    mainText: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
    },
    deleteButton: {
        marginLeft: 20
    }
});

export default CartItem;

