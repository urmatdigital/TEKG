export interface IMoySkladCustomer {
  id?: string;
  name: string;
  code: string;
  phone: string;
  email?: string;
  description?: string;
  actualAddress?: string;
  tags?: string[];
  // Дополнительные поля для ФИО
  attributes?: {
    id: string;
    name: string;
    value: string;
  }[];
}

export interface IMoySkladOrder {
  id: string;
  name: string;
  moment: string;
  sum: number;
  agent: {
    id: string;
    name: string;
  };
  state: {
    name: string;
    color: number;
  };
  positions: {
    quantity: number;
    price: number;
    assortment: {
      name: string;
    };
  }[];
}

export interface IMoySkladPayment {
  id: string;
  moment: string;
  sum: number;
  agent: {
    id: string;
    name: string;
  };
  operations: {
    meta: {
      href: string;
    };
  }[];
}

export interface IMoySkladBalance {
  balance: number;
  credit: number;
  debit: number;
}
