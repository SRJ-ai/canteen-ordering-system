export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'KITCHEN_STAFF' | 'CASHIER' | 'CUSTOMER';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  user_id: string;
  role: Role;
}

export interface AuthenticatedUser extends Profile {
  roles: Role[];
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'CREATED' | 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
