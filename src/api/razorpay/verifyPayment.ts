import api from "..";

export interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  vendorId: string;
}
export interface VerifyPaymentResponse {
  statusCode: number;
  statusText: string;
  data: {
    paymentId: string;
  };
  success: boolean;
}

const verifyPayment = async (
  body: VerifyPaymentBody
): Promise<VerifyPaymentResponse> => {
  const response = await api.post<VerifyPaymentResponse>(
    `/api/v1/order/payment-verify`,
    body,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};
export default verifyPayment;
