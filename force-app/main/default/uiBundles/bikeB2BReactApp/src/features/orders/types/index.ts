export type Order = {
  id: string;
  name: string;
  status: string;
  accountName: string | null;
  totalAmount: number | null;
  displayTotalAmount?: string;
  createdDate: string;
  displayCreatedDate?: string;
};

export type DraftOrderItemInput = {
  bikeId: string;
  name: string;
  model: string;
  brand: string;
  unitPrice: number;
  quantity: number;
};

export type CreateOrderInput = {
  accountId: string;
  status: string;
  items: DraftOrderItemInput[];
  totalAmount: number;
};
