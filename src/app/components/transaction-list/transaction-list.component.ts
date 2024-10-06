import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})

export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  currentBalance: number = 0;
  currentBalances: { [accountId: string]: number } = {};
  lastTransaction: Transaction | null = null;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions; // Update the local transactions array      
    });
     // Subscribe to transaction updates
     this.transactionService.transactions$.subscribe(() => {
      this.loadTransactionsFromLocalStorage();
      this.updateTransactionData();
    });
  }

  // Load transactions from local storage
  loadTransactionsFromLocalStorage(): void {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
    }
  }

  // Update the last transaction and calculate current balance for the account
  updateTransactionData(): void {
    if (this.transactions.length > 0) {
      this.lastTransaction = this.transactions[this.transactions.length - 1];
      this.currentBalance = this.calculateCurrentBalance(this.lastTransaction.account_id);
    }
  }

  // Calculate current balance for the account based on transaction history
  calculateCurrentBalance(account_id: string): number {
    let balance = 0;
    this.transactions
      .filter(transaction => transaction.account_id === account_id)
      .forEach(transaction => {
        balance += transaction.amount;
      });
    return balance;
  }
}
