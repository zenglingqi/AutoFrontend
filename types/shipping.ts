interface ShippingEvent {
    status: string;
    description: string;
    location: string;
    eventTime: string; // LocalDateTime 在 JSON 中通常为 ISO 字符串
}

interface ShippingDetails {
    id: number;
    carrierCode: string;
    provider: string;
    trackingNumber: string;
    shippingStatus: string;
    estimatedDeliveryDate: string;
    actualDeliveryDate: string;
    events: ShippingEvent[];
}