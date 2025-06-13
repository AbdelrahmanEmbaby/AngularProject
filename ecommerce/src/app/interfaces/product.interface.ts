export interface IProduct {
  name: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  images: string[];
  isDeleted: boolean;
}

export interface IProductResponse extends IProduct {
  id: number;
}

export interface IUpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  discount?: number;
  quantity?: number;
  images?: string[];
  isDeleted?: boolean;
}