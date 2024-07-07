import api from "..";

export interface GetOrderResponse {
  statusCode: number;
  statusText: string;
  success: true;
  data: {
    orderDetails: {
      _id: string;
      customer: {
        name: string;
        email: string;
        _id: string;
      };
      orderList: {
        menuId: string;
        quantity: number;
        price: number;
        name: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
      }[];
      orderToken: number;
      verifyCode: number;
      paymentId: string;
      orderStatus: "Pending" | "Complete";
      tableNumber: number;
      note: string;
      vendorId: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      totalAmount: number;
    };
    restaurant: string;
  };
}

const getOrder = async (orderId: string): Promise<GetOrderResponse["data"]> => {
  const response = await api.get<GetOrderResponse>(
    `api/v1/lets-scan/order-details/${orderId}`
  );
  return response.data.data;
};
export default getOrder;
