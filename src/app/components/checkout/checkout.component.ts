import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TeaShopFormService } from '../../services/tea-shop-form.service';
import { Country } from '../../common/country';
import { Region } from '../../common/region';
import { TeaShopValidators } from '../../validators/tea-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { PaymentInfo } from '../../common/payment-info';
import { environment } from '../../../environments/environment';

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

  countries: Country[] = [];

  shippingAddressRegions: Region[] = [];
  billingAddressRegions: Region[] = [];

  storage: Storage = sessionStorage;

  //initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
 
  constructor(private formBuilder: FormBuilder,
              private teaShopFormService: TeaShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router
  ) { }

  ngOnInit(): void {

    //setup Sripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    //read the users email address from browser storage

    const theEmail = this.storage.getItem('userEmail');
    console.log("Retrieved email from storage: " + theEmail);


    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        Validators.maxLength(20),
                                        TeaShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        Validators.maxLength(20),
                                        TeaShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])

      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        Validators.maxLength(20),
                                        TeaShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        Validators.maxLength(20),
                                        TeaShopValidators.notOnlyWhitespace]),
        region: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        Validators.maxLength(8),
                                        TeaShopValidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        Validators.maxLength(20),
                                        TeaShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        Validators.maxLength(20),
                                        TeaShopValidators.notOnlyWhitespace]),
        region: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        Validators.maxLength(8),
                                        TeaShopValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({

        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        Validators.maxLength(20),
                                        TeaShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required ,
                                        Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required ,
                                        Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''], 
        *///
      }),
        
      });
      
      /*
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
    */

    //populate countries
    this.teaShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  setupStripePaymentForm(){
    // get a handle to stripe elements
    var elements = this.stripe.elements();
    // create a card element
    this.cardElement = elements.create('card', {hidePostalCode: true});
    // add an instance of the card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');
    // add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }
  
  reviewCartDetails() {
    //subscribe to cart totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
    //subscribe to cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressRegion() {
    return this.checkoutFormGroup.get('shippingAddress.region');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressRegion() {
    return this.checkoutFormGroup.get('billingAddress.region');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
   get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
   get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
   get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  
  copyShippingAddressToBillingAddress(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
    this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      //bug fix for region
      this.billingAddressRegions = this.shippingAddressRegions;
  } else {
    this.checkoutFormGroup.controls['billingAddress'].reset();

    //bug fix for region
    this.billingAddressRegions = [];
  }
}

  onSubmit(){
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create order items from cart items - long way
        let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
      
    }

    // - short way of doing the same thing
    /* let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem)); */

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - custmomer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    
    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingRegion: Region = JSON.parse(JSON.stringify(purchase.shippingAddress.region));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.region = shippingRegion.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingRegion: Region = JSON.parse(JSON.stringify(purchase.billingAddress.region));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.region = billingRegion.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase - order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    //compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";

    console.log(`Payment Info: ${JSON.stringify(this.paymentInfo)}`);

    //if valid form then
    // - create payment intent
    // - confirm card payment
    // - place order
    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      // - create payment intent
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          console.log('Payment Intent Response:', paymentIntentResponse); 
          console.log('Client Secret:', paymentIntentResponse.clientSecret); 
          // - confirm card payment
          this.stripe.confirmCardPayment(paymentIntentResponse.clientSecret,
          {
            payment_method: {
              card: this.cardElement
            }
          }, {handleActions: false})
          .then((result: any) => {
            if (result.error) {
              //display error message
              alert(`There was an error: ${result.error.message}`);
            } else {
              // call REST API via the checkoutService
              this.checkoutService.placeOrder(purchase).subscribe(
                {
                  next: (response: any) => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                    //reset cart
                    this.resetCart();
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                  }
                })
              }
            });
          }
        );
      } else {
        this.checkoutFormGroup.markAllAsTouched();
        return;
      }         
  }
  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    
    // Nastav totály na 0
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    
    // Vymaž z localStorage
    this.cartService.persistCartItems();

    // Resetuj formulář
    this.checkoutFormGroup.reset();

    // Přesměruj na hlavní stránku
    this.router.navigateByUrl('/products');
    
    // Log pre debugging
    console.log('Cart has been reset');
  }

   handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    const currentYear: number = new Date().getFullYear();

    //if the selected year is the current year, then start with the current month 
    let startMonth: number;
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.teaShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }
  getRegions(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.teaShopFormService.getRegions(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressRegions = data;
        } else {
          this.billingAddressRegions = data;
        }
        // select first item by default
        formGroup?.get('region')?.setValue(data[0]);
      }
    );
  }
}
