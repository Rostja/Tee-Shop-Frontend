"use strict";
exports.__esModule = true;
exports["default"] = {
    auth: {
        domain: 'dev-e5n86jksvaryvb6x.us.auth0.com',
        clientId: 'EnRCxVS9TcXyV3bVjnwUOx954Qn0w9pO',
        authorizationParams: {
            redirect_uri: 'https://localhost:4200',
            audience: 'https://localhost:8080'
        },
        httpInterceptor: {
            allowedList: [
                {
                    uri: 'https://localhost:8080/api/*',
                    tokenOptions: {
                        authorizationParams: {
                            audience: 'https://localhost:8080'
                        }
                    }
                },
            ]
        },
        cacheLocation: 'localstorage',
        useRefreshTokens: true
    }
};
