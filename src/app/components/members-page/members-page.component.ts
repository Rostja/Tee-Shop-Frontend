import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-members-page',
  standalone: false,
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.css'
})
export class MembersPageComponent implements OnInit {
  
  userEmail: string | null = null;
  isAuthenticated: boolean = false;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    // Get authentication status
    this.auth.isAuthenticated$.subscribe(
      (isAuth) => {
        this.isAuthenticated = isAuth;
      }
    );

    // Get user email
    this.auth.user$.subscribe(
      (user) => {
        if (user) {
          this.userEmail = user.email || null;
        }
      }
    );
  }
}