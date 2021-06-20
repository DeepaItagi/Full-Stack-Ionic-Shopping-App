import uuid from 'uuid/v4';

export interface ICart {
    id: string;
    items: ICartItem[];
    
}

export interface ICartItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
    categoryId: number;
}

export class Cart implements ICart {
    id = uuid();
    items: ICartItem[] = [];
}

export interface ICartTotals {
    shipping: number;
    subtotal: number;
    total: number;
}
