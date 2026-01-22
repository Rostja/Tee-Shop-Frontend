"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OrderHistoryComponent = void 0;
var core_1 = require("@angular/core");
var OrderHistoryComponent = /** @class */ (function () {
    function OrderHistoryComponent(orderHistoryService, auth) {
        this.orderHistoryService = orderHistoryService;
        this.auth = auth;
        this.orderHistoryList = [];
        this.storage = sessionStorage;
        this.isLoading = true;
        this.errorMessage = '';
    }
    OrderHistoryComponent.prototype.ngOnInit = function () {
        this.handleOrderHistory();
    };
    OrderHistoryComponent.prototype.handleOrderHistory = function () {
        var _this = this;
        console.log('🔍 Checking for user email...');
        // ✅ 1. Skús najprv sessionStorage
        var theEmail = this.storage.getItem('userEmail');
        if (theEmail) {
            // ✅ Odstráň úvodzovky, ak sú tam (JSON.parse môže pridať úvodzovky)
            theEmail = theEmail.replace(/"/g, '');
            console.log('✅ Email found in sessionStorage:', theEmail);
            this.fetchOrderHistory(theEmail);
        }
        else {
            console.log('⚠️ Email not in sessionStorage, checking Auth0...');
            // ✅ 2. Ak nie je v sessionStorage, získaj z Auth0
            this.auth.user$.subscribe({
                next: function (user) {
                    if (user && user.email) {
                        theEmail = user.email;
                        // ✅ 3. Ulož do sessionStorage pre budúce použitie
                        _this.storage.setItem('userEmail', theEmail);
                        console.log('✅ Email saved to sessionStorage:', theEmail);
                        // ✅ 4. Zavolaj backend
                        _this.fetchOrderHistory(theEmail);
                    }
                    else {
                        console.error('❌ User email not found');
                        _this.errorMessage = 'Please log in to view your order history.';
                        _this.isLoading = false;
                    }
                },
                error: function (error) {
                    console.error('❌ Error getting user from Auth0:', error);
                    _this.errorMessage = 'Authentication error. Please log in again.';
                    _this.isLoading = false;
                }
            });
        }
    };
    /**
     * ✅ Zavolá backend API pre získanie objednávok
     */
    OrderHistoryComponent.prototype.fetchOrderHistory = function (email) {
        var _this = this;
        console.log('📧 Fetching order history for:', email);
        this.orderHistoryService.getOrderHistory(email).subscribe({
            next: function (data) {
                console.log('✅ Response from backend:', data);
                if (data && data._embedded && data._embedded.orders) {
                    _this.orderHistoryList = data._embedded.orders;
                    console.log('📦 Orders loaded:', _this.orderHistoryList.length, 'orders');
                }
                else {
                    console.warn('⚠️ No orders found.');
                    _this.orderHistoryList = [];
                }
                _this.isLoading = false;
            },
            error: function (error) {
                console.error('❌ Error fetching order history:', error);
                _this.errorMessage = 'Failed to load order history. Please try again later.';
                _this.isLoading = false;
            }
        });
    };
    OrderHistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-order-history',
            standalone: false,
            templateUrl: './order-history.component.html',
            styleUrl: './order-history.component.css'
        })
    ], OrderHistoryComponent);
    return OrderHistoryComponent;
}());
exports.OrderHistoryComponent = OrderHistoryComponent;
