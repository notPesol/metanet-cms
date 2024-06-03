export interface IWallet {
  id: number;
  userId: number;
  balance: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: number;
  username: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  wallet: IWallet;
}

export type TransactionType = "deposit" | "withdraw" | "payment";

export interface ICreateWalletTransaction {
  transactionType: TransactionType;
  amount: number;
}

export interface ITransaction {
  id: number;
  userId: number;
  type: TransactionType;
  amount: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITableHeader {
  label: string,
  key: string,
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export interface IResponse<T> {
  message: string;
  totalItem: number;
  data: T;
}