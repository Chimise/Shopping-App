import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;

    try {
        const response = await fetch(
          `https://rn-shopping-app-1a192-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`
        );
  
        if (!response.ok) {
          throw new Error("Fetching data failed");
        }
  
        const resData = await response.json();
        const loadedOrders = [];
        for (const key in resData) {
          loadedOrders.push(
            new Order(
              key,
              resData[key].cartItems,
              resData[key].totalAmount,
              new Date(resData[key].date),
              
            )
          );
        }
  
        dispatch({
          type: SET_ORDERS,
          orders: loadedOrders,
        });
      } catch (err) {
        if (!err.message) {
          err.message = "Fetching data failed";
        }
        throw err;
      }
    };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();
    const response = await fetch(
      `https://rn-shopping-app-1a192-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Creating data failed");
    }

    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date,
      },
    });

    for (const cartItem of cartItems) {
      const pushToken = cartItem.productPushToken;
      

      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Host': 'exp.host',
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: pushToken,
          title: 'Order was placed',
          body: cartItem.productTitle
        })
      })
    }
  };
};
