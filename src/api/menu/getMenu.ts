import api from "..";
import { MenuItemT } from "../../types";

export interface GetMenuResponse {
  statusCode: number;
  statusText: string;
  success: boolean;
  data: { menuItems: MenuItemT[]; isOpen: boolean };
}

const getMenu = async (useId: string): Promise<GetMenuResponse["data"]> => {
  const response = await api.get<GetMenuResponse>(
    `api/v1/lets-scan/menu-lists/${useId}`
  );
  return response.data.data;
};

export default getMenu;
