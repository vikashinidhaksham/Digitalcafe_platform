import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../services/booking.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cafe-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  //imports: [CommonModule, FormsModule],
  templateUrl: './cafe-details.html',
  styleUrls: ['./cafe-details.css']
})
export class CafeDetailsComponent implements OnInit {

  cafeId!: number;
 cafe: any = null;
 isLoading = false;
  cafeImages: string[] = [];
orderId!:string;
paymentId!:string;
bookingId!: string;
showPaymentPopup=false;
paymentMethod = '';
  selectedDate: string = '';
  selectedTime: string = '';
  selectedTableId!: number;
guestCount: any = '';
  tables: any[] = [];
  menu: any[] = [];
  cart: any[] = [];

  showReservation = false;
  showSuccess = false;
  showFullMenu = false;

timeSlots: string[] = [
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM","05:30 PM",
  "06:00 PM","06:30 PM","07:00 PM","07:30 PM",
  "08:00 PM","08:30 PM","09:00 PM"
];
// Add these properties
minDate: string = new Date().toISOString().split('T')[0]; // today's date

availableTimeSlots: string[] = [];

// Full time slots list (keep your existing one, rename to allTimeSlots)
allTimeSlots: string[] = [
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM","05:30 PM",
  "06:00 PM","06:30 PM","07:00 PM","07:30 PM",
  "08:00 PM","08:30 PM","09:00 PM"
];
highlightId:any;
constructor(
  private route: ActivatedRoute,
  private http: HttpClient,
  private bookingService: BookingService,
  private router: Router
) {
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
}
ngOnInit(): void {
  this.cafeId = Number(this.route.snapshot.paramMap.get('id'));

  this.cafe = null;
  this.menu = [];
  this.tables = [];
  this.cafeImages = [];

  this.loadPageData();

  this.route.queryParams.subscribe(params => {
    this.highlightId = params['highlight'];

    // ── ORDER AGAIN: wait for menu to load, then restore cart ──
    if (params['reorder'] === 'true') {
      const storedItems = localStorage.getItem('reorderItems');
      if (storedItems) {
        const reorderItems = JSON.parse(storedItems);
        // Poll until menu is populated (loadPageData is async)
        const interval = setInterval(() => {
          if (this.menu && this.menu.length > 0) {
            clearInterval(interval);
            this.restoreCartFromReorder(reorderItems);
            localStorage.removeItem('reorderItems');
            localStorage.removeItem('reorderCafeId');
          }
        }, 300);
        // Safety: clear after 10 seconds
        setTimeout(() => clearInterval(interval), 10000);
      }
    }
  });
  this.availableTimeSlots = [...this.allTimeSlots];
}

trackById(index: number, item: any) {
  return item.id;
}
//showFullMenu = false;
scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
currentView: 'details' | 'menu' = 'details';
selectedCategory: string = 'ALL';
searchText: string = '';
showFilter = false;
selectedFilter = 'ALL';
categories = [
  { name: 'All',           icon: '<i class="fa-solid fa-utensils"></i>',       label: 'All Menu' },
  { name: 'Beverages',     icon: '<i class="fa-solid fa-mug-hot"></i>',         label: 'Beverages' },
  { name: 'Appetizer',     icon: '<i class="fa-solid fa-pepper-hot"></i>',      label: 'Appetizer' },
  { name: 'Chef Special',  icon: '<i class="fa-solid fa-hat-chef"></i>',        label: 'Chef Special' },
  { name: 'Desserts',      icon: '<i class="fa-solid fa-ice-cream"></i>',       label: 'Desserts' },
  { name: 'Main Course',   icon: '<i class="fa-solid fa-bowl-food"></i>',       label: 'Main Course' },
];
get previewMenu() {
  return this.menu.slice(0, 8);
}


goCafe(){
  this.router.navigate(['/cafes']);
}

goProfile(){
  this.router.navigate(['/profile']);
}
goToDetails() {
  this.currentView = 'details';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
get displayedMenu() {
  return this.showFullMenu ? this.menu : this.menu.slice(0, 6);
}
  goBack(): void {
    this.router.navigate(['/user-dashboard']);
  }

get filteredMenu() {

  let items = [...this.menu];

  // Category filter
  if (this.selectedCategory !== 'ALL') {
    items = items.filter(item =>
      item.category === this.selectedCategory
    );
  }

  // Search filter
  if (this.searchText.trim()) {
    items = items.filter(item =>
      item.name.toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  // ⭐ NEW FILTER LOGIC
  if (this.selectedFilter === 'LOW_PRICE') {
    items = items.sort((a, b) => a.price - b.price);
  }

  if (this.selectedFilter === 'HIGH_PRICE') {
    items = items.sort((a, b) => b.price - a.price);
  }

  return items;
}
toggleFilter() {
  this.showFilter = !this.showFilter;
}

applyFilter(type: string) {
  this.selectedFilter = type;
  this.showFilter = false;
}
confirmBooking(): void {

  if (!this.selectedDate || !this.selectedTime || !this.selectedTableId) {
 Swal.fire({
   icon: 'warning',
   title: 'Incomplete Selection',
   text: 'Please select date, time and table'
 });
 return;

  }

  const bookingData = {
    cafeId: this.cafeId,
    tableId: this.selectedTableId,
    bookingDate: this.selectedDate,
    bookingTime: this.selectedTime,
    customerId: Number(localStorage.getItem("userId")),
    lastName: localStorage.getItem("lastName")
  };

  this.bookingService.bookTable(bookingData)
  .subscribe({
    next: (res:any) => {

      console.log("Booking response:",res);

      // save booking id
      this.bookingId = res.bookingId;

   Swal.fire({
     icon: 'success',
     title: 'Booking Successful!',
     text: 'Your table has been reserved.',
     confirmButtonColor: '#E63946'
   });
      // open menu tab automatically
      this.currentView = 'menu';

      // scroll to top
      window.scrollTo({top:0,behavior:'smooth'});

    },

    error: (err:any) => {
     Swal.fire({
       icon: 'error',
       title: 'Table Already Booked',
       text: 'Please select another time or table',
       confirmButtonColor: '#E63946'
     }); }
  });

}
selectPayment(method:string){
  this.paymentMethod = method;
}

makePayment() {
  const total = this.getTotal() + (this.getTotal() * 0.05);

  this.http.post<any>('http://localhost:8080/api/payments/create-order', {
    amount: total
  }).subscribe(rzpOrder => {

    const options: any = {
      key: 'rzp_test_SQJs88CuZgOLMM',
      amount: rzpOrder.amount,
      currency: 'INR',
      name: 'Savour Cafe',
      description: 'Cafe Order Payment',
      order_id: rzpOrder.id,

      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI",
              instruments: [{ method: "upi" }]
            }
          },
          sequence: ["block.upi", "netbanking", "card", "wallet"],
          preferences: { show_default_blocks: true }
        }
      },

      prefill: {
        name:  localStorage.getItem('firstName') || '',
        email: localStorage.getItem('email') || ''
      },

      handler: (response: any) => {
        this.paymentId = response.razorpay_payment_id;

        this.http.post('http://localhost:8080/api/payments', {
          orderId:       this.orderId,
          paymentId:     this.paymentId,
          paymentMethod: 'RAZORPAY',
          amount:        total
        }).subscribe(() => {
          Swal.fire({
            icon:  'success',
            title: 'Payment Successful!',
            text:  'Your order has been placed'
          }).then(() => {
            this.cart = [];
            this.showPaymentPopup = false;
            this.router.navigate(['/user-dashboard'], {
              queryParams: { tab: 'orders', highlight: this.orderId }
            });
          });
        });
      },

      theme: { color: '#E63946' }
    };

    const razor = new (window as any).Razorpay(options);
    razor.open();
  });
}
initiateOnlinePayment() {
  const total = this.getTotal() + (this.getTotal() * 0.05);

  this.http.post<any>('http://localhost:8080/api/orders', {
    bookingId:   this.bookingId,
    cafeId:      this.cafeId,
    customerId:  Number(localStorage.getItem('userId')),
    totalAmount: total
  }).subscribe(orderRes => {

    this.orderId = orderRes.orderId;

    const items = this.cart.map(item => ({
      orderId: this.orderId,
      menuId:  item.id,
      qty:     item.qty,
      price:   item.price
    }));

    this.http.post('http://localhost:8080/api/order-items', items)
    .subscribe(() => {

      this.http.post<any>('http://localhost:8080/api/payments/create-order', {
        amount: total
      }).subscribe(rzpOrder => {

        const options: any = {
          key:         'rzp_test_SQJs88CuZgOLMM',
          amount:      rzpOrder.amount,
          currency:    'INR',
          name:        'Savour Cafe',
          description: 'Food Order Payment',
          order_id:    rzpOrder.id,

          method: {
            upi:        true,
            card:       true,
            netbanking: true,
            wallet:     true
          },

          prefill: {
            name:    localStorage.getItem('firstName') || 'Test User',
            email:   localStorage.getItem('email')     || 'test@example.com',
            contact: '9999999999',
            method:  'upi'
          },

          // ✅ handler is INSIDE options object
          handler: (response: any) => {
            this.paymentId = response.razorpay_payment_id;

            this.http.post('http://localhost:8080/api/payments', {
              orderId:       this.orderId,
              paymentId:     this.paymentId,
              paymentMethod: 'ONLINE',
              amount:        total
            }).subscribe(() => {
              Swal.fire({
                icon:  'success',
                title: 'Payment Successful!',
                html:  `Order placed!<br>
                        <small style="color:#94a3b8">
                          Payment ID: ${this.paymentId}
                        </small>`,
                confirmButtonColor: '#f97316'
              }).then(() => {
                this.cart = [];
                this.showPaymentPopup = false;
                this.router.navigate(['/user-dashboard'], {
                  queryParams: { tab: 'orders', highlight: this.orderId }
                });
              });
            });
          },  // ✅ handler closes here

          theme: { color: '#f97316' }  // ✅ only ONE theme, at the end

        };  // ✅ options closes here

        const rzp = new (window as any).Razorpay(options);
        rzp.open();

      });
    });
  });
}
sortTablesByGuestSize() {

  const guest = Number(this.guestCount);

  if (!guest) return;

  this.tables = this.tables.sort((a, b) => {

    const diffA = a.seats - guest;
    const diffB = b.seats - guest;

    // tables smaller than guest go to bottom
    if (diffA < 0 && diffB >= 0) return 1;
    if (diffB < 0 && diffA >= 0) return -1;

    return diffA - diffB;
  });

}
// Add this method
onDateChange(): void {
  this.selectedTime = ''; // reset selected time when date changes

  const today = new Date().toISOString().split('T')[0];

  if (this.selectedDate !== today) {
    // Future date — all time slots available
    this.availableTimeSlots = [...this.allTimeSlots];
    return;
  }

  // Today — filter out past times
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  this.availableTimeSlots = this.allTimeSlots.filter(slot => {
    const [timePart, meridiem] = slot.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    // Add 30 min buffer so user can't book a slot that's already passing
    if (hours > currentHour) return true;
    if (hours === currentHour && minutes > currentMinute + 30) return true;
    return false;
  });
}
paymentMode: string = 'CASH';
couponCode: string = '';

placeOrder() {
  if (this.cart.length === 0) {       // ✅ cart  (not cartItems)
    Swal.fire({
      icon: 'warning',
      title: 'Cart is Empty',
      text: 'Please add items before placing an order.',
      confirmButtonColor: '#f97316'
    });
    return;
  }

  if (this.paymentMode === 'CASH') {
    this.placeCashOrder();
  } else {
    this.initiateOnlinePayment();
  }
}
placeCashOrder() {
  const cashPaymentId = 'CASH-' + Date.now();
  const total = this.getTotal() + (this.getTotal() * 0.05);

  // Step 1 — create order
  this.http.post<any>('http://localhost:8080/api/orders', {
    bookingId:   this.bookingId,
    cafeId:      this.cafeId,
    customerId:  Number(localStorage.getItem('userId')),
    totalAmount: total
  }).subscribe(orderRes => {

    this.orderId = orderRes.orderId;

    // Step 2 — save order items
    const items = this.cart.map(item => ({
      orderId: this.orderId,
      menuId:  item.id,
      qty:     item.qty,
      price:   item.price
    }));

    this.http.post('http://localhost:8080/api/order-items', items)
    .subscribe(() => {

      // Step 3 — ✅ save payment record as CASH so it appears in payments table
      this.http.post('http://localhost:8080/api/payments', {
        orderId:       this.orderId,
        paymentId:     cashPaymentId,
        paymentMethod: 'CASH',        // ← stored in DB
        amount:        total,
        status:        'SUCCESS'
      }).subscribe(() => {

        Swal.fire({
          icon:  'success',
          title: 'Order Placed!',
          text:  `Pay ₹${total.toFixed(2)} at the counter.`,
          confirmButtonColor: '#f97316'
        }).then(() => {
          this.cart = [];
          this.router.navigate(['/user-dashboard'], {
            queryParams: { tab: 'orders', highlight: this.orderId }
          });
        });

      });
    });
  });
}


get subtotal(): number {
  return this.getTotal();
}

get tax(): number {
  return this.getTotal() * 0.05;
}

get total(): number {
  return this.getTotal() + (this.getTotal() * 0.05);
}
saveOrderItems(){

 const items=this.cart.map(item=>({

   orderId:this.orderId,
   menuId:item.id,
   qty:item.qty,
   price:item.price

 }));

 this.http.post("http://localhost:8080/api/order-items", items)
 .subscribe(()=>{

  // ✅ ONLY PLACE WHERE PAYMENT IS CALLED
  this.makePayment();

 });

}
loadPageData() {

  this.isLoading = true;
  console.log("loadPageData called");

  forkJoin({
    cafe: this.http.get<any>(`http://localhost:8080/api/customer/cafe/${this.cafeId}`),
    tables: this.http.get<any[]>(`http://localhost:8080/api/tables/${this.cafeId}`),
    menu: this.http.get<any[]>(`http://localhost:8080/api/customer/menu/${this.cafeId}`)
  }).subscribe({
    next: (res) => {

      console.log("Cafe API response:", res.cafe);
      console.log("Menu API response:", res.menu);

      this.cafe = res.cafe;
      this.tables = res.tables;
      this.menu = res.menu;

      if (res.cafe?.photos) {
        try {
          this.cafeImages = JSON.parse(res.cafe.photos);
        } catch {
          this.cafeImages = [];
        }
      }

      this.isLoading = false;
      console.log("Loading finished");

    },
    error: (err) => {
      console.error(err);
      this.isLoading = false;
    }
  });

}
closeReservation(): void {
  this.showReservation = false;
}
  loadTables(): void {
    this.http.get<any[]>(
      `http://localhost:8080/api/tables/${this.cafeId}`
    ).subscribe((res: any[]) => {
      this.tables = res;
    });
  }

 loadMenu(): void {
   this.http.get<any[]>(
     `http://localhost:8080/api/customer/menu/${this.cafeId}`
   ).subscribe({
     next: (res: any[]) => {
       this.menu = res;
     },
     error: (err) => {
       console.error("Menu API Error:", err);
     }
   });
 }
  openReservation(): void {
    this.showReservation = true;
  }

  selectTime(time: string): void {
    this.selectedTime = time;
  }

/*  confirmBooking(): void {

    const bookingData = {
      cafeId: this.cafeId,
      tableId: this.selectedTableId,
      bookingDate: this.selectedDate,
      bookingTime: this.selectedTime,
      customerId: localStorage.getItem("userId")
    };

    this.bookingService.bookTable(bookingData)
      .subscribe({
        next: () => {
          this.showReservation = false;
          this.showSuccess = true;

          setTimeout(() => {
            this.showSuccess = false;
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
          }, 2000);
        },
     error: (err: any) => {

       if (err.error?.message) {
         alert(err.error.message);
       } else if (typeof err.error === 'string') {
         alert(err.error);
       } else {
         alert("Booking Failed");
       }

     }
      });
  }*/

addToCart(item: any): void {

  if(!this.bookingId){
  Swal.fire({
    icon: 'warning',
    title: 'Book Table First',
    text: 'Please reserve a table before ordering food'
  });
  return;

  }

  const existing = this.cart.find(i => i.id === item.id);

  if (existing) {
    existing.qty++;
  } else {
    this.cart.push({ ...item, qty: 1 });
  }
}

  increaseQty(item: any): void {
    item.qty++;
  }

  decreaseQty(item: any): void {
    if (item.qty > 1) {
      item.qty--;
    } else {
      this.cart = this.cart.filter(i => i.id !== item.id);
    }
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) =>
      sum + (item.price * item.qty), 0);
  }
openMenuPage() {
  this.currentView = 'menu';
    console.log("Opening menu page");
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
closePayment(){

Swal.fire({
  title: 'Cancel Payment?',
  text: 'Your payment process will be stopped',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, Cancel',
  cancelButtonText: 'Continue Payment'
}).then(result => {

if(result.isConfirmed){
  this.showPaymentPopup = false;

  Swal.fire({
    icon: 'info',
    title: 'Payment Cancelled',
    timer: 1200,
    showConfirmButton: false
  });
}

});

}

restoreCartFromReorder(reorderItems: any[]): void {
  this.cart = [];
  let restoredCount = 0;

  reorderItems.forEach((reorderItem: any) => {
    // Match menu item by name (reorderItem has menuName from OrderItem interface)
    const menuItem = this.menu.find((m: any) =>
      m.name === reorderItem.menuName
    );
    if (menuItem) {
      this.cart.push({ ...menuItem, qty: reorderItem.qty });
      restoredCount++;
    }
  });

  if (restoredCount > 0) {
    // Switch to menu view so cart is visible
    this.currentView = 'menu';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Swal.fire({
      icon: 'info',
      title: `${restoredCount} Item(s) Added to Cart`,
      html: `Your previous order items have been restored.<br>
             <small style="color:#94a3b8">Please book a table first, then proceed to pay.</small>`,
      confirmButtonColor: '#f97316',
      confirmButtonText: 'Got it!'
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Items Not Found',
      text: 'Some items from your previous order may no longer be available.',
      confirmButtonColor: '#f97316'
    });
  }
}
}
