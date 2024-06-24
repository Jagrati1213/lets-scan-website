import api from "..";

export interface CheckoutResponse {
  statusCode: number;
  statusText: string;
  success: boolean;
  data: {
    order: {
      amount: number;
      amount_due: number;
      amount_paid: number;
      attempts: number;
      created_at: number;
      currency: string;
      entity: string;
      id: string;
      notes: [];
      offer_id: null;
      receipt: string;
      status: string;
    };
  };
}

const checkoutOrder = async ({
  totalAmount,
  vendorId,
}: {
  totalAmount: number;
  vendorId: string;
}): Promise<CheckoutResponse["data"]> => {
  const razorOrderResponse = await api.post<CheckoutResponse>(
    "api/v1/order/checkout",
    {
      amount: totalAmount,
      vendorId,
    }
  );
  return razorOrderResponse.data.data;
};
export default checkoutOrder;
