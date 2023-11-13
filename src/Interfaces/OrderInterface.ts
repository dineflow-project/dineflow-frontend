export interface OrderMenu {
    menu_id: string;
    amount: number;
    price: number;
    request?: string | null;
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
  }
  