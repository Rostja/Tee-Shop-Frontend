import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TeaShopFormService } from '../../services/tea-shop-form.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private teaShopFormService: TeaShopFormService
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],

      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        region: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        region: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
        
      });
    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);
    this.teaShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
    //populate credit card years
    this.teaShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    
  }
  copyShippingAddressToBillingAddress(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
    this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
  } else {
    this.checkoutFormGroup.controls['billingAddress'].reset();
  }
}

  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }
}
