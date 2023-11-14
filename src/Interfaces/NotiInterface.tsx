export interface Notification {
  id: string;
  recipient_id: string;
  order_id: string;
  is_read: boolean;
  type: string;
  timestamp: string; // You might need to adjust the data type based on your actual implementation
}
