"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MembersPageComponent = void 0;
var core_1 = require("@angular/core");
var MembersPageComponent = /** @class */ (function () {
    function MembersPageComponent(auth) {
        this.auth = auth;
        this.userEmail = null;
        this.isAuthenticated = false;
    }
    MembersPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Get authentication status
        this.auth.isAuthenticated$.subscribe(function (isAuth) {
            _this.isAuthenticated = isAuth;
        });
        // Get user email
        this.auth.user$.subscribe(function (user) {
            if (user) {
                _this.userEmail = user.email || null;
            }
        });
    };
    MembersPageComponent = __decorate([
        core_1.Component({
            selector: 'app-members-page',
            standalone: false,
            templateUrl: './members-page.component.html',
            styleUrl: './members-page.component.css'
        })
    ], MembersPageComponent);
    return MembersPageComponent;
}());
exports.MembersPageComponent = MembersPageComponent;
