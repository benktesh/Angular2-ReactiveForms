import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder} from '@angular/forms';

import { Customer } from './customer';

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit  {
    customer: Customer= new Customer();
    customerForm: FormGroup;

    constructor(private fb: FormBuilder) {

    }

    populateTestData():void{
        this.customerForm.patchValue({
            firstName: 'Jack',
            lastName: 'Harkness',
            email:'jack@jack.com',
            sendCatalog:false
        })
    }

    ngOnInit():void {
        this.customerForm = this.fb.group({
            firstName: '', 
            lastName: '', 
            email: '', 
            sendCatalog: true 
        });

    }
    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }
 }
