import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  tab = 'dashboard';
showProfile=false;
  totalOrders = 0;
  totalAmount = 0;
  customers = 0;

  orders:any[]=[];
  //reservations:any[]=[];
  topFoods:any[]=[];
sortOrder = 'asc';
reservationsCount = 0;
currentPage = 1;
itemsPerPage = 7;

filteredReservations:any[]=[];
  user:any={};
days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

monthNames = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

currentDate = new Date();
currentMonth = this.currentDate.getMonth();
currentYear = this.currentDate.getFullYear();
dashboardReservations:any[]=[];
calendarDates:any[] = [];
 constructor(private http:HttpClient, private router: Router){}

  ngOnInit(){
      this.loadDashboard();
      this.generateCalendar();
      this.loadReservations();
      this.loadOrders();


  }

loadDashboard(){

const customerId = localStorage.getItem("userId");

this.http.get<any>(`http://localhost:8080/api/dashboard/${customerId}`)
.subscribe(res=>{

this.totalOrders = res.totalOrders || 0;
this.totalAmount = res.totalAmount || 0;
this.reservationsCount = res.reservations || 0;
this.topFoods = res.topFoods || [];

});

}
sortReservations(order:string){

this.sortOrder = order;

this.filteredReservations = [...this.reservations];

this.filteredReservations.sort((a:any,b:any)=>{

let d1 = new Date(a.bookingDate).getTime();
let d2 = new Date(b.bookingDate).getTime();

return order === 'asc' ? d1 - d2 : d2 - d1;

});

this.currentPage = 1;

}
get paginatedReservations(){

const start =
(this.currentPage - 1) * this.itemsPerPage;

const end =
start + this.itemsPerPage;

return this.filteredReservations.slice(start,end);

}

get totalPages(){
return Math.ceil(
this.filteredReservations.length /
this.itemsPerPage
);
}

nextPage(){

if(this.currentPage < this.totalPages){
this.currentPage++;
}

}

prevPage(){

if(this.currentPage > 1){
this.currentPage--;
}

}
generateCalendar(){

this.calendarDates = [];

let firstDay = new Date(this.currentYear,this.currentMonth,1).getDay();

let totalDays =
new Date(this.currentYear,this.currentMonth+1,0).getDate();

for(let i=0;i<firstDay;i++){
this.calendarDates.push({day:""});
}

for(let d=1; d<=totalDays; d++){

this.calendarDates.push({day:d});

}

}

prevMonth(){

this.currentMonth--;

if(this.currentMonth<0){
this.currentMonth=11;
this.currentYear--;
}

this.generateCalendar();

}

nextMonth(){

this.currentMonth++;

if(this.currentMonth>11){
this.currentMonth=0;
this.currentYear++;
}

this.generateCalendar();

}
isSameDate(y:number,m:number,d:number){

const today = new Date();

return (
today.getFullYear() === y &&
today.getMonth() === m &&
today.getDate() === d
);

}

toggleProfile(){
this.showProfile=!this.showProfile;
}

goToCafe(){
this.router.navigate(['/user-dashboard']);
}

logout(){

Swal.fire({
  title: 'Logout?',
  text: 'Are you sure you want to logout?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, Logout'
}).then(result => {

if(result.isConfirmed){
  localStorage.clear();
  this.router.navigate(['/']);
}

});

}

resetPassword(){
this.router.navigate(['/reset-password']);
}

openAbout(){
this.router.navigate(['/about']);
}



getDateClass(date:any){

  if(!date.day) return "";

  const cellDate =
  `${this.currentYear}-${String(this.currentMonth+1).padStart(2,'0')}-${String(date.day).padStart(2,'0')}`;

  const today = new Date();
  const todayStr =
  `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  // check if any reservation exists for this day
  const booking = this.reservations.find(r => r.bookingDate === cellDate);

  if(!booking) return "";

  if(cellDate === todayStr){
    return "today";
  }

  if(cellDate < todayStr){
    return "completed";
  }

  return "upcoming";
}


updateProfile(){

Swal.fire({
  title: 'Save Changes?',
  text: 'Do you want to update your profile?',
  icon: 'question',
  showCancelButton: true,
  confirmButtonText: 'Yes, Save',
  cancelButtonText: 'Cancel'
}).then(result => {

if(result.isConfirmed){

this.http.put('http://localhost:8080/api/user/update',this.user)
.subscribe({

next: () => {

Swal.fire({
  icon: 'success',
  title: 'Profile Updated',
  text: 'Your changes have been saved successfully',
  timer: 1500,
  showConfirmButton: false
});

},

error: () => {

Swal.fire({
  icon: 'error',
  title: 'Update Failed',
  text: 'Something went wrong. Please try again',
  confirmButtonColor: '#d33'
});

}

});

}

});

}
reservations:any[]=[];
loadReservations(){

const customerId = localStorage.getItem("userId") || "22";

this.http.get<any>(
`http://localhost:8080/api/bookings/calendar/${customerId}`
)
.subscribe(res=>{
this.filteredReservations = [...this.reservations];
// normalize reservations
this.reservations = res.map((r:any)=>({
  ...r,
  day: Number(r.bookingDate.split("-")[2])
}));

console.log("Reservations:",this.reservations);

// -------- DASHBOARD NOTIFICATIONS --------
const today = new Date().toISOString().split('T')[0];

let filtered = this.reservations.filter((r:any)=>
  r.bookingDate >= today
);

// sort by nearest date
filtered.sort((a:any,b:any)=>
  new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
);

// show only 3
this.dashboardReservations = filtered.slice(0,3);

// -------- CALENDAR --------
this.generateCalendar();

});
}
getReservationStatus(r:any){

const today = new Date().toISOString().split('T')[0];

if(r.bookingDate === today){
return 'today-reservation';
}

if(r.bookingDate > today){
return 'upcoming-reservation';
}

return 'completed-reservation';

}
toggleOrder(order:any){

order.open = !order.open;

}
loadOrders(){

const customerId = localStorage.getItem("userId");
if(this.orders.length === 0){
  Swal.fire({
    icon: 'info',
    title: 'No Orders',
    text: 'You have no orders yet'
  });
}
this.http.get<any>(
`http://localhost:8080/api/orders/customer/${customerId}`
).subscribe(res=>{

this.orders = res;

});

}
}
