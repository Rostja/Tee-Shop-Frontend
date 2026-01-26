"use strict";
exports.__esModule = true;
exports.OrderHistory = void 0;
var OrderHistory = /** @class */ (function () {
    function OrderHistory(id, orderTrackingNumber, totalPrice, totalQuantity, dateCreated) {
        this.id = id;
        this.orderTrackingNumber = orderTrackingNumber;
        this.totalPrice = totalPrice;
        this.totalQuantity = totalQuantity;
        this.dateCreated = dateCreated;
    }
    return OrderHistory;
}());
exports.OrderHistory = OrderHistory;
