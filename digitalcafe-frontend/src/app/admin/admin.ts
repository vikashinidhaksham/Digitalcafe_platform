import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule,FormsModule ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
selectedUser: any = null;
  baseUrl='http://localhost:8080/admin';
//mode:string='dashboard';
   queries: any[] = [];

   showModal = false;
   selectedQuery: any = null;
   replyText = "";

totalRevenue: number = 0;
  // ---------- PENDING ----------
  pendingUsers:any[]=[];
  filteredUsers:any[]=[];

  customerCount=0;
  chefCount=0;
  pieChart:any;
  barChart:any;
  lineChart:any;
  // ===== DASHBOARD COUNTS =====
  totalCustomers:number = 0;
  totalCafes:number = 0;
  approvedWaiterCount:number = 0;
approvedCurrentPage:number = 1;
approvedPageSize:number = 8;
approvedTotalPages:number = 0;
approvedTotalPagesArray:number[] = [];
approvedPaginated:any[] = [];
pendingCurrentPage:number = 1;
pendingPageSize:number = 6;
pendingTotalPages:number = 0;
paginatedPending:any[] = [];
weeklyChart: any;
  // ---------- APPROVED ----------
  approvedUsers:any[]=[];
  approvedFiltered:any[]=[];
  approvedCustomerCount=0;
  approvedChefCount=0;
  approvedChart:any;
todayTime='';
todayDate='';

step = 1;
ownerData: any = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  phone: '',
  email: '',

  doorNo: '',
  address: '',
  city: '',
  state: '',
  pincode: '',


  educationList: [
    { college:'', degree:'', year:'' }
  ],

  workList: [
    { company:'', role:'', experience:'' }
  ],

  file: null
};
todayRevenue: number = 0;
messageCount: number = 0;
 constructor(
   private http: HttpClient,
   private router: Router
 ) {}
showOwnerModal = false;

addOwner(){
  this.showOwnerModal = true;
}

closeOwnerModal(){
  this.showOwnerModal = false;
}


nextStep(){
  if(this.step < 5) this.step++;
}

prevStep(){
  if(this.step > 1) this.step--;
}

submitOwner(){

  const payload = {
    role: "OWNER",
    email: this.ownerData.email,
    phone: this.ownerData.phone,
    password: this.ownerData.phone,

    personalDetails: {
      firstName: this.ownerData.firstName,
      lastName: this.ownerData.lastName,
      dob: this.ownerData.dob,
      gender: this.ownerData.gender,
      phone: this.ownerData.phone,
      gmail: this.ownerData.email
    },

    addressDetails: {
      doorNo: this.ownerData.doorNo,
      landmark: this.ownerData.address,
      city: this.ownerData.city,
      state: this.ownerData.state,
      pincode: this.ownerData.pincode
    },

    educationDetails: this.ownerData.educationList,
    workDetails: this.ownerData.workList,

    documentDetails: {
      fileName: this.ownerData.file?.name || ''
    },

    cafeDetails: null
  };

  // 🔥 SWEET ALERT CONFIRMATION
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to add this owner?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Add',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#f97316'
  }).then((result) => {

    if(result.isConfirmed){

      // 🔄 API CALL
      this.http.post("http://localhost:8080/auth/register", payload)
        .subscribe({
          next: () => {

            Swal.fire({
              title: 'Added!',
              text: 'Owner added successfully',
              icon: 'success',
              confirmButtonColor: '#f97316'
            });

            this.closeOwnerModal();
            this.loadDashboard();
          },
          error: () => {

            Swal.fire({
              title: 'Error!',
              text: 'Failed to add owner',
              icon: 'error',
              confirmButtonColor: '#d33'
            });

          }
        });

    }

  });
}
ngOnInit(){
  this.loadDashboard();
  setInterval(()=>{
    const d=new Date();
    this.todayTime=d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    this.todayDate=d.toDateString();
  },1000);
}
  // ================= PENDING =================

  loadPendingUsers(){

    this.mode='pending';

    this.http.get<any[]>(`${this.baseUrl}/pending`)
    .subscribe(data=>{

      this.pendingUsers=data;
      this.filteredUsers=data;
this.filteredUsers = data;
this.setupPendingPagination();
      this.customerCount =
        data.filter(u=>u.role?.toUpperCase()==='CUSTOMER').length;

      this.chefCount =
        data.filter(u=>u.role?.toUpperCase()==='CHEF').length;

      setTimeout(()=>this.drawPendingCharts(),200);
    });
  }
setupPendingPagination(){
  this.pendingTotalPages =
    Math.ceil(this.filteredUsers.length / this.pendingPageSize);

  this.pendingCurrentPage = 1;
  this.updatePendingPaginated();
}
unreadCount: number = 0;
loadQueries() {
  this.http.get<any[]>('http://localhost:8080/api/query/all')
    .subscribe(data => {
      this.queries = data;

      // 🔴 Count only pending (no reply)
      this.unreadCount = data.filter(q => !q.reply).length;
    });
}
openQueries() {
  this.mode = 'queries';
  this.loadQueries();
}
 openReplyModal(query: any) {
    this.selectedQuery = query;
    this.replyText = "";
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

updatePendingPaginated(){
  const start =
    (this.pendingCurrentPage - 1) * this.pendingPageSize;

  const end = start + this.pendingPageSize;

  this.paginatedPending =
    this.filteredUsers.slice(start, end);
}
onFileSelect(event: any){
  this.ownerData.file = event.target.files[0];
}
viewGovtId(fileName:string){
  if(fileName){
    window.open(`http://localhost:8080/uploads/${fileName}`, '_blank');
  }
}

searchApproved(e:any){
  const value = e.target.value.toLowerCase();

  this.approvedFiltered = this.approvedUsers.filter(u =>
    u.email.toLowerCase().includes(value) ||
    u.phone.toLowerCase().includes(value) ||
    u.role.toLowerCase().includes(value)
  );

  this.setupApprovedPagination();
}
closeDetails(){
  this.selectedUser = null;
}
addEducation(){
  this.ownerData.educationList.push({
    college:'', degree:'', year:''
  });
}

removeEducation(){
  this.ownerData.educationList.pop();
}

addWork(){
  this.ownerData.workList.push({
    company:'', role:'', experience:''
  });
}

removeWork(){
  this.ownerData.workList.pop();
}
mode:string = 'dashboard';
nextPending(){
  if(this.pendingCurrentPage < this.pendingTotalPages){
    this.pendingCurrentPage++;
    this.updatePendingPaginated();
  }
}


prevPending(){
  if(this.pendingCurrentPage > 1){
    this.pendingCurrentPage--;
    this.updatePendingPaginated();
  }
}
selectUser(u: any) {
  this.http.get(`http://localhost:8080/admin/user/${u.userId}`)
    .subscribe((res: any) => {

      // 🔥 PARSE JSON STRINGS
      res.personalDetails = res.personalDetails ? JSON.parse(res.personalDetails) : {};
      res.addressDetails = res.addressDetails ? JSON.parse(res.addressDetails) : {};
      res.educationDetails = res.educationDetails ? JSON.parse(res.educationDetails) : [];
      res.documentDetails = res.documentDetails ? JSON.parse(res.documentDetails) : {};

      console.log("PARSED USER:", res);

      this.selectedUser = res;
    });
}
drawPendingCharts() {
  if (this.pieChart) this.pieChart.destroy();
  if (this.barChart) this.barChart.destroy();

  const totalPending  = this.pendingUsers.length;
  const totalApproved = this.approvedUsers.length;

  /* ---------- PIE ---------- */
  this.pieChart = new Chart("pieChart", {
    type: 'pie',
    data: {
      labels: ['Pending', 'Approved'],
      datasets: [{
        data: [totalPending, totalApproved],
        backgroundColor: ['#f97316', '#22c55e'],
        borderColor: '#ffffff',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#4a5568',
            font: { weight: 'bold' }
          }
        }
      }
    }
  });

  /* ---------- BAR ---------- */
  this.barChart = new Chart("barChart", {
    type: 'bar',
    data: {
      labels: ['Pending', 'Approved'],
      datasets: [{
        label: 'Users',
        data: [totalPending, totalApproved],
  backgroundColor: [
    'rgba(249,115,22,0.85)',   // Pending  — vivid orange
    'rgba(253,186,116,0.85)',  // Approved — light orange
  ],
  hoverBackgroundColor: [
    '#ea6c0a',
    '#fb923c',
  ],
        borderRadius: 10,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#4a5568',
            font: { weight: 'bold' }
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { stepSize: 1 }   // ← whole numbers only
        }
      }
    }
  });
}
  filterRole(e:any){
    const r=e.target.value;
    if(r==='ALL') this.filteredUsers=this.pendingUsers;
    else this.filteredUsers=this.pendingUsers.filter(u=>u.role?.toUpperCase()===r);
  }

 approve(id: number) {
   this.http.post(`${this.baseUrl}/approve/${id}`, {}, { responseType: 'text' })
     .subscribe({
       next: () => {
         Swal.fire({
           title: 'Success!',
           text: 'User approved & mail sent successfully 📧',
           icon: 'success',
           confirmButtonColor: '#f97316'
         });
         this.loadPendingUsers();
       },
       error: () => {
         Swal.fire({
           title: 'Error!',
           text: 'Approval failed or mail not sent',
           icon: 'error',
           confirmButtonColor: '#d33'
         });
       }
     });
 }

 reject(id: number) {
   Swal.fire({
     title: 'Are you sure?',
     text: 'Do you want to reject this user?',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonText: 'Yes, Reject',
     cancelButtonText: 'Cancel',
     confirmButtonColor: '#d33'
   }).then((result) => {

     if (result.isConfirmed) {

       Swal.fire({
         title: 'Processing...',
         text: 'Rejecting user & sending mail...',
         allowOutsideClick: false,
         didOpen: () => {
           Swal.showLoading();
         }
       });

       this.http.delete(`${this.baseUrl}/reject/${id}`, { responseType: 'text' })
         .subscribe({
           next: () => {
             Swal.fire({
               title: 'Rejected!',
               text: 'User rejected & mail sent successfully 📧',
               icon: 'success',
               timer: 1500,
               showConfirmButton: false
             });
             this.loadPendingUsers();
           },
           error: () => {
             Swal.fire({
               title: 'Error!',
               text: 'Reject failed or mail not sent',
               icon: 'error',
               confirmButtonColor: '#d33'
             });
           }
         });
     }
   });
 }

 sendReply() {
   if (!this.selectedQuery) return;

   this.http.post(
     `http://localhost:8080/api/query/reply/${this.selectedQuery.id}`,
     { reply: this.replyText },
     { responseType: 'text' }
   ).subscribe({
     next: () => {
       Swal.fire({
         title: 'Sent!',
         text: 'Reply sent successfully 📧',
         icon: 'success',
         confirmButtonColor: '#f97316'
       });
       this.loadQueries();
       this.closeModal();
     },
     error: () => {
       Swal.fire({
         title: 'Error!',
         text: 'Failed to send reply ❌',
         icon: 'error',
         confirmButtonColor: '#d33'
       });
     }
   });
 }
  // ================= APPROVED =================
searchPending(e:any){
  const value = e.target.value.toLowerCase();

  this.filteredUsers = this.pendingUsers.filter(u =>
    u.email?.toLowerCase().includes(value) ||
    u.phone?.toLowerCase().includes(value) ||
    u.role?.toLowerCase().includes(value)
  );

  this.setupPendingPagination();
}

  openApproved(){

    this.mode='approved';

    this.http.get<any[]>(`${this.baseUrl}/approved`)
    .subscribe(data=>{

      this.approvedUsers=data;
      this.approvedFiltered=data;

      this.approvedCustomerCount =
        data.filter(u=>u.role?.toUpperCase()==='CUSTOMER').length;

      this.approvedChefCount =
        data.filter(u=>u.role?.toUpperCase()==='CHEF').length;

      // ✅ ADD THIS
      this.approvedWaiterCount =
        data.filter(u=>u.role?.toUpperCase()==='WAITER').length;

      this.setupApprovedPagination();
     setTimeout(()=>this.drawApprovedChart({
       CUSTOMER: this.approvedCustomerCount,
       CHEF: this.approvedChefCount,
       WAITER: this.approvedWaiterCount
     }),200);
    });
  }
setupApprovedPagination(){
  this.approvedTotalPages =
    Math.ceil(this.approvedFiltered.length / this.approvedPageSize);

  this.approvedTotalPagesArray =
    Array.from({length:this.approvedTotalPages},(_,i)=>i+1);

  this.approvedCurrentPage = 1;
  this.updateApprovedPaginated();
}

updateApprovedPaginated(){
  const start =
    (this.approvedCurrentPage - 1) * this.approvedPageSize;

  const end = start + this.approvedPageSize;

  this.approvedPaginated =
    this.approvedFiltered.slice(start, end);
}

goToApprovedPage(page:number){
  this.approvedCurrentPage = page;
  this.updateApprovedPaginated();
}

nextApproved(){
  if(this.approvedCurrentPage < this.approvedTotalPages){
    this.approvedCurrentPage++;
    this.updateApprovedPaginated();
  }
}
getVisibleApprovedPages(): number[] {
  const pages: number[] = [];

  const start = Math.max(2, this.approvedCurrentPage - 1);
  const end = Math.min(this.approvedTotalPages - 1, this.approvedCurrentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

prevApproved(){

  if(this.approvedCurrentPage > 1){
    this.approvedCurrentPage--;
    this.updateApprovedPaginated();
  }
}
loadDashboard(){

  this.mode='dashboard';

  // 1️⃣ Approved Users
  this.http.get<any[]>(`${this.baseUrl}/approved`)
  .subscribe(a=>{

    this.approvedUsers = a;

    this.approvedCustomerCount =
      a.filter(u=>u.role?.toLowerCase().includes('customer')).length;

    this.approvedChefCount =
      a.filter(u=>u.role?.toLowerCase().includes('chef')).length;

    // ✅ TOTAL CUSTOMERS (Approved Only)
    this.totalCustomers = this.approvedCustomerCount;

    // 2️⃣ Pending Users
    this.http.get<any[]>(`${this.baseUrl}/pending`)
    .subscribe(p=>{

      this.pendingUsers = p;
this.http.get<number>('http://localhost:8080/api/dashboard/today-revenue')
  .subscribe(res => {
    this.todayRevenue = res;
  });
      // 3️⃣ TOTAL CAFES API CALL
 this.http.get<number>('http://localhost:8080/owner/count')
 .subscribe(count=>{
   this.totalCafes = count;
 });
this.http.get<number>('http://localhost:8080/api/dashboard/admin/revenue')
  .subscribe(res => {
    this.totalRevenue = res;
  });
this.http.get<any>('http://localhost:8080/api/dashboard/user-distribution')
  .subscribe(data => {
    setTimeout(() => this.drawApprovedChart(data), 200);
  });
this.http.get<any[]>('http://localhost:8080/api/dashboard/weekly-revenue')
  .subscribe(data => {
    this.drawWeeklyChart(data);
  });
        // wait for UI render
        setTimeout(()=>{
          this.drawPendingCharts();
        },300);

      });

    });


}

/* ---------- WEEKLY REVENUE LINE CHART — orange ---------- */
drawWeeklyChart(data: any[]) {

  if (this.weeklyChart) this.weeklyChart.destroy();

  const labels = data.map(d => d.date);
  const values = data.map(d => d.amount);

  this.weeklyChart = new Chart("weeklyChart", {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue ₹',
        data: values,
        fill: true,
        tension: 0.4,
        borderColor: '#f97316',
        borderWidth: 3,
        backgroundColor: 'rgba(249,115,22,0.10)',
        pointBackgroundColor: '#f97316',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#ea6c0a',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#4a5568',
            font: { weight: 'bold' }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { color: '#94a3b8' }
        }
      }
    }
  });
}

/* ---------- DOUGHNUT — Users Distribution — orange family ---------- */
drawApprovedChart(data: any) {

  if (this.approvedChart) this.approvedChart.destroy();

  const labels = Object.keys(data);    // ['CUSTOMER','CHEF','WAITER','OWNER']
  const values = Object.values(data);  // [10,20,5,3]

  this.approvedChart = new Chart("approvedChart", {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#f97316',   // CUSTOMER — vivid orange
          '#fdba74',   // CHEF     — soft orange
          '#fb923c',   // WAITER   — medium orange
          '#fed7aa',   // OWNER    — peach / lightest
        ],
        hoverBackgroundColor: [
          '#ea6c0a',
          '#f97316',
          '#ea6c0a',
          '#fb923c',
        ],
        borderColor: '#ffffff',
        borderWidth: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#4a5568',
            font: { weight: 'bold' },
            padding: 16,
          }
        }
      }
    }
  });
}

filterApproved(e: any) {

  const role = e.target.value;

  // ✅ ALL → show everything
  if (role === 'ALL') {
    this.approvedFiltered = [...this.approvedUsers];
  }

  // ✅ SPECIFIC ROLE
  else {
    this.approvedFiltered = this.approvedUsers.filter(u =>
      u.role?.toUpperCase() === role
    );
  }

  // 🔥 IMPORTANT → update pagination AFTER filtering
  this.setupApprovedPagination();
}

  logout(){
    localStorage.clear();
    window.location.href="/";
  }

}
