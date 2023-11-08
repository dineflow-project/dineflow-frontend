export interface Vendor {
    id: bigint;
    canteen_id: bigint;
    name: string;
    owner_id: bigint | null;
    opening_timestamp: string;
    closing_timestamp: string;
    status: 'Open' | 'Close';
  }