export const myAppConfig = {
  auth: {
    domain: 'dev-e5n86jksvaryvb6x.us.auth0.com',
    clientId: 'EnRCxVS9TcXyV3bVjnwUOx954Qn0w9pO',
    authorizationParams: {
      redirect_uri: 'https://localhost:4200',  // ✅ HTTPS
      audience: 'https://localhost:8080',      // ✅ HTTPS
     
    },
    httpInterceptor: {
      allowedList: [
        {
          uri: 'https://localhost:8080/api/*',  // ✅ HTTPS
          tokenOptions: {
            authorizationParams: {
              audience: 'https://localhost:8080',
            },
          },
        },
      ],
    },
    cacheLocation: 'localstorage' as const,
    useRefreshTokens: true,
  },
};