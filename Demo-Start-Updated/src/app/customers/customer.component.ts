import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Customer } from './customer';

//to define validators with parameters we need validator with validator function as parameters
// we want a function that takes a min and max values to validate againsts.
//requires wrapping the function in factory function.

function ratingRange(min: number, max: number): ValidatorFn {

    /*
    var temp = function (c: AbstractControl): { [key: string]: boolean } | null {
        console.log("The current value is " + c.value);
        if (c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return { 'range': true };
        };
        return null;
    }
    return temp;
    */

    //the above can be 'simplified/complexified' using the following lambda

    return (c: AbstractControl): { [key: string]: boolean } | null => {
        console.log("The current value : " + c.value);
        if (c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return { 'range': true };
        };
        return null;
    }
}

function emailMatcher(c:AbstractControl) {
    let emailControl = c.get('email');
    let confirmControl = c.get('confirmEmail');

    if(emailControl.pristine || confirmControl.pristine) {
        return null; 
    }

    if(emailControl.value === confirmControl.value) {
        return null;
    }
    return {'match': true};
}




@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customer: Customer = new Customer();

    emailMessage:string; 

    private validationMessages = {
        required: 'Please enter your email address.',
        pattern: 'Please enter a valid email address.'
    }


    customerForm: FormGroup;

    constructor(private fb: FormBuilder) {

    }

    populateTestData(): void {
        this.customerForm.patchValue({
            firstName: 'Jack',
            lastName: 'Harkness',
            email: 'jack@jack.com',
            confirmEmail: '',
            sendCatalog: false
        })
    }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            emailGroup: this.fb.group({
                email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+")]],
                confirmEmail: ['', Validators.required],
            }, {validator: emailMatcher}),
            phone: '',
            notification: 'email',
            rating: ['', ratingRange(1, 10)],
            sendCatalog: true
        });

        this.customerForm.get('notification').valueChanges
            .subscribe(value=>this.setNotification(value));  
        
        const emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges.subscribe(value => this.setMessage(emailControl));

    }
    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }

    setNotification(notifyVia: string): void {
        const phoneControl = this.customerForm.get('phone');
        if (notifyVia === 'text') {
            phoneControl.setValidators(Validators.required);

        } else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    }

    setMessage(c:AbstractControl):void {
        this.emailMessage = '';
        if((c.touched || c.dirty) && c.errors) {
            this.emailMessage = Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
        }
    }
}
