export interface Transaction {
    transaction_id: string; // UUID for transaction ID
    account_id: string; // UUID for account ID
    amount: number; // Transaction amount (integer)
    created_at: string; // Date-time when the transaction was created
  }
  
  export interface TransactionRequest {
    account_id: string; // UUID for account ID
    amount: number; // Transaction amount (integer)
  }
  