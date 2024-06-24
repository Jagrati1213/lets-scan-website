import api from "..";
import { CartItemsI } from "../../types";

export const paymentSuccessHandler = async (
  response: any,
  vendorId: string,
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
          vendorId: vendorId,
          name: "Jagrati Gupta",
          email: "jagratiguptar@gmail.com",
          tableNumber: 2,
          note: "Extra Chatni",
          orderList: orderList,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const orderData = orderResponse.data;
    }
  } catch (error) {
    console.log("ERROR IN RAZOR SUCCESS!");
  }
};
