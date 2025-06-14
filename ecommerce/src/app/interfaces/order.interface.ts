import { IProduct } from './product.interface';

export interface IOrderItem {
  productId: number;
  quantity: number;
  price: number;
  discount: number;
  product?: IProduct;
}

export interface IOrder {
  id: number;
  userId: number;
  items: IOrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryDate?: string;
  isDeleted: boolean;
}
