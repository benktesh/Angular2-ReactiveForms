import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';

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
            firstName: ['', [Validators.required, Validators.minLength(3)]], 
            lastName: ['', [Validators.required, Validators.maxLength(50)]], 
            email: ['',[Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+")]], 
            phone: '',
            notification: 'email',
            sendCatalog: true 
        });

    }
    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }

    setNotification(notifyVia:string):void {
        const phoneControl = this.customerForm.get('phone');
        if(notifyVia === 'text') {
            phoneControl.setValidators(Validators.required);

        } else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    }
 }
