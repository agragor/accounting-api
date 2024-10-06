// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionService } from './services/transaction.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from "./components/transaction-list/transaction-list.component";

@NgModule({
  declarations: [
    //AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TransactionListComponent
],
  providers: [TransactionService],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Add this to allow custom elements
})
export class AppModule { }
