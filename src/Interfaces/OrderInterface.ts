import { Menu } from "./MenuInterface";
import { Vendor } from "./VendorInterface";

export interface OrderMenu {
  menu_id: bigint;
  amount: number;
  price: number;
  request?: string | null;
  menu_details?: Menu;
}

export interface Order {
  id?: string;
  status?: string;
  order_menus?: OrderMenu[];
  vendor_id?: string;
  price?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  vendor_name?: string; // Add this property
}
