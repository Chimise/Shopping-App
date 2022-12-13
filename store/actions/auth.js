import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const DID_TRY_AUTO_LOGIN = "DID_TRY_AUTO_LOGIN";

export const didTryAutoLogin = () => {
  return { type: DID_TRY_AUTO_LOGIN };
};

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC0E8zucbfDH16r7_V-DG3sYmfqFCwa8pk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      if (!response.ok) {
        const errResData = await response.json();
        const errorId = errResData.error.errors[0].message;
        let message = "Something went wrong!";
        if (errorId === "EMAIL_EXISTS") {
          message = "This email exists already";
        }
        throw new Error(message);
      }

      const resData = await response.json();

      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          parseInt(resData.expiresIn) * 1000
        )
      );
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );
      await saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC0E8zucbfDH16r7_V-DG3sYmfqFCwa8pk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      if (!response.ok) {
        const errResData = await response.json();
        const errorId = errResData.error.errors[0].message;
        let message = "Something went wrong!";
        if (errorId === "EMAIL_NOT_FOUND") {
          message = "This email could not be found";
        } else if (errorId === "INVALID_PASSWORD") {
          message = "This password is not valid";
        }

        throw new Error(message);
      }

      const resData = await response.json();

      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          parseInt(resData.expiresIn) * 1000
        )
      );
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );
      await saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return {
    type: LOGOUT,
  };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = async (token, userId, expirationDate) => {
  await AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
