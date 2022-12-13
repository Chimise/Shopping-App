import React from "react";
import { ScrollView, StyleSheet, Button } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import {DrawerItemList} from '@react-navigation/drawer';
import Colors from "../../constants/Colors";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";

const CustomDrawerContent = ({dispatch, ...props}) => {
  

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: "always", horizontal: "never" }}
      >
        <DrawerItemList {...props} />
        <Button
          title="Logout"
          color={Colors.primary}
          onPress={() => {
            dispatch(authActions.logout());
            // props.navigation.navigate("Auth");
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomDrawerContent;
