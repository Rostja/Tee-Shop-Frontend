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
    function OrderHistoryComponent(orderHistoryService) {
        this.orderHistoryService = orderHistoryService;
        this.orderHistoryList = [];
        this.storage = sessionStorage;
    }
    OrderHistoryComponent.prototype.ngOnInit = function () {
        this.handleOrderHistory();
    };
    OrderHistoryComponent.prototype.handleOrderHistory = function () {
        var _this = this;
        //read the users email from browser storage
        var theEmail = JSON.parse(this.storage.getItem('userEmail'));
        //retrieve data from the service
        this.orderHistoryService.getOrderHistory(theEmail).subscribe(function (data) {
            _this.orderHistoryList = data._embedded.orders;
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
