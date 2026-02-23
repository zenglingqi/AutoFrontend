



interface OrderDetail {
    orderSn: string;
    totalAmount: string;
    actualPayment: string;
    couponDiscount: string;
    globalDiscount: string;


    currencyCode: string;
    paymentMethod: string;
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'REFUNDED' | 'CANCELED' | 'REFUND_REQUEST';
    createdAt: string;
    addressSnapshot: {
        firstName: string;
        lastName: string;
        addressLine1: string;
        city: string;
        phone?: string;
    };
    items: Array<{
        id: number;
        imageUrl: string;
        productCode: string;
        quantity: number;
        unitPrice: number;
        attributesJson: string;
    }>;
}
