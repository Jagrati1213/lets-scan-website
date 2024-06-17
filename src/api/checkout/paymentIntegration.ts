import api from "..";
import { paymentIntegrationT } from "../../types";
import { paymentSuccessHandler } from "./paymentSucess";

export const paymentIntegrationHandler = async ({
  userId,
  orderList,
  totalAmount,
}: paymentIntegrationT) => {
  // GET RAZOR KEY
  const razorKeyResponse = await api.get("/api/v1/order/razor-key");
  const {
    data: { key },
  } = razorKeyResponse.data;

  //   GET ORDER ID
  const razorOrderResponse = await api.post("api/v1/order/checkout", {
    amount: totalAmount,
  });

  const {
    data: { order },
  } = razorOrderResponse.data;

  if (!order) {
    console.error("INVALID ORDER DETAILS!");
    return;
  }

  //   GENERATE RAZOR PAY OPTIONS
  const options = {
    key,
    amount: order.amount,
    currency: order.currency,
    name: "Let's Scan",
    description: "Pay & Enjoy Your Food!",
    image: "https://example.com/your_logo",
    order_id: order.id,
    handler: async function (response: any) {
      await paymentSuccessHandler(response, userId, orderList);
    },
    prefill: {
      name: "Jagrati Gupta",
      email: "jagratigupta@gmail.com",
      contact: "9000090000",
    },
    notes: {
      address: "Order Minder",
    },
    theme: {
      color: "#49274a",
    },
  };

  //   RAZOR PAY POPUP
  var rzp1 = new window.Razorpay(options);
  rzp1.open();
};
