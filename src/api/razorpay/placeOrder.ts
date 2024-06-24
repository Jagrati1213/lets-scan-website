import { message } from "antd";
import api from "..";
import { CartItemsI } from "../../types";

export interface PlaceOrderParam {
  paymentId: string;
  vendorId: string;
  name: string;
  email: string;
  orderList: CartItemsI[];
  note?: string;
  tableNumber?: number;
  totalAmount: number;
}

export interface PlaceOrderResponse {
  statusCode: number;
  statusText: string;
  success: boolean;
  data: {
    customer: { name: string; email: string };
    tableNumber: number;
    note: string;
    orderToken: string;
    verifyCode: number;
    orderStatus: string;
    orderList: [
      {
        menuId: string;
        quantity: number;
        price: number;
        _id: string;
        createdAt: string;
        updatedAt: string;
      }
    ];
    paymentId: string;
    _id: string;
  };
}

const placeOrder = async (
  param: PlaceOrderParam
): Promise<PlaceOrderResponse["data"] | null> => {
  const { email, name, orderList, paymentId, vendorId } = param;
  if (vendorId && paymentId && name && email && orderList.length > 0) {
    const { data } = await api.post<PlaceOrderResponse>(
      "/api/v1/order",
      param,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data.data;
  } else {
    message.error("Data missing!!!");
    return null;
  }
};
export default placeOrder;
