import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, TransactionRequest } from '../../transaction.model';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';


// Function to validate UUID format
function validateUUID(control: AbstractControl): { [key: string]: any } | null {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(control.value) || control.value === '' ? null : { invalidUUID: true };
}

// Function to validate amount format (accepts positive integers and decimals)
function validateAmount(control: AbstractControl): { [key: string]: any } | null {
  const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;  // Validates numbers and decimals up to 2 places
  return amountRegex.test(control.value) || control.value === '' ? null : { invalidAmount: true };
}

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})

export class TransactionFormComponent {
  transactionForm: FormGroup;
  accountId: string = '';
  amount: number | null = null;

  @Output() transactionSubmitted = new EventEmitter<void>();
  
  constructor(private fb: FormBuilder, private transactionService: TransactionService) {
    this.transactionForm = this.fb.group({
      account_id: ['', [Validators.required, validateUUID]],
      amount: ['', [Validators.required, validateAmount]]
    });
  }

  // Helper method to retrieve error messages
  getAccountIdError() {
    const accountIdControl = this.transactionForm.get('account_id');
    console.log('accountIdControl', accountIdControl);
    if (accountIdControl?.hasError('required')) {
      return 'Account ID is required.';
    } else if (accountIdControl?.hasError('invalidUUID')) {
      return 'Invalid UUID format.';
    }
    
    return null;
  }

  getAmountError() {
    const amountControl = this.transactionForm.get('amount');
    
    if (amountControl?.hasError('required')) {
      return 'Amount is required.';
    } else if (amountControl?.hasError('invalidAmount')) {
      return 'Invalid amount format.';
    }
    
    return null;
  }

  onSubmit() {
    debugger;
    if (this.transactionForm.get('account_id')?.value?.toString() && this.transactionForm.get('amount')?.value !== null) {
      const transaction: Transaction = {
        transaction_id: this.generateUUID(),
        account_id: this.transactionForm.get('account_id')?.value.toString() || '',
        amount: this.transactionForm.get('amount')?.value,
        created_at: new Date().toISOString(),
      };

      this.transactionService.createTransaction(transaction);
      this.transactionSubmitted.emit(); // Notify parent component about the new transaction
      this.accountId = '';
      this.amount = null;
      this.transactionForm.reset();
    }
  }

  private generateUUID(): string {
    // UUID generation logic (for example purposes)
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, () => {
      return (Math.random() * 16 | 0).toString(16);
    });
  }

}