"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/common/http");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
// Auth
var auth0_angular_1 = require("@auth0/auth0-angular");
var my_app_config_1 = require("./config/my-app-config");
var auth_interceptor_service_1 = require("./services/auth-interceptor.service");
// Komponenty
var app_component_1 = require("./app.component");
var product_list_component_1 = require("./components/product-list/product-list.component");
var product_category_menu_component_1 = require("./components/product-category-menu/product-category-menu.component");
var search_component_1 = require("./components/search/search.component");
var product_details_component_1 = require("./components/product-details/product-details.component");
var cart_status_component_1 = require("./components/cart-status/cart-status.component");
var cart_details_component_1 = require("./components/cart-details/cart-details.component");
var checkout_component_1 = require("./components/checkout/checkout.component");
var login_status_component_1 = require("./components/login-status/login-status.component");
// Servisy
var product_service_1 = require("./services/product.service");
var members_page_component_1 = require("./components/members-page/members-page.component");
var order_history_component_1 = require("./components/order-history/order-history.component");
function sendToLoginPage(authGuardRedirectFn) {
    return authGuardRedirectFn({ loginOptions: { appState: { target: '/members' } } });
}
var routes = [
    { path: 'order-history', component: order_history_component_1.OrderHistoryComponent, canActivate: [auth0_angular_1.AuthGuard],
        data: { onAuthRequired: sendToLoginPage } },
    { path: 'members', component: members_page_component_1.MembersPageComponent, canActivate: [auth0_angular_1.AuthGuard],
        data: { onAuthRequired: sendToLoginPage } },
    { path: 'checkout', component: checkout_component_1.CheckoutComponent },
    { path: 'cart-details', component: cart_details_component_1.CartDetailsComponent },
    { path: 'products/:id', component: product_details_component_1.ProductDetailsComponent },
    { path: 'search/:keyword', component: product_list_component_1.ProductListComponent },
    { path: 'category/:id', component: product_list_component_1.ProductListComponent },
    { path: 'category', component: product_list_component_1.ProductListComponent },
    { path: 'products', component: product_list_component_1.ProductListComponent },
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', redirectTo: '/products', pathMatch: 'full' },
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                product_list_component_1.ProductListComponent,
                product_category_menu_component_1.ProductCategoryMenuComponent,
                search_component_1.SearchComponent,
                product_details_component_1.ProductDetailsComponent,
                cart_status_component_1.CartStatusComponent,
                cart_details_component_1.CartDetailsComponent,
                checkout_component_1.CheckoutComponent,
                members_page_component_1.MembersPageComponent,
                order_history_component_1.OrderHistoryComponent
            ],
            imports: [
                router_1.RouterModule.forRoot(routes),
                platform_browser_1.BrowserModule,
                http_1.HttpClientModule,
                ng_bootstrap_1.NgbModule,
                forms_1.ReactiveFormsModule,
                // ✅ Auth0 konfigurácia
                auth0_angular_1.AuthModule.forRoot(my_app_config_1["default"].auth),
                login_status_component_1.LoginStatusComponent
            ],
            providers: [
                product_service_1.ProductService,
                // ✅ HTTP Interceptor pre JWT tokeny
                {
                    provide: http_1.HTTP_INTERCEPTORS,
                    useClass: auth_interceptor_service_1.AuthInterceptorService,
                    multi: true
                },
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
