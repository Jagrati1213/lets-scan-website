import api from "..";

export interface GetVendorsResponse {
  statusCode: number;
  statusText: string;
  success: boolean;
  data: {
    _id: string;
    restaurant: string;
  }[];
}

const getVendors = async (): Promise<GetVendorsResponse["data"]> => {
  const response = await api.get<GetVendorsResponse>(
    "/api/v1/lets-scan/all-venders"
  );

  return response.data.data;
};

export default getVendors;
