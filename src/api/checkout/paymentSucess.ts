import api from "..";
import { CartItemsI } from "../../types";

export const paymentSuccessHandler = async (
  response: any,
  userId: string,
  orderList: CartItemsI[]
) => {
  try {
    // GET RAZOR PAY SUCCESS DATA
    const body = { ...response };

    // CHECK PAYMENT SUCCESS
    const validateResponse = await api.post(
      `/api/v1/order/payment-verify`,
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const { success, data } = validateResponse.data;

    // SEND ORDER DETAILS IN BACKEND
    if (success) {
      const orderResponse = await api.post(
        "api/v1/order",
        {
          paymentId: data.paymentId,
          userId: userId,
          name: "Ashish Kumar",
          email: "ashishkumar@gmail.com",
          orderList: orderList,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const orderData = orderResponse.data;
      console.log(orderData);
    }
  } catch (error) {
    console.log("ERROR IN RAZOR SUCCESS!");
  }
};
