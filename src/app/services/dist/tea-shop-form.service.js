"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TeaShopFormService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var environment_1 = require("../../environments/environment");
var TeaShopFormService = /** @class */ (function () {
    function TeaShopFormService(httpClient) {
        this.httpClient = httpClient;
        this.countriesUrl = environment_1.environment.teaShopApiUrl + '/countries';
        this.regionsUrl = environment_1.environment.teaShopApiUrl + '/regions';
    }
    TeaShopFormService.prototype.getCountries = function () {
        return this.httpClient.get(this.countriesUrl).pipe(rxjs_1.map(function (response) { return response._embedded.countries; }));
    };
    TeaShopFormService.prototype.getRegions = function (theCountryCode) {
        //search url
        var searchRegionsUrl = this.regionsUrl + "/search/findByCountryCode?code=" + theCountryCode;
        return this.httpClient.get(searchRegionsUrl).pipe(rxjs_1.map(function (response) { return response._embedded.regions; }));
    };
    TeaShopFormService.prototype.getCreditCardMonths = function (startMonth) {
        var data = [];
        //build an array for "Month" dropdown list
        //start at current month and loop until
        for (var theMonth = startMonth; theMonth <= 12; theMonth++) {
            data.push(theMonth);
        }
        return rxjs_1.of(data);
    };
    TeaShopFormService.prototype.getCreditCardYears = function () {
        var data = [];
        //build an array for "Year" dropdown list
        //start at current year and loop for next 10 years
        var startYear = new Date().getFullYear();
        var endYear = startYear + 10;
        for (var theYear = startYear; theYear <= endYear; theYear++) {
            data.push(theYear);
        }
        return rxjs_1.of(data);
    };
    TeaShopFormService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], TeaShopFormService);
    return TeaShopFormService;
}());
exports.TeaShopFormService = TeaShopFormService;
