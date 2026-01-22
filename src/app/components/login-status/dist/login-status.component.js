"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.LoginStatusComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var LoginStatusComponent = /** @class */ (function () {
    function LoginStatusComponent(auth, router, doc) {
        this.auth = auth;
        this.router = router;
        this.doc = doc;
        this.isAuthenticated = false;
        this.isLoading = true;
        this.userEmail = null;
        this.userName = null;
        this.userPicture = null;
        this.storage = sessionStorage;
    }
    LoginStatusComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadingSubscription = this.auth.isLoading$.subscribe(function (loading) {
            _this.isLoading = loading;
        });
        this.authSubscription = this.auth.isAuthenticated$.subscribe(function (authenticated) {
            _this.isAuthenticated = authenticated;
            if (!authenticated) {
                _this.clearUserData();
            }
        });
        // 🔥 Tu sa načíta avatar z Auth0
        this.userSubscription = this.auth.user$.subscribe(function (user) {
            if (user) {
                _this.userEmail = user.email || null;
                _this.userName = user.name || user.nickname || null;
                // 🎯 Auth0 poskytuje avatar v user.picture
                _this.userPicture = user.picture || _this.getDefaultAvatar();
                console.log('User Avatar URL:', _this.userPicture);
            }
            else {
                _this.clearUserData();
            }
        });
    };
    LoginStatusComponent.prototype.getUserDetails = function () {
        var _this = this;
        if (this.isAuthenticated) {
            // Fetch the logged in user details (user's claims)
            this.userSubscription = this.auth.user$.subscribe(function (user) {
                if (user) {
                    // Set user properties
                    _this.userEmail = user.email || null;
                    _this.userName = user.name || user.nickname || null;
                    _this.userPicture = user.picture || _this.getDefaultAvatar();
                    // Store email in browser storage
                    if (user.email) {
                        _this.storage.setItem('userEmail', JSON.stringify(user.email));
                    }
                    console.log('User details loaded:', {
                        email: _this.userEmail,
                        name: _this.userName,
                        picture: _this.userPicture
                    });
                }
            }, function (error) {
                console.error('Error loading user details:', error);
            });
        }
    };
    LoginStatusComponent.prototype.ngOnDestroy = function () {
        var _a, _b, _c;
        (_a = this.authSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.userSubscription) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        (_c = this.loadingSubscription) === null || _c === void 0 ? void 0 : _c.unsubscribe();
    };
    LoginStatusComponent.prototype.login = function () {
        this.auth.loginWithRedirect();
    };
    LoginStatusComponent.prototype.logout = function () {
        this.clearUserData();
        this.auth.logout({
            logoutParams: {
                returnTo: this.doc.location.origin
            }
        });
    };
    LoginStatusComponent.prototype.goToMembers = function () {
        this.router.navigate(['/members']);
    };
    // 🎨 Fallback avatar ak Auth0 neposkytuje obrázok
    LoginStatusComponent.prototype.getDefaultAvatar = function () {
        return 'https://ui-avatars.com/api/?name=' +
            encodeURIComponent(this.userName || this.userEmail || 'User') +
            '&background=205b8d&color=fff&size=128';
    };
    LoginStatusComponent.prototype.clearUserData = function () {
        this.userEmail = null;
        this.userName = null;
        this.userPicture = null;
    };
    LoginStatusComponent = __decorate([
        core_1.Component({
            selector: 'app-login-status',
            standalone: true,
            imports: [common_1.CommonModule, router_1.RouterModule],
            templateUrl: './login-status.component.html',
            styleUrl: './login-status.component.css'
        }),
        __param(2, core_1.Inject(common_1.DOCUMENT))
    ], LoginStatusComponent);
    return LoginStatusComponent;
}());
exports.LoginStatusComponent = LoginStatusComponent;
