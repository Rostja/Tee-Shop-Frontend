"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var environment_1 = require("../../environments/environment");
var ProductService = /** @class */ (function () {
    function ProductService(httpClient) {
        this.httpClient = httpClient;
        this.baseUrl = environment_1.environment.teaShopApiUrl + "/products";
        this.categoryUrl = environment_1.environment.teaShopApiUrl + "/product-category";
    }
    ProductService.prototype.getProduct = function (theProductId) {
        //need to build URL based on product id
        var productUrl = this.baseUrl + "/" + theProductId;
        return this.httpClient.get(productUrl);
    };
    ProductService.prototype.getProductListPaginate = function (thePage, thePageSize, theCategoryId) {
        // need to build URL based on category id, page and size
        var searchUrl = this.baseUrl + "/search/findByCategoryId?id=" + theCategoryId
            + ("&page=" + thePage + "&size=" + thePageSize);
        return this.httpClient.get(searchUrl);
    };
    ProductService.prototype.getProductList = function (theCategoryId) {
        // need to build URL based on category id 
        var searchUrl = this.baseUrl + "/search/findByCategoryId?id=" + theCategoryId;
        return this.getProducts(searchUrl);
    };
    ProductService.prototype.searchProducts = function (theKeyword) {
        // need to build URL based on the keyword
        var searchUrl = this.baseUrl + "/search/findByNameContaining?name=" + theKeyword;
        return this.getProducts(searchUrl);
    };
    ProductService.prototype.searchProductsPaginate = function (thePage, thePageSize, theKeyword) {
        // need to build URL based on keyword, page and size
        var searchUrl = this.baseUrl + "/search/findByNameContaining?name=" + theKeyword
            + ("&page=" + thePage + "&size=" + thePageSize);
        return this.httpClient.get(searchUrl);
    };
    ProductService.prototype.getProducts = function (searchUrl) {
        return this.httpClient.get(searchUrl).pipe(operators_1.map(function (response) { return response._embedded.products; }));
    };
    ProductService.prototype.getProductCategories = function () {
        return this.httpClient.get(this.categoryUrl).pipe(operators_1.map(function (response) { return response._embedded.productCategory; }));
    };
    ProductService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ProductService);
    return ProductService;
}());
exports.ProductService = ProductService;
