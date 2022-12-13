import React, { useState, useEffect } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { loadAsync } from "expo-font";
import AppLoading from "expo-app-loading";
// import { composeWithDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";
import { LogBox } from "react-native";
import * as Notifications from 'expo-notifications';
import AppNavigator from "./navigation/AppNavigator";

import ProductsReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";

const rootReducer = combineReducers({
  products: ProductsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(reduxThunk));

const fetchFonts = () => {
  return loadAsync({
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
  });
};

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {shouldShowAlert: true};
  }
})





export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    LogBox.ignoreLogs(["Setting a timer"]);
  }, []);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }


  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
