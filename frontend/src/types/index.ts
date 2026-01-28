export interface Product {
  id: string;
  code: string;
  name: string;
  specification: string | null;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lot {
  id: string;
  lotNumber: string;
  productId: string;
  receivingDate: string;
  unitPrice: string;
  createdAt: string;
}

export interface Inventory {
  id: string;
  productId: string;
  lotId: string;
  quantity: string;
  updatedAt: string;
  product?: Product;
  lot?: Lot;
}

export interface ReceivingDetail {
  id: string;
  receivingId: string;
  productId: string;
  quantity: string;
  unitPrice: string;
  lotNumber: string;
  createdAt: string;
  product?: Product;
}

export interface Receiving {
  id: string;
  receivingNumber: string;
  receivingDate: string;
  deliverySlipNo: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  details?: ReceivingDetail[];
}

export interface InventorySummary {
  productId: string;
  product?: Product;
  totalQuantity: string | null;
}
