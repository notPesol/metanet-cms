export interface Wallet {
  id: number;
  userId: number;
  balance: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  wallet: Wallet;
}

export type TransactionType = "deposit" | "withdraw" | "payment";

export interface CreateWalletTransaction {
  transactionType: TransactionType;
  amount: number;
}

export interface Transaction {
  id: number;
  userId: number;
  type: TransactionType;
  amount: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
