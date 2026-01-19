import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-status',
  standalone: true,  // ✅ Standalone
  imports: [CommonModule, RouterModule],  // ✅ Import RouterModule
  templateUrl:'./login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  isLoading: boolean = true;
  userEmail: string | null = null;
  userName: string | null = null;
  userPicture: string | null = null;
  
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;
  private loadingSubscription?: Subscription;

  constructor(
    public auth: AuthService, 
    private router: Router,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.auth.isLoading$.subscribe(
      (loading: boolean) => {
        this.isLoading = loading;
      }
    );

    this.authSubscription = this.auth.isAuthenticated$.subscribe(
      (authenticated: boolean) => {
        this.isAuthenticated = authenticated;
        if (!authenticated) {
          this.clearUserData();
        }
      }
    );

    // 🔥 Tu sa načíta avatar z Auth0
    this.userSubscription = this.auth.user$.subscribe(
      (user) => {
        if (user) {
          this.userEmail = user.email || null;
          this.userName = user.name || user.nickname || null;
          
          // 🎯 Auth0 poskytuje avatar v user.picture
          this.userPicture = user.picture || this.getDefaultAvatar();
          
          console.log('User Avatar URL:', this.userPicture);
        } else {
          this.clearUserData();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
    this.loadingSubscription?.unsubscribe();
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.clearUserData();
    this.auth.logout({ 
      logoutParams: { 
        returnTo: this.doc.location.origin 
      } 
    });
  }
  goToMembers(): void {
    this.router.navigate(['/members']);
  }

  // 🎨 Fallback avatar ak Auth0 neposkytuje obrázok
  private getDefaultAvatar(): string {
    return 'https://ui-avatars.com/api/?name=' + 
           encodeURIComponent(this.userName || this.userEmail || 'User') +
           '&background=205b8d&color=fff&size=128';
  }

  private clearUserData(): void {
    this.userEmail = null;
    this.userName = null;
    this.userPicture = null;
  }
}