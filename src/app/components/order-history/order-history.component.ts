import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { OrderHistoryService } from '../../services/order-history.service';
import { OrderHistory } from '../../common/order-history';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private orderHistoryService: OrderHistoryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    console.log('🔍 Checking for user email...');

    // ✅ 1. Skús najprv sessionStorage
    let theEmail = this.storage.getItem('userEmail');

    if (theEmail) {
      // ✅ Odstráň úvodzovky, ak sú tam (JSON.parse môže pridať úvodzovky)
      theEmail = theEmail.replace(/"/g, '');
      console.log('✅ Email found in sessionStorage:', theEmail);
      this.fetchOrderHistory(theEmail);
    } else {
      console.log('⚠️ Email not in sessionStorage, checking Auth0...');
      
      // ✅ 2. Ak nie je v sessionStorage, získaj z Auth0
      this.auth.user$.subscribe({
        next: (user) => {
          if (user && user.email) {
            theEmail = user.email;
            
            // ✅ 3. Ulož do sessionStorage pre budúce použitie
            this.storage.setItem('userEmail', theEmail);
            console.log('✅ Email saved to sessionStorage:', theEmail);

            // ✅ 4. Zavolaj backend
            this.fetchOrderHistory(theEmail);
          } else {
            console.error('❌ User email not found');
            this.errorMessage = 'Please log in to view your order history.';
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('❌ Error getting user from Auth0:', error);
          this.errorMessage = 'Authentication error. Please log in again.';
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * ✅ Zavolá backend API pre získanie objednávok
   */
  fetchOrderHistory(email: string) {
    console.log('📧 Fetching order history for:', email);
    
    this.orderHistoryService.getOrderHistory(email).subscribe({
      next: (data) => {
        console.log('✅ Response from backend:', data);
        
        if (data && data._embedded && data._embedded.orders) {
          this.orderHistoryList = data._embedded.orders;
          console.log('📦 Orders loaded:', this.orderHistoryList.length, 'orders');
        } else {
          console.warn('⚠️ No orders found.');
          this.orderHistoryList = [];
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error fetching order history:', error);
        this.errorMessage = 'Failed to load order history. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}