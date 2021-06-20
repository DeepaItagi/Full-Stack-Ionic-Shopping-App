
export interface IOrderToCreate {
    cartId: string;
}

export interface IOrder {
    id: number;
    orderDate: string;
    orderItems: IOrderItem[];
    subtotal: number;
    total: number;
}

export interface IOrderItem {
    productItemId: number;
    productName: string;
    imageUrl: string;
    price: number;
    quantity: number;
}
