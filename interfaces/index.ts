interface Wallet {
  id: number;
  userId: number;
  balance: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  username: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  wallet: Wallet;
}

type TransactionType = "deposit" | "withdraw"; //| "payment";

interface CreateWalletTransaction {
  transactionType: TransactionType;
  amount: number;
}

interface Transaction {
  id: number;
  userId: number;
  type: string;
  amount: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
