import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
export interface OrderItem {

  menuName:string;
  qty:number;
  price:number;

}

export interface Order {
  orderId: string;
  cafeName: string;
  cafeId: number;
  tableNo: number;
  tableName: string;
  lastName: string;
  bookingId: string;
  paymentId: string;
  paymentMethod: string;
  bookingDate: string;
  bookingTime: string;
  totalAmount: number;
  status: string;
  orderStatus: string;
  chefStatus: string;
  waiterStatus: string;
  items: OrderItem[];
  open?: boolean;
}
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})

export class UserDashboard implements OnInit {
completedCount = 0;
todayCount = 0;
upcomingCount = 0;
constructor(
  private http: HttpClient,
  private router: Router,
  private route: ActivatedRoute
) {}

// ✅ FIX: use ONE variable "tab" consistently (template uses tab)
tab = 'dashboard';
highlightOrderId: any;

orderSearch = '';
orderSort = 'recent';
orderDate = '';
totalOrders = 0;
totalAmount = 0;
reservationsCount = 0;
showReservationFilter = false;
reservationFilter = 'all';
reservationDate = '';
orders: Order[] = [];
// keep a master copy so filters don't destroy data
private _allOrders: Order[] = [];

payments: any[] = [];
topFoods: any[] = [];
dashboardReservations: any[] = [];
currentDate = new Date();
currentMonth = this.currentDate.getMonth();
currentYear = this.currentDate.getFullYear();
calendarDates: any[] = [];

cafeName: string = '';
cafeId: number = Number(localStorage.getItem("cafeId"));
userId: number = Number(localStorage.getItem("userId"));

isEditMode = false;
profile: any = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  phone: '',
  dob: '',
  gender: '',
  doorNo: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  educationDetails: [],
  workDetails: [],
  governmentId: ''
};
recentPayments: any[] = [];
filteredPayments: any[] = [];

paymentPage = 1;
paymentItemsPerPage = 10;
paymentTotalPages = 0;

paymentSort = 'recent';
paymentDate = '';
showProfile = false;

user: any = {};
days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

cafes: any[] = [];
filteredCafes: any[] = [];

searchText = '';
vegFilter = false;
nonVegFilter = false;

cafePageNumber = 1;
cafeItemsPerPage = 12;
cafeTotalPages = 0;
pages: number[] = [];

reservationPage = 1;
reservationItemsPerPage = 7;
filteredReservations: any[] = [];
sortOrder = 'asc';

orderPageNumber = 1;
orderItemsPerPage = 12;
orderTotalPages = 0;
orderPages: number[] = [];

showPopup = false;
oldPassword = '';
newPassword = '';
strengthMessage = '';
strengthColor = 'red';

ngOnInit() {
  this.loadDashboard();
  this.loadOrders();
  this.loadPayments();
  this.loadCafes();
  this.loadProfile();

  // ✅ FIX: read queryParams into "tab" (not "activeTab")
  this.route.queryParams.subscribe(params => {
    if (params['tab']) {
      this.tab = params['tab'];
    }
    if (params['highlight']) {
      this.highlightOrderId = params['highlight'];
    }
  });

  setInterval(() => {
    this.loadOrders();
  }, 5000);
}

get paginatedOrders() {
  const start = (this.orderPageNumber - 1) * this.orderItemsPerPage;
  return this.orders.slice(start, start + this.orderItemsPerPage);
}

toggleReservationFilter() {
  this.showReservationFilter = !this.showReservationFilter;
}

filterReservations(type: string) {
  const today = new Date().toISOString().split('T')[0];
  if (type === 'all') {
    this.filteredReservations = [...this.reservations];
  } else if (type === 'today') {
    this.filteredReservations = this.reservations.filter(r => r.bookingDate === today);
  } else if (type === 'upcoming') {
    this.filteredReservations = this.reservations.filter(r => r.bookingDate > today);
  } else if (type === 'completed') {
    this.filteredReservations = this.reservations.filter(r => r.bookingDate < today);
  }
  this.reservationPage = 1;
  this.showReservationFilter = false;
}

filterReservationsByDate() {
  if (!this.reservationDate) {
    this.filteredReservations = [...this.reservations];
    return;
  }
  this.filteredReservations = this.reservations.filter(r => r.bookingDate === this.reservationDate);
  this.reservationPage = 1;
}

loadDashboard() {
  const customerId = localStorage.getItem("userId");
  this.http.get<any>(`http://localhost:8080/api/dashboard/customer/${customerId}`)
    .subscribe(res => {
      this.totalOrders = res.totalOrders || 0;
      this.totalAmount = res.totalAmount || 0;
      this.reservationsCount = res.reservations || 0;
      this.topFoods = (res.topFoods || []).slice(0, 3);
      this.generateCalendar();
    });
}

downloadReceipt(order: any) {
  const element = document.getElementById('receipt-' + order.orderId);
  if (!element) return;

  // Temporarily make visible for capture
  const prevDisplay = element.style.display;
  element.style.display = 'block';

  html2canvas(element).then(canvas => {
    element.style.display = prevDisplay;
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('Savour-Receipt-' + order.orderId + '.pdf');
  });
}

getOrderStep(o: Order): number {
  if (o.waiterStatus === 'SERVED') return 4;
  if (o.chefStatus === 'READY') return 3;
  if (o.chefStatus === 'PREPARING') return 2;
  return 1;
}

get todayOrders() {
  const today = new Date().toISOString().split("T")[0];
  return this._allOrders.filter(o => {
    const d = typeof o.bookingDate === 'string'
      ? o.bookingDate
      : new Date(o.bookingDate).toISOString().split('T')[0];
    return d === today;
  });
}

generateCalendar() {
  this.calendarDates = [];
  let firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
  let totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    this.calendarDates.push({ day: "" });
  }
  for (let d = 1; d <= totalDays; d++) {
    this.calendarDates.push({ day: d });
  }
}

goToOrderPage(page: number) { this.orderPageNumber = page; }
nextOrderPage() { if (this.orderPageNumber < this.orderTotalPages) this.orderPageNumber++; }
prevOrderPage() { if (this.orderPageNumber > 1) this.orderPageNumber--; }
prevMonth() {
  this.currentMonth--;
  if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
  this.generateCalendar();
}
nextMonth() {
  this.currentMonth++;
  if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
  this.generateCalendar();
}
isSameDate(y: number, m: number, d: number) {
  const today = new Date();
  return today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
}

getDateClass(date: any) {
  if (!date.day) return "";
  const cellDate = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const booking = this.reservations.find(r => r.bookingDate === cellDate);
  if (!booking) return "";
  if (cellDate === todayStr) return "today";
  if (cellDate < todayStr) return "completed";
  return "upcoming";
}

loadCafes() {
  this.http.get<any[]>("http://localhost:8080/api/customer/cafes")
    .subscribe(data => {
      this.cafes = data.map(cafe => ({
        ...cafe,
        photos: cafe.photos ? JSON.parse(cafe.photos) : []
      }));
      this.filteredCafes = [...this.cafes];
      this.updateCafePagination();
    });
}

updateCafePagination() {
  this.cafeTotalPages = Math.ceil(this.filteredCafes.length / this.cafeItemsPerPage);
  this.pages = Array(this.cafeTotalPages).fill(0).map((x, i) => i + 1);
}

get paginatedCafes() {
  const start = (this.cafePageNumber - 1) * this.cafeItemsPerPage;
  return this.filteredCafes.slice(start, start + this.cafeItemsPerPage);
}

goToPage(page: number) { this.cafePageNumber = page; }
nextPage() { if (this.cafePageNumber < this.cafeTotalPages) this.cafePageNumber++; }

// ✅ FIX: applyOrderFilters works on _allOrders so search doesn't destroy data
applyOrderFilters() {
  let filtered = [...this._allOrders];

  if (this.orderSearch) {
    const search = this.orderSearch.toLowerCase();
    filtered = filtered.filter(o =>
      o.orderId.toLowerCase().includes(search) ||
      o.cafeName.toLowerCase().includes(search) ||
      o.items.some(i => i.menuName.toLowerCase().includes(search))
    );
  }

  if (this.orderDate) {
    filtered = filtered.filter(o => {
      const orderDate = typeof o.bookingDate === 'string'
        ? o.bookingDate
        : new Date(o.bookingDate).toISOString().split('T')[0];
      return orderDate === this.orderDate;
    });
  }

  if (this.orderSort === 'recent') {
    filtered.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  }
  if (this.orderSort === 'old') {
    filtered.sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
  }

  this.orders = filtered;
  this.orderPageNumber = 1;
  this.updateOrderPagination();
}

sortOrders() {
  if (this.orderSort === 'recent') {
    this.orders.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  }
  if (this.orderSort === 'old') {
    this.orders.sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
  }
  this.updateOrderPagination();
}

showFilterMenu = false;
toggleFilterMenu() { this.showFilterMenu = !this.showFilterMenu; }
setSort(type: string) {
  this.orderSort = type;
  this.showFilterMenu = false;
  this.applyOrderFilters();
}

prevPage() { if (this.cafePageNumber > 1) this.cafePageNumber--; }

applyFilters() {
  this.filteredCafes = this.cafes.filter(cafe => {
    const matchSearch = cafe.name.toLowerCase().includes(this.searchText.toLowerCase());
    const matchVeg = !this.vegFilter || cafe.foodType === 'veg';
    const matchNonVeg = !this.nonVegFilter || cafe.foodType === 'nonveg';
    return matchSearch && matchVeg && matchNonVeg;
  });
  this.updateCafePagination();
}

toggleVeg() { this.vegFilter = !this.vegFilter; this.applyFilters(); }
toggleNonVeg() { this.nonVegFilter = !this.nonVegFilter; this.applyFilters(); }

loadOrders() {
  const customerId = localStorage.getItem("userId");
  this.http.get<Order[]>(`http://localhost:8080/api/orders/customer/${customerId}`)
    .subscribe(res => {
      this._allOrders = res.map(o => ({ ...o, open: false }));
      this.orders = [...this._allOrders];
      this.updateOrderPagination();
      this.loadReservations();
    });
}

updateOrderPagination() {
  this.orderTotalPages = Math.ceil(this.orders.length / this.orderItemsPerPage);
  this.orderPages = Array(this.orderTotalPages).fill(0).map((x, i) => i + 1);
}

reservations: any[] = [];

loadReservations() {
  const customerId = localStorage.getItem("userId") || "22";
  this.http.get<any>(`http://localhost:8080/api/bookings/calendar/${customerId}`)
    .subscribe(res => {
      this.reservations = res.map((r: any) => {
        const order = this._allOrders.find(o => o.bookingId === r.bookingId);
        return {
          ...r,
          tableNo: order?.tableNo || r.tableId,
          tableName: order?.tableName || '',
          day: Number(r.bookingDate.split("-")[2])
        };
      });

      this.filteredReservations = [...this.reservations];

      const today = new Date().toISOString().split('T')[0];
      let filtered = this.reservations.filter((r: any) => r.bookingDate >= today);
      filtered.sort((a: any, b: any) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
      this.dashboardReservations = filtered.slice(0, 2);

      this.completedCount = 0;
      this.todayCount = 0;
      this.upcomingCount = 0;

      this.reservations.forEach((r: any) => {
        if (r.bookingDate < today) this.completedCount++;
        else if (r.bookingDate === today) this.todayCount++;
        else this.upcomingCount++;
      });

      this.generateCalendar();
      this.buildNotifications();
    });
}

showPaymentFilter = false;
togglePaymentFilter() { this.showPaymentFilter = !this.showPaymentFilter; }
setPaymentSort(type: string) {
  this.paymentSort = type;
  this.showPaymentFilter = false;
  this.applyPaymentFilters();
}

get paginatedReservations() {
  const start = (this.reservationPage - 1) * this.reservationItemsPerPage;
  return this.filteredReservations.slice(start, start + this.reservationItemsPerPage);
}

get reservationTotalPages() {
  return Math.ceil(this.filteredReservations.length / this.reservationItemsPerPage);
}

nextReservationPage() { if (this.reservationPage < this.reservationTotalPages) this.reservationPage++; }
prevReservationPage() { if (this.reservationPage > 1) this.reservationPage--; }

getReservationStatus(r: any) {
  const today = new Date().toISOString().split('T')[0];
  if (r.bookingDate === today) return 'today-reservation';
  if (r.bookingDate > today) return 'upcoming-reservation';
  return 'completed-reservation';
}

toggleOrder(order: any) { order.open = !order.open; }

sortReservations(order: string) {
  this.sortOrder = order;
  this.filteredReservations = [...this.reservations];
  this.filteredReservations.sort((a: any, b: any) => {
    let d1 = new Date(a.bookingDate).getTime();
    let d2 = new Date(b.bookingDate).getTime();
    return order === 'asc' ? d1 - d2 : d2 - d1;
  });
  this.reservationPage = 1;
}

paymentChart: any;

createPaymentChart() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let dailyTotals: number[] = new Array(daysInMonth).fill(0);
  let totalRevenue = 0;

  this.payments.forEach((p: any) => {
    const date = new Date(p.paymentTime);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      const day = date.getDate() - 1;
      dailyTotals[day] += p.amount;
      totalRevenue += p.amount;
    }
  });

  const labels: string[] = [];
  for (let i = 1; i <= daysInMonth; i++) labels.push(i.toString());

  setTimeout(() => {
    const ctx = document.getElementById("chart") as HTMLCanvasElement;
    if (!ctx) return;
    if (this.paymentChart) this.paymentChart.destroy();
    this.paymentChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Daily Revenue ₹',
          data: dailyTotals,
          backgroundColor: '#ff7a00',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx: any) => `₹ ${ctx.raw}` } }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#eee' } }
        },
        animation: { duration: 1200 }
      }
    });
  }, 200);

  const label = document.getElementById("totalRevenue");
  if (label) label.innerText = "₹" + totalRevenue;
}

openChange() { this.showPopup = true; }
close() { this.showPopup = false; }

checkStrength() {
  const p = this.newPassword;
  const strong = /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p) && p.length >= 8;
  if (strong) {
    this.strengthMessage = "Strong Password ✅";
    this.strengthColor = "green";
  } else {
    this.strengthMessage = "Must contain: 8 chars, uppercase, lowercase, number, special char";
    this.strengthColor = "red";
  }
}

changePassword() {
  const email = localStorage.getItem("email");
  this.http.post<any>("http://localhost:8080/api/auth/change-password", {
    email: email,
    oldPassword: this.oldPassword,
    newPassword: this.newPassword
  }).subscribe(res => {
    Swal.fire({ icon: 'success', title: 'Password Updated', text: res.message, confirmButtonColor: '#3085d6' });
    this.close();
  });
}

openCafe(id: number) { this.router.navigate(['/cafe', id]); }
toggleProfile() { this.showProfile = !this.showProfile; }

logout() {
  Swal.fire({
    title: 'Logout?', text: 'Are you sure you want to logout?', icon: 'warning',
    showCancelButton: true, confirmButtonText: 'Yes, Logout'
  }).then(result => {
    if (result.isConfirmed) { localStorage.clear(); this.router.navigate(['/login']); }
  });
}

filterRating(event: any) {
  const rating = event.target.value;
  if (rating) this.filteredCafes = this.cafes.filter(cafe => cafe.rating >= rating);
  else this.filteredCafes = [...this.cafes];
}

sortAlphabetically(event: any) {
  const value = event.target.value;
  if (value === "az") this.filteredCafes.sort((a, b) => a.name.localeCompare(b.name));
  if (value === "za") this.filteredCafes.sort((a, b) => b.name.localeCompare(a.name));
}

loadProfile() {
  this.http.get<any>(`http://localhost:8080/api/profile/${this.userId}`)
    .subscribe(data => {
      const personal = JSON.parse(data.personalDetails || '{}');
      const address = JSON.parse(data.addressDetails || '{}');
      const education = JSON.parse(data.educationDetails || '[]');
      const work = JSON.parse(data.workDetails || '[]');
      const document = JSON.parse(data.documentDetails || '{}');
      this.profile = {
        ...personal, ...address,
        educationDetails: education,
        workDetails: work,
        governmentId: document.governmentId || '',
        email: data.email,
        phone: data.phone,
        role: data.role
      };
    });
}

saveProfile() {
  const payload = {
    email: this.profile.email,
    phone: this.profile.phone,
    personalDetails: JSON.stringify({ firstName: this.profile.firstName, lastName: this.profile.lastName, dob: this.profile.dob, gender: this.profile.gender }),
    addressDetails: JSON.stringify({ doorNo: this.profile.doorNo, address: this.profile.address, city: this.profile.city, state: this.profile.state, pincode: this.profile.pincode }),
    educationDetails: JSON.stringify(this.profile.educationDetails || []),
    workDetails: JSON.stringify(this.profile.workDetails || []),
    documentDetails: JSON.stringify({ governmentId: this.profile.governmentId })
  };

  this.http.put(`http://localhost:8080/api/profile/update/${this.userId}`, payload)
    .subscribe({
      next: () => {
        this.isEditMode = false;
        Swal.fire({ icon: 'success', title: 'Profile Updated', text: 'Your profile has been updated successfully', confirmButtonColor: '#3085d6' });
        this.loadProfile();
      },
      error: () => {
        Swal.fire({ icon: 'success', title: 'Profile Updated', timer: 2000, showConfirmButton: false });
      }
    });
}

addWork() {
  if (!this.profile.workDetails) this.profile.workDetails = [];
  this.profile.workDetails.push({ company: '', role: '', experience: '' });
}
addEducation() {
  if (!this.profile.educationDetails) this.profile.educationDetails = [];
  this.profile.educationDetails.push({ school: '', degree: '', year: '' });
}
removeWork(i: number) { this.profile.workDetails.splice(i, 1); }
removeEducation(index: number) { this.profile.educationDetails.splice(index, 1); }

loadPayments() {
  const customerId = localStorage.getItem("userId");
  this.http.get<any[]>(`http://localhost:8080/api/payments/customer/${customerId}`)
    .subscribe(res => {
      this.payments = res || [];
      this.payments.sort((a, b) => new Date(b.paymentTime).getTime() - new Date(a.paymentTime).getTime());
      this.recentPayments = this.payments.slice(0, 3);
      this.filteredPayments = [...this.payments];
      this.updatePaymentPagination();
      this.createPaymentChart();
    });
}

applyPaymentFilters() {
  let filtered = [...this.payments];
  if (this.paymentDate) {
    filtered = filtered.filter(p => {
      const date = new Date(p.paymentTime).toISOString().split("T")[0];
      return date === this.paymentDate;
    });
  }
  if (this.paymentSort === 'recent') filtered.sort((a, b) => new Date(b.paymentTime).getTime() - new Date(a.paymentTime).getTime());
  if (this.paymentSort === 'old') filtered.sort((a, b) => new Date(a.paymentTime).getTime() - new Date(b.paymentTime).getTime());
  this.filteredPayments = filtered;
  this.paymentPage = 1;
  this.updatePaymentPagination();
}

updatePaymentPagination() {
  this.paymentTotalPages = Math.ceil(this.filteredPayments.length / this.paymentItemsPerPage);
}

get paginatedPayments() {
  const start = (this.paymentPage - 1) * this.paymentItemsPerPage;
  return this.filteredPayments.slice(start, start + this.paymentItemsPerPage);
}

nextPaymentPage() { if (this.paymentPage < this.paymentTotalPages) this.paymentPage++; }
prevPaymentPage() { if (this.paymentPage > 1) this.paymentPage--; }

showNotifDropdown = false;
notifications: any[] = [];

buildNotifications() {
  const today = new Date().toISOString().split('T')[0];
  this.notifications = [];
  this.reservations.filter(r => r.bookingDate === today).forEach(r => {
    this.notifications.push({
      id: r.bookingId,
      icon: '📅',
      title: 'Reservation Today!',
      body: `Table ${r.tableNo} booked at ${r.bookingTime}. Booking #${r.bookingId}`,
      time: r.bookingTime,
      read: false
    });
  });
  this.todayOrders.forEach(o => {
    if (o.chefStatus === 'READY') {
      this.notifications.push({
        id: 'order-' + o.orderId,
        icon: '☕',
        title: 'Order Ready!',
        body: `Your order #${o.orderId} at ${o.cafeName} is ready.`,
        time: '',
        read: false
      });
    }
  });
}

get unreadCount(): number { return this.notifications.filter(n => !n.read).length; }
toggleNotifDropdown() { this.showNotifDropdown = !this.showNotifDropdown; }
markAllRead() { this.notifications.forEach(n => n.read = true); }
readNotif(notif: any) { notif.read = true; }
closeNotifOnOutsideClick() { this.showNotifDropdown = false; }

// ✅ FIX: canCancelOrder — use booking date/time properly
canCancelOrder(o: Order): boolean {
  if (o.orderStatus === 'CANCELLED') return false;
  if (o.waiterStatus === 'SERVED') return false;
  if (o.chefStatus === 'COMPLETED') return false;

  try {
    // bookingDate could be "2026-03-20" or a Date object
    const bookingDateStr = typeof o.bookingDate === 'string'
      ? o.bookingDate
      : new Date(o.bookingDate).toISOString().split('T')[0];

    const today = new Date().toISOString().split('T')[0];

    // Future booking — can always cancel
    if (bookingDateStr > today) return true;

    // Past booking — cannot cancel
    if (bookingDateStr < today) return false;

    // Same day — check if within 6 hours of booking time
    // bookingTime format: "10:00 AM"
    if (o.bookingTime) {
      const [timePart, meridiem] = o.bookingTime.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (meridiem === 'PM' && hours !== 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;

      const bookingDateTime = new Date(bookingDateStr);
      bookingDateTime.setHours(hours, minutes, 0, 0);
      const now = new Date();
      const diffHours = (now.getTime() - bookingDateTime.getTime()) / (1000 * 60 * 60);
      return diffHours <= 6;
    }

    return true;
  } catch {
    return false;
  }
}

cancelOrder(o: Order) {
  Swal.fire({
    title: 'Cancel Order?',
    text: `Cancel Order #${o.orderId}? This cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Cancel',
    cancelButtonText: 'Keep Order',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#f97316'
  }).then(result => {
    if (!result.isConfirmed) return;
    this.http.put(`http://localhost:8080/api/orders/cancel/${o.orderId}`, {})
      .subscribe({
        next: () => {
          o.orderStatus = 'CANCELLED';
          // update in master list too
          const master = this._allOrders.find(x => x.orderId === o.orderId);
          if (master) master.orderStatus = 'CANCELLED';
          Swal.fire({ icon: 'success', title: 'Order Cancelled', timer: 2000, showConfirmButton: false });
        },
        error: () => {
          Swal.fire({ icon: 'error', title: 'Cannot Cancel', text: 'Failed to cancel. Please try again.', confirmButtonColor: '#f97316' });
        }
      });
  });
}

// ✅ FIX: orderAgain — stores items and cafeId, navigates to cafe
orderAgain(o: Order) {
  localStorage.setItem('reorderItems', JSON.stringify(o.items));
  localStorage.setItem('reorderCafeId', String(o.cafeId));
  this.router.navigate(['/cafe', o.cafeId], {
    queryParams: { reorder: 'true' }
  });
}

// ✅ FIX: correct subtotal/tax — totalAmount in DB is already the FINAL amount
getOrderTax(o: Order): number {
  // totalAmount = subtotal * 1.05  →  tax = totalAmount - (totalAmount / 1.05)
  return Math.round((o.totalAmount - o.totalAmount / 1.05) * 100) / 100;
}

getOrderSubtotal(o: Order): number {
  return Math.round((o.totalAmount / 1.05) * 100) / 100;
}

// ✅ FIX: check both ONLINE and RAZORPAY
isOnlinePayment(o: Order): boolean {
  const method = (o.paymentMethod || '').toUpperCase().trim();
  return method === 'ONLINE' || method === 'RAZORPAY';
}
}
