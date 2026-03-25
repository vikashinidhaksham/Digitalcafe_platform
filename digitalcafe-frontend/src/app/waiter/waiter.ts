import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
interface OrderItem{
  menuId:number;
  quantity:number;
  menuName:string;
}
interface Order{
  orderId:string;
  tableNo:number;
  chefStatus:string;
  bookingDate:string;
  bookingTime:string;
  items:any[];
}

@Component({
  selector:'app-waiter',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./waiter.html',
  styleUrls:['./waiter.css']
})
export class Waiter implements OnInit{

orders:Order[]=[];
cafeName: string = '';

view = 'orders';
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
reservations:any[] = [];
paginatedReservations:any[] = [];

todayReservations = 0;
upcomingReservations = 0;
completedReservations = 0;

reservationSearch = '';
reservationFilter = 'ALL';
reservationDate:any = '';

resCurrentPage = 1;
resPageSize = 12;
resTotalPages = 1;
visibleResPages:number[] = [];
constructor(
private http:HttpClient,
private router:Router
){}

ngOnInit(){

  console.log("Chef ID:", this.userId);
  console.log("Logged Chef ID:", this.userId);
this.loadCafeName();
this.loadOrders();
 this.loadReservations();
this.loadProfile();
/* auto refresh */

setInterval(()=>{
this.loadOrders();
},5000);

}
loadCafeName(){

this.http.get<any>(
`http://localhost:8080/api/cafe/${this.cafeId}`
).subscribe(res => {

this.cafeName = res.name;

});

}
loadOrders(){

this.http.get<Order[]>(
`http://localhost:8080/api/orders/waiter/${this.cafeId}`
)
.subscribe(data=>{

console.log("Waiter Orders:",data);

this.orders=data;

this.sortOrders();

});

}

sortOrders(){

this.orders.sort((a,b)=>{

const dateA=new Date(a.bookingDate+" "+a.bookingTime);
const dateB=new Date(b.bookingDate+" "+b.bookingTime);

return dateA.getTime()-dateB.getTime();

});

}

serve(order:any){

if(order.chefStatus === 'READY'){

this.http.put(
`http://localhost:8080/api/orders/waiter-status/${order.orderId}?status=SERVED`,
{}
).subscribe(()=>{

/* change status in UI */
order.chefStatus = 'SERVED';

/* remove after 1 minute */
setTimeout(()=>{

this.orders = this.orders.filter(o => o.orderId !== order.orderId);

},60000);

});

}

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
icon:'success',
title:'Profile Updated',
timer:2000,
showConfirmButton:false
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
loadReservations(){

this.http.get<any>(`http://localhost:8080/api/bookings/cafe/${this.cafeId}`)
.subscribe(res=>{

this.reservations = res;

const today = new Date().toISOString().split('T')[0];

this.todayReservations =
res.filter((r:any)=>r.bookingDate === today).length;

this.upcomingReservations =
res.filter((r:any)=>r.bookingDate > today).length;

this.completedReservations =
res.filter((r:any)=>r.bookingDate < today).length;

this.resTotalPages =
Math.ceil(this.reservations.length / this.resPageSize);

this.changeReservationPage(1);

});
}
changeReservationPage(page:number){

this.resCurrentPage = page;

const start = (page-1) * this.resPageSize;
const end = start + this.resPageSize;

this.paginatedReservations =
this.reservations.slice(start,end);

this.updateVisiblePages();
}
updateVisiblePages(){

let start = Math.max(1,this.resCurrentPage-1);
let end = Math.min(start+2,this.resTotalPages);

if(end-start < 2){
start = Math.max(1,end-2);
}

this.visibleResPages = [];

for(let i=start;i<=end;i++){
this.visibleResPages.push(i);
}

}
applyReservationFilters(){

let data = [...this.reservations];

const today = new Date().toISOString().split('T')[0];

/* SEARCH */

if(this.reservationSearch){

const search = this.reservationSearch.toLowerCase();

data = data.filter((r:any)=>

(r.tableName && r.tableName.toLowerCase().includes(search)) ||
(r.tableId && r.tableId.toString().includes(search))

);

}

/* TYPE FILTER */

if(this.reservationFilter === 'TODAY'){
data = data.filter((r:any)=> r.bookingDate === today);
}

if(this.reservationFilter === 'UPCOMING'){
data = data.filter((r:any)=> r.bookingDate > today);
}

if(this.reservationFilter === 'COMPLETED'){
data = data.filter((r:any)=> r.bookingDate < today);
}

/* DATE FILTER */

if(this.reservationDate){
data = data.filter((r:any)=> r.bookingDate === this.reservationDate);
}

this.reservations = data;

this.resTotalPages =
Math.ceil(this.reservations.length / this.resPageSize);

this.changeReservationPage(1);

}
getReservationColor(date:string){

const today = new Date().toISOString().split('T')[0];

if(date === today){
return 'statusToday';
}

if(date > today){
return 'statusUpcoming';
}

return 'statusCompleted';

}

getReservationText(date:string){

const today = new Date().toISOString().split('T')[0];

if(date === today){
return 'TODAY';
}

if(date > today){
return 'UPCOMING';
}

return 'COMPLETED';

}
logout(){
localStorage.clear();
this.router.navigate(['/login']);
}

}
