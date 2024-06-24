export interface MenuItemT {
  _id: string;
  image: string;
  name: string;
  price: number;
  description: string;
  rating?: number;
  isVeg: boolean;
}

export interface Vendors {
  _id: string;
  name: string;
  isActive?: boolean;
}

export interface CartItemsI {
  menuId: string;
  quantity: number;
  price: number;
}

export interface paymentIntegrationT {
  vendorId: string;
  orderList: CartItemsI[];
  totalAmount: number;
  name: string;
  email: string;
  tableNumber?: number;
  note?: string;
}
