"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CartService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var CartService = /** @class */ (function () {
    function CartService() {
        this.cartItems = [];
        this.totalPrice = new rxjs_1.BehaviorSubject(0);
        this.totalQuantity = new rxjs_1.BehaviorSubject(0);
        // storage : Storage = sessionStorage;
        this.storage = localStorage;
        //read data from storage
        var data = JSON.parse(this.storage.getItem('cartItems'));
        if (data != null) {
            this.cartItems = data;
            //compute totals based on the data that is read from storage
            this.computeCartTotals();
        }
    }
    CartService.prototype.addToCart = function (theCartItem) {
        //check if we already have the item in our cart
        var alreadyExistsInCart = false;
        var existingCartItem = undefined;
        if (this.cartItems.length > 0) {
            //find the item in the cart based on item id
            existingCartItem = this.cartItems.find(function (tempCartItem) { return tempCartItem.id === theCartItem.id; });
            // check if we found it
            alreadyExistsInCart = (existingCartItem != undefined);
        }
        if (alreadyExistsInCart && existingCartItem) {
            existingCartItem.quantity++;
        }
        else {
            //just add the item in the array
            this.cartItems.push(theCartItem);
        }
        // compute cart total price and total quantity
        this.computeCartTotals();
    };
    CartService.prototype.computeCartTotals = function () {
        var totalPriceValue = 0;
        var totalQuantityValue = 0;
        for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
            var currentCartItem = _a[_i];
            totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
            totalQuantityValue += currentCartItem.quantity;
        }
        //publish the new values ... all subscribers will receive the new data
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);
        //log cart data just for debugging purposes
        this.logCartData(totalPriceValue, totalQuantityValue);
        //persist cart data
        this.persistCartItems();
    };
    CartService.prototype.persistCartItems = function () {
        this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
    };
    CartService.prototype.logCartData = function (totalPriceValue, totalQuantityValue) {
        console.log('Contents of teh cart');
        for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
            var tempCartItem = _a[_i];
            var subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
            console.log(" name : " + tempCartItem.name + ", \n                    quantity=" + tempCartItem.quantity + ", \n                    unitPrice=" + tempCartItem.unitPrice + ", \n                    subTotalPrice=" + subTotalPrice);
        }
        console.log("totalPrice: " + totalPriceValue.toFixed(2) + ", totalQuantity: " + totalQuantityValue);
        console.log('------');
    };
    CartService.prototype.decrementQuantity = function (theCartItem) {
        theCartItem.quantity--;
        if (theCartItem.quantity === 0) {
            this.remove(theCartItem);
        }
        else {
            this.computeCartTotals();
        }
    };
    CartService.prototype.remove = function (theCartItem) {
        //get index of item in the array
        var itemIndex = this.cartItems.findIndex(function (tempCartItem) { return tempCartItem.id === theCartItem.id; });
        //if found, remove the item from the array at the given index
        if (itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
            this.computeCartTotals();
        }
    };
    CartService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CartService);
    return CartService;
}());
exports.CartService = CartService;
