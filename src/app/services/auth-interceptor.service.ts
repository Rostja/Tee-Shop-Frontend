import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const theEndpoint = environment.teaShopApiUrl + '/orders';
    const securedEndpoints = [
      theEndpoint,
      theEndpoint + '/checkout/purchase'  // ✅ Pridaj checkout endpoint
    ];

    if (securedEndpoints.some((url) => request.urlWithParams.includes(url))) {
      try {
        // ✅ OPRAVA: Použi lastValueFrom namiesto forEach
        const token = await lastValueFrom(this.auth.getAccessTokenSilently());
        
        console.log('🔑 Access Token:', token);
        
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('❌ Error getting access token:', error);
      }
    }

    return await lastValueFrom(next.handle(request));
  }
}