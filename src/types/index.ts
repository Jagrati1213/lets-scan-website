export interface MenuItemT {
  _id: string | null;
  image: string | undefined;
  name: string | null;
  price: number | null;
  description: string | null;
  rating?: string | null;
  isVeg: boolean;
}

export interface Vendors {
  _id: string;
  name: string;
  isActive?: boolean;
}

export interface CartItemsI {
  id: string;
  quantity: number;
  price: number;
}

export interface paymentIntegrationT {
  userId: string;
  orderList: CartItemsI[];
  totalAmount: number;
}
