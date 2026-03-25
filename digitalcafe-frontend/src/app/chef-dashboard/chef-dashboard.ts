import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
interface OrderItem {
  menuId:number;
  qty:number;
  menuName?:string;
}

interface Order {
  orderId:string;
  tableNo:number | null;
  chefStatus:string;

  bookingDate:string;
  bookingTime:string;

  items:OrderItem[];
}
@Component({
  selector: 'app-chef-dashboard',
  standalone: true,
    imports: [CommonModule, FormsModule],
  templateUrl: './chef-dashboard.html',
  styleUrls: ['./chef-dashboard.css']
})
export class ChefDashboardComponent implements OnInit {
filter:string='ALL';
filteredTodayOrders:Order[]=[];
view='today';
selectedDate = new Date().toISOString().split('T')[0];
upcomingPageSize = 12;
upcomingCurrentPage = 1;
upcomingTotalPages = 1;

visibleUpcomingPages:number[] = [];
// Completed orders pagination
completedPageSize = 10;
completedCurrentPage = 1;
completedTotalPages = 1;
paginatedCompletedOrders: Order[] = [];
visibleCompletedPages: number[] = [];

// Date filter for completed
completedSelectedDate = '';
allCompletedOrders: Order[] = []; // master list
paginatedUpcomingOrders:Order[] = [];
orders:Order[]=[];
todayOrders:Order[]=[];
upcomingOrders:Order[]=[];
completedOrders:Order[]=[];
selectedOrder:Order | null = null;
cafeName: string = '';
cafeId:number = Number(localStorage.getItem("cafeId"));
userId:number = Number(localStorage.getItem("userId"));

isEditMode=false;

profile:any={
firstName:'',
lastName:'',
email:'',
role:'',
phone:'',
dob:'',
gender:'',
doorNo:'',
address:'',
city:'',
state:'',
pincode:'',
educationDetails:[],
workDetails:[],
governmentId:''
};

constructor(
private http:HttpClient,
private router:Router
){}


ngOnInit(){
  console.log("Chef ID:", this.userId);
  console.log("Logged Chef ID:", this.userId);
this.loadCafeName();
this.loadOrders();
this.loadProfile();

/* auto refresh every 5 seconds */

setInterval(()=>{
this.loadOrders();
},5000);

}

filterUpcomingByDate(){

this.upcomingOrders = this.orders.filter(o =>
o.bookingDate === this.selectedDate &&
o.chefStatus !== 'COMPLETED'
);

this.upcomingTotalPages =
Math.ceil(this.upcomingOrders.length / this.upcomingPageSize);

this.changeUpcomingPage(1);

}
applyFilter(){

if(this.filter === 'ALL'){
this.filteredTodayOrders = this.todayOrders;
}
else{
this.filteredTodayOrders =
this.todayOrders.filter(o => o.chefStatus === this.filter);
}

}
setFilter(status:string){

this.filter = status;
this.applyFilter();

}
loadCafeName(){

this.http.get<any>(
`http://localhost:8080/api/cafe/${this.cafeId}`
).subscribe(res => {

this.cafeName = res.name;

});

}
loadOrders(){

this.http.get<Order[]>(`http://localhost:8080/api/orders/chef/${this.cafeId}`)
.subscribe(data=>{
console.log("Orders from backend:",data);
this.orders=data;

this.filterOrders();

});

}



getToday(){
return new Date().toISOString().split('T')[0];
}


filterOrders(){

const today = new Date().toISOString().split('T')[0];

/* All today's orders (do NOT remove completed here) */
this.todayOrders = this.orders.filter(o =>
o.bookingDate === today
);

/* Upcoming orders */

this.upcomingOrders = this.orders
.filter(o =>
o.bookingDate > today &&
o.chefStatus !== 'COMPLETED'
)
.sort((a,b)=>{

const dateA = new Date(a.bookingDate + " " + a.bookingTime);
const dateB = new Date(b.bookingDate + " " + b.bookingTime);

return dateA.getTime() - dateB.getTime();

});

/* Pagination */

this.upcomingTotalPages =
Math.ceil(this.upcomingOrders.length / this.upcomingPageSize);

this.changeUpcomingPage(1);

/* Completed orders table */

this.allCompletedOrders = this.orders.filter(o => o.chefStatus === 'COMPLETED');
this.applyCompletedFilter();

/* Apply today's filter */

this.applyFilter();

// Make sure this line is correct


}
changeStatus(order:any){

let status = order.chefStatus;

if(status === 'PENDING'){
    status = 'PREPARING';
}

else if(status === 'PREPARING'){
    status = 'COMPLETED';
}

this.http.put(
`http://localhost:8080/api/orders/chef-status/${order.orderId}?status=${status}`,
{}
).subscribe(()=>{

order.chefStatus = status;

/* If completed, move to table after 1 minute */

if(status === 'COMPLETED'){

setTimeout(()=>{

this.filterOrders();

},120000); // 1 minute

}

this.filterOrders();

});

}

applyCompletedFilter() {
  const filtered = this.completedSelectedDate
    ? this.allCompletedOrders.filter(o => o.bookingDate === this.completedSelectedDate)
    : [...this.allCompletedOrders];

  this.completedOrders = filtered;
  this.completedTotalPages = Math.max(1, Math.ceil(filtered.length / this.completedPageSize));
  this.changeCompletedPage(1);

  console.log('Filtered:', filtered.length, 'Pages:', this.completedTotalPages); // debug
}

clearCompletedDate() {
  this.completedSelectedDate = '';
  this.applyCompletedFilter();
}

changeCompletedPage(page: number) {
  if (page < 1 || page > this.completedTotalPages) return;
  this.completedCurrentPage = page;
  const start = (page - 1) * this.completedPageSize;
  this.paginatedCompletedOrders = this.completedOrders.slice(start, start + this.completedPageSize);
  this.updateCompletedPages();
}

updateCompletedPages() {
  let start = Math.max(1, this.completedCurrentPage - 1);
  let end = Math.min(this.completedTotalPages, start + 2);
  if (end - start < 2) start = Math.max(1, end - 2);

  this.visibleCompletedPages = [];
  for (let i = start; i <= end; i++) {
    this.visibleCompletedPages.push(i);
  }
}
openOrder(order:Order){
this.selectedOrder=order;
}

changeUpcomingPage(page:number){

if(page < 1 || page > this.upcomingTotalPages) return;

this.upcomingCurrentPage = page;

const start = (page-1) * this.upcomingPageSize;
const end = start + this.upcomingPageSize;

this.paginatedUpcomingOrders =
this.upcomingOrders.slice(start,end);

this.updateUpcomingPages();

}

updateUpcomingPages(){

let start = Math.max(1,this.upcomingCurrentPage-1);
let end = Math.min(start+2,this.upcomingTotalPages);

if(end-start < 2){
start = Math.max(1,end-2);
}

this.visibleUpcomingPages = [];

for(let i=start;i<=end;i++){
this.visibleUpcomingPages.push(i);
}

}

logout(){

Swal.fire({
  title: 'Logout?',
  text: 'Do you want to logout?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, Logout'
}).then(result => {

if(result.isConfirmed){
  localStorage.clear();
  this.router.navigate(['/login']);
}

});

}
loadProfile(){

this.http.get<any>(
`http://localhost:8080/api/profile/${this.userId}`
).subscribe(data=>{

const personal = JSON.parse(data.personalDetails || '{}');
const address = JSON.parse(data.addressDetails || '{}');
const education = JSON.parse(data.educationDetails || '[]');
const work = JSON.parse(data.workDetails || '[]');
const document = JSON.parse(data.documentDetails || '{}');

this.profile = {
  ...personal,
  ...address,
  educationDetails: education,
  workDetails: work,
  governmentId: document.governmentId || '',
  email: data.email,
  phone: data.phone,
  role: data.role

};
  console.log(data);
});


}
saveProfile(){

const payload = {

email:this.profile.email,
phone:this.profile.phone,

personalDetails: JSON.stringify({
firstName:this.profile.firstName,
lastName:this.profile.lastName,
dob:this.profile.dob,
gender:this.profile.gender
}),

addressDetails: JSON.stringify({
doorNo:this.profile.doorNo,
address:this.profile.address,
city:this.profile.city,
state:this.profile.state,
pincode:this.profile.pincode
}),

educationDetails: JSON.stringify(this.profile.educationDetails || []),

workDetails: JSON.stringify(this.profile.workDetails || []),

documentDetails: JSON.stringify({
governmentId:this.profile.governmentId
})

};

this.http.put(
`http://localhost:8080/api/profile/update/${this.userId}`,
payload
).subscribe({

next: () => {

this.isEditMode=false;

Swal.fire({
icon:'success',
title:'Profile Updated',
text:'Your profile has been updated successfully',
confirmButtonColor:'#3085d6'
});

this.loadProfile();

},

error: () => {

Swal.fire({
  icon: 'error',
  title: 'Update Failed',
  text: 'Something went wrong!',
  confirmButtonColor: '#d33'
});

}

});

}

addWork(){

if(!this.profile.workDetails){
this.profile.workDetails=[];
}

this.profile.workDetails.push({
company:'',
role:'',
experience:''
});

}
addEducation(){

if(!this.profile.educationDetails){
this.profile.educationDetails=[];
}

this.profile.educationDetails.push({
school:'',
degree:'',
year:''
});

}
removeWork(i:number){
this.profile.workDetails.splice(i,1);
}
removeEducation(index:number){

this.profile.educationDetails.splice(index,1);

}
}
