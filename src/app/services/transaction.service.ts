import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Transaction, TransactionRequest } from '../transaction.model';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsKey = 'transactions'; // Key for local storage
  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.getTransactions());
  transactions$ = this.transactionsSubject.asObservable(); // Observable to subscribe to changes

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Create a new transaction
  createTransaction(transactionRequest: TransactionRequest): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentTransactions = this.getTransactions();
      const newTransaction: Transaction = {
        transaction_id: this.generateUUID(), // Generate UUID for transaction_id
        ...transactionRequest,
        created_at: new Date().toISOString() // Set the created_at field
      };

      currentTransactions.push(newTransaction);
      localStorage.setItem(this.transactionsKey, JSON.stringify(currentTransactions));
      this.transactionsSubject.next(currentTransactions); // Emit new transactions
    }
  }

  // Fetch all transactions
  getTransactions(): Transaction[] {
    if (isPlatformBrowser(this.platformId)) {
      const transactions = localStorage.getItem(this.transactionsKey);
      console.log('TransactionService transactions', transactions ? JSON.parse(transactions) : [])
      return transactions ? JSON.parse(transactions) : [];
    }
    return []; // Return an empty array if not in the browser
  }

  // Get current balance of an account based on account ID
  getCurrentBalance(accountId: string): number {
    const transactions = this.getTransactions();
    return transactions
      .filter(transaction => transaction.account_id === accountId)
      .reduce((balance, transaction) => balance + transaction.amount, 0);
  }

  // Generate a UUID for transaction_id (simple version)
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}