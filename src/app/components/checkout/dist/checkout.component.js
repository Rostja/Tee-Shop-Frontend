"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CheckoutComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var tea_shop_validators_1 = require("../../validators/tea-shop-validators");
var order_1 = require("../../common/order");
var order_item_1 = require("../../common/order-item");
var purchase_1 = require("../../common/purchase");
var CheckoutComponent = /** @class */ (function () {
    function CheckoutComponent(formBuilder, teaShopFormService, cartService, checkoutService, router) {
        this.formBuilder = formBuilder;
        this.teaShopFormService = teaShopFormService;
        this.cartService = cartService;
        this.checkoutService = checkoutService;
        this.router = router;
        this.totalPrice = 0;
        this.totalQuantity = 0;
        this.creditCardYears = [];
        this.creditCardMonths = [];
        this.countries = [];
        this.shippingAddressRegions = [];
        this.billingAddressRegions = [];
        this.storage = sessionStorage;
    }
    CheckoutComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.reviewCartDetails();
        //read the users email address from browser storage
        var theEmail = this.storage.getItem('userEmail');
        console.log("Retrieved email from storage: " + theEmail);
        this.checkoutFormGroup = this.formBuilder.group({
            customer: this.formBuilder.group({
                firstName: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(20),
                    tea_shop_validators_1.TeaShopValidators.notOnlyWhitespace]),
                lastName: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(20),
                    tea_shop_validators_1.TeaShopValidators.notOnlyWhitespace]),
                email: new forms_1.FormControl(theEmail, [forms_1.Validators.required, forms_1.Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
            }),
            shippingAddress: this.formBuilder.group({
                street: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(20),
                    tea_shop_validators_1.TeaShopValidators.notOnlyWhitespace]),
                city: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(20),
                    tea_shop_validators_1.TeaShopValidators.notOnlyWhitespace]),
                region: new forms_1.FormControl('', [forms_1.Validators.required]),
                country: new forms_1.FormControl('', [forms_1.Validators.required]),
                zipCode: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(8),
                    tea_shop_validators_1.TeaShopValidators.notOnlyWhitespace])
            }),
            billingAddress: this.formBuilder.group({
                street: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(20),
                    tea_shop_validators_1.TeaShopValidators.notOnlyWhitespace]),
                city: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(20),
                    tea_shop_validators_1.TeaShopValidators.notOnlyWhitespace]),
                region: new forms_1.FormControl('', [forms_1.Validators.required]),
                country: new forms_1.FormControl('', [forms_1.Validators.required]),
                zipCode: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(8),
                    tea_shop_validators_1.TeaShopValidators.notOnlyWhitespace])
            }),
            creditCard: this.formBuilder.group({
                cardType: new forms_1.FormControl('', [forms_1.Validators.required]),
                nameOnCard: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(20),
                    tea_shop_validators_1.TeaShopValidators.notOnlyWhitespace]),
                cardNumber: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.pattern('[0-9]{16}')]),
                securityCode: new forms_1.FormControl('', [forms_1.Validators.required,
                    forms_1.Validators.pattern('[0-9]{3}')]),
                expirationMonth: [''],
                expirationYear: ['']
            })
        });
        //populate credit card months
        var startMonth = new Date().getMonth() + 1;
        console.log("startMonth: " + startMonth);
        this.teaShopFormService.getCreditCardMonths(startMonth).subscribe(function (data) {
            console.log("Retrieved credit card months: " + JSON.stringify(data));
            _this.creditCardMonths = data;
        });
        //populate credit card years
        this.teaShopFormService.getCreditCardYears().subscribe(function (data) {
            console.log("Retrieved credit card years: " + JSON.stringify(data));
            _this.creditCardYears = data;
        });
        //populate countries
        this.teaShopFormService.getCountries().subscribe(function (data) {
            console.log("Retrieved countries: " + JSON.stringify(data));
            _this.countries = data;
        });
    };
    CheckoutComponent.prototype.reviewCartDetails = function () {
        var _this = this;
        //subscribe to cart totalPrice
        this.cartService.totalPrice.subscribe(function (totalPrice) { return _this.totalPrice = totalPrice; });
        //subscribe to cart totalQuantity
        this.cartService.totalQuantity.subscribe(function (totalQuantity) { return _this.totalQuantity = totalQuantity; });
    };
    Object.defineProperty(CheckoutComponent.prototype, "firstName", {
        get: function () {
            return this.checkoutFormGroup.get('customer.firstName');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "lastName", {
        get: function () {
            return this.checkoutFormGroup.get('customer.lastName');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "email", {
        get: function () {
            return this.checkoutFormGroup.get('customer.email');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "shippingAddressStreet", {
        get: function () {
            return this.checkoutFormGroup.get('shippingAddress.street');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "shippingAddressCity", {
        get: function () {
            return this.checkoutFormGroup.get('shippingAddress.city');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "shippingAddressRegion", {
        get: function () {
            return this.checkoutFormGroup.get('shippingAddress.region');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "shippingAddressZipCode", {
        get: function () {
            return this.checkoutFormGroup.get('shippingAddress.zipCode');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "shippingAddressCountry", {
        get: function () {
            return this.checkoutFormGroup.get('shippingAddress.country');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "billingAddressStreet", {
        get: function () {
            return this.checkoutFormGroup.get('billingAddress.street');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "billingAddressCity", {
        get: function () {
            return this.checkoutFormGroup.get('billingAddress.city');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "billingAddressRegion", {
        get: function () {
            return this.checkoutFormGroup.get('billingAddress.region');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "billingAddressZipCode", {
        get: function () {
            return this.checkoutFormGroup.get('billingAddress.zipCode');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "billingAddressCountry", {
        get: function () {
            return this.checkoutFormGroup.get('billingAddress.country');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "creditCardType", {
        get: function () {
            return this.checkoutFormGroup.get('creditCard.cardType');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "creditCardNameOnCard", {
        get: function () {
            return this.checkoutFormGroup.get('creditCard.nameOnCard');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "creditCardNumber", {
        get: function () {
            return this.checkoutFormGroup.get('creditCard.cardNumber');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckoutComponent.prototype, "creditCardSecurityCode", {
        get: function () {
            return this.checkoutFormGroup.get('creditCard.securityCode');
        },
        enumerable: false,
        configurable: true
    });
    CheckoutComponent.prototype.copyShippingAddressToBillingAddress = function (event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            this.checkoutFormGroup.controls['billingAddress']
                .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
            //bug fix for region
            this.billingAddressRegions = this.shippingAddressRegions;
        }
        else {
            this.checkoutFormGroup.controls['billingAddress'].reset();
            //bug fix for region
            this.billingAddressRegions = [];
        }
    };
    CheckoutComponent.prototype.onSubmit = function () {
        var _this = this;
        console.log("Handling the submit button");
        if (this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched();
            return;
        }
        //set up order
        var order = new order_1.Order();
        order.totalPrice = this.totalPrice;
        order.totalQuantity = this.totalQuantity;
        //get cart items
        var cartItems = this.cartService.cartItems;
        //create order items from cart items - long way
        var orderItems = [];
        for (var i = 0; i < cartItems.length; i++) {
            orderItems[i] = new order_item_1.OrderItem(cartItems[i]);
        }
        // - short way of doing the same thing
        /* let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem)); */
        //set up purchase
        var purchase = new purchase_1.Purchase();
        //populate purchase - custmomer
        purchase.customer = this.checkoutFormGroup.controls['customer'].value;
        //populate purchase - shipping address
        purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
        var shippingRegion = JSON.parse(JSON.stringify(purchase.shippingAddress.region));
        var shippingCountry = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
        purchase.shippingAddress.region = shippingRegion.name;
        purchase.shippingAddress.country = shippingCountry.name;
        //populate purchase - billing address
        purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
        var billingRegion = JSON.parse(JSON.stringify(purchase.billingAddress.region));
        var billingCountry = JSON.parse(JSON.stringify(purchase.billingAddress.country));
        purchase.billingAddress.region = billingRegion.name;
        purchase.billingAddress.country = billingCountry.name;
        //populate purchase - order and order items
        purchase.order = order;
        purchase.orderItems = orderItems;
        //call REST API via the checkout service
        this.checkoutService.placeOrder(purchase).subscribe({
            next: function (response) {
                alert("Your order has been received.\nOrder tracking number: " + response.orderTrackingNumber);
                //reset cart
                _this.resetCart();
            },
            error: function (err) {
                alert("There was an error: " + err.message);
            }
        });
    };
    CheckoutComponent.prototype.resetCart = function () {
        //reset cart data
        this.cartService.cartItems = [];
        this.cartService.totalPrice.next(0);
        this.cartService.totalQuantity.next(0);
        //reset the form
        this.checkoutFormGroup.reset();
        //navigate back to the products page
        this.router.navigateByUrl("/products");
    };
    CheckoutComponent.prototype.handleMonthsAndYears = function () {
        var _this = this;
        var creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
        var selectedYear = Number(creditCardFormGroup === null || creditCardFormGroup === void 0 ? void 0 : creditCardFormGroup.value.expirationYear);
        var currentYear = new Date().getFullYear();
        //if the selected year is the current year, then start with the current month 
        var startMonth;
        if (selectedYear === currentYear) {
            startMonth = new Date().getMonth() + 1;
        }
        else {
            startMonth = 1;
        }
        this.teaShopFormService.getCreditCardMonths(startMonth).subscribe(function (data) {
            console.log("Retrieved credit card months: " + JSON.stringify(data));
            _this.creditCardMonths = data;
        });
    };
    CheckoutComponent.prototype.getRegions = function (formGroupName) {
        var _this = this;
        var formGroup = this.checkoutFormGroup.get(formGroupName);
        var countryCode = formGroup === null || formGroup === void 0 ? void 0 : formGroup.value.country.code;
        var countryName = formGroup === null || formGroup === void 0 ? void 0 : formGroup.value.country.name;
        console.log(formGroupName + " country code: " + countryCode);
        console.log(formGroupName + " country name: " + countryName);
        this.teaShopFormService.getRegions(countryCode).subscribe(function (data) {
            var _a;
            if (formGroupName === 'shippingAddress') {
                _this.shippingAddressRegions = data;
            }
            else {
                _this.billingAddressRegions = data;
            }
            // select first item by default
            (_a = formGroup === null || formGroup === void 0 ? void 0 : formGroup.get('region')) === null || _a === void 0 ? void 0 : _a.setValue(data[0]);
        });
    };
    CheckoutComponent = __decorate([
        core_1.Component({
            selector: 'app-checkout',
            standalone: false,
            templateUrl: './checkout.component.html',
            styleUrl: './checkout.component.css'
        })
    ], CheckoutComponent);
    return CheckoutComponent;
}());
exports.CheckoutComponent = CheckoutComponent;
