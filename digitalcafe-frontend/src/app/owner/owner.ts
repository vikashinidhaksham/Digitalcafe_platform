import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
//import { ViewChild, AfterViewInit } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
type PageType = 'welcome' | 'dashboard' | 'menu' | 'staff' | 'orders'|'tables'|'cafeManagement'  | 'reservations'| 'payments';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-owner',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule  ],
  templateUrl: './owner.html',
  styleUrls: ['./owner.css']
})
export class OwnerComponent implements OnInit{

  /* ================= BASIC ================= */

/* ================= NEW CAFE REGISTRATION ================= */
foodChart: any;
@ViewChild('revenueChart') revenueChartRef!: ElementRef;
@ViewChild('calendar') calendarComponent!: FullCalendarComponent;
currentMonth: string = '';
step: number = 1;
cafeImages: string[] = [];
currentImageIndex: number = 0;
currentCafeImage: string = '';
govtIdFile!: File;
allOrders: any[] = [];
cafePhotos: File[] = [];
previewImages: string[] = [];
  page: PageType = 'welcome';
  base = "http://localhost:8080/owner";
  ownerName = "";
  cafeName: any = "";
  userId!: number;   // ✅ ADD THIS
  cafeId!: number;
  /* ================= DASHBOARD ================= */
tablesForSelectedDate: any[] = [];
  waiterCount = 0;
  chefCount = 0;
  chefSpecial: any = null;
  totalRevenue:number = 0;
  todayRevenue:number = 0;
  revenueChart:any;
visibleTablePages: number[] = [];
todayReservations = 0;
upcomingReservations = 0;
completedReservations = 0;
  /* ================= CAFE ================= */
showFilterMenu = false;
  cafes: any[] = [];
  selectedCafe: any = null;
  newCafe: any = {};
  showAdd = false;
  // ADD this line with your other class properties at the top
  foodChartLabels: { label: string, color: string, count: number }[] = [];
// ================= TABLE VARIABLES =================
newTable: any = {
  id: null,
  name: '',
  size: '',
  status: 'AVAILABLE'
};

paginatedPayments:any[] = [];

paymentDateFilter:any = '';

paymentCurrentPage = 1;
paymentPageSize = 12;
paymentTotalPages = 1;
visiblePaymentPages:number[] = [];
paginatedOrders:any[] = [];

orderCurrentPage = 1;
orderPageSize = 12;
orderTotalPages = 1;
visibleOrderPages:number[] = [];

pendingOrders = 0;
preparingOrders = 0;
completedOrders = 0;
selectedTime: string = '';
availabilityStatus: boolean | null = null;
reservations:any[]=[];
orders:any[]=[];
payments:any[]=[];
timeSlots: string[] = [
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM","05:30 PM",
  "06:00 PM","06:30 PM","07:00 PM","07:30 PM",
  "08:00 PM","08:30 PM","09:00 PM"
];
tables: any[] = [];
filteredTables: any[] = [];
paginatedTables: any[] = [];

tableSearchText: string = '';
filterTableStatus: string = 'ALL';

// Pagination
tableCurrentPage: number = 1;
tablePageSize: number = 5;
tableTotalPages: number = 1;
tableVisiblePages: number[] = [];

// Calendar
selectedDate: string = '';
bookedTables: any[] = [];


  /* ================= MENU ================= */

  menuList: any[] = [];
  paginatedMenu: any[] = [];
  visiblePages: number[] = [];
  editingMenuId: number | null = null;

  searchText: string = '';
  filterCategory: string = 'ALL';
  filterStatus: string = 'ALL';

  menuCurrentPage: number = 1;
  menuItemsPerPage: number = 8;
  menuTotalPages: number = 1;
selectedFiles: File[] = [];
  showMenuAdd = false;
  showImagePopup = false;

  selectedImages: string[] = [];
  uploadedImages: string[] = [];
calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',

  headerToolbar: false,   // 🔥 remove default header

  dateClick: (info) => {
    this.selectedDate = info.dateStr;
    this.updateTableStatusForDate(info.dateStr);
  }
};
  newMenu: any = {
    name: '',
    category: 'Beverages',
    price: '',
    description: '',
    images: [],
    status: 'ACTIVE'
  };

  /* ================= STAFF ================= */

  staffTab = 'register';
  subTab = 'personal';
  staffList: any[] = [];
  filterRole = 'ALL';
  staffSearchText = '';

  staffFiltered: any[] = [];
  staffPaginated: any[] = [];
reservationSearch = '';
reservationFilter = 'ALL';
reservationDate:any = '';

filteredReservations:any[] = [];
  staffCurrentPage = 1;
  staffItemsPerPage = 5;
  staffTotalPages = 1;

  selectedStaff: any = null;
  showModal = false;
  editMode = false;
  previewPhoto: any = null;

  staff: any = {
    email: '',
    phone: '',
    password: '',
    role: 'WAITER',
    personal_details: {
      firstName: '',
      lastName: '',
      dob: '',
      gender: 'Male',
      photo: ''
    },
    address_details: {
      door: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    education_details: [{}],
    work_details: [{}],
    document_details: []
  };
cafe: any = {
  name: '',
  tagline: '',
  description: '',
  openTime: '',
  closeTime: '',
  phone: '',
  email: '',
  streetNo: '',
  streetName: '',
  landmark: '',
  state: '',
  country: '',
  pincode: '',
  fssai: '',
  gst: '',
  tradeLicense: '',
  accountName: '',
  bankName: '',
  accountNumber: '',
  ifsc: '',
  status: 'ACTIVE'
};
  constructor(private http: HttpClient, private router: Router) {}

  /* ================= INIT ================= */

ngOnInit() {

  const storedUserId = localStorage.getItem("userId");

  if (!storedUserId) {
    this.router.navigate(['/login']);
    return;
  }

  this.userId = Number(storedUserId);
  this.ownerName = localStorage.getItem("name") || "Owner";

  // ⭐ ADD THIS
  const today = new Date();
  this.selectedDate = today.toISOString().split('T')[0];

  console.log("Owner ID:", this.userId);

  this.page = 'welcome';
  this.loadOwnerCafes();
   this.loadCafes();
}
ngAfterViewInit() {

  if (!this.calendarComponent) {
    return;
  }

  const api = this.calendarComponent.getApi();
  this.updateMonthTitle(api);

  api.on('datesSet', () => {
    this.updateMonthTitle(api);
  });
}

get calendarApi() {
  return this.calendarComponent.getApi();
}

updateMonthTitle(api: any) {
  const date = api.getDate();
  this.currentMonth = date.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });
}
  /* ================= AUTH ================= */

  goLogin() { this.router.navigate(['/login']); }

logout() {

  localStorage.clear();        // clear login data

  this.page = 'welcome';       // go back to welcome page

  this.selectedCafe = null;
  this.cafeId = undefined as any;
  this.cafeName = '';

}


selectCafe() {
if (!this.selectedCafe) {
  Swal.fire({
    icon: 'warning',
    title: 'Select Cafe',
    text: 'Please choose a cafe first'
  });
  return;
}

  this.cafeName = this.selectedCafe.name;
  this.cafeId = this.selectedCafe.id;

  localStorage.setItem("cafeId", this.cafeId.toString());

  this.setPage('dashboard');

  this.loadMenu();
  this.loadStaff();
  this.loadTable();
    // ✅ ADD THESE
    this.loadPayments();
    this.loadOrders();
    this.loadReservations();
}
selectCafeCard(c: any) {

  this.selectedCafe = c;

  this.cafeId = c.id;

  // 🔥 VERY IMPORTANT
  localStorage.setItem("cafeId", c.id);

  this.cafeName = c.name;

  console.log("Selected Cafe ID:", this.cafeId);


  // 🔥 CHANGE HERE
  this.setPage('dashboard');

  this.loadMenu();
  this.loadStaff();
  this.loadTable();
    // ✅ ADD THESE
    this.loadPayments();
    this.loadOrders();
    this.loadReservations();
}
loadOwnerCafes() {

   this.http.get<any[]>(
     `${this.base}/cafes/${this.userId}`
   ).subscribe({
    next: (data) => {

      this.cafes = data || [];

      // ✅ If cafes exist → stay in welcome page and show them
      // (Your HTML should loop through cafes)

      // ❌ If no cafes → still show welcome but only Add Cafe

      if (this.cafes.length > 0) {
        console.log("Cafes loaded:", this.cafes);
      }

    },
    error: (err) => {
      console.error("Error loading cafes:", err);
    }
  });

}
openAddCafe() {

  this.step = 1;

  this.newCafe = {
    id: null,
    photos: []
  };

  this.selectedCafe = null;

  this.previewImages = [];
  this.cafePhotos = [];

  this.showAdd = true;
}
  closeAddCafe() {
    this.showAdd = false;
    document.body.style.overflow = 'auto';
  }

  upload(event: any, type: string) {
    const file = event.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    this.http.post("http://localhost:8080/upload", fd, { responseType: 'text' })
      .subscribe((fileName: any) => {
        if (type === 'photo') this.newCafe.photo = fileName;
        if (type === 'proof') this.newCafe.proof = fileName;
      });
  }
toggleFilterMenu() {
  this.showFilterMenu = !this.showFilterMenu;
}

setRoleFilter(role: string) {
  this.filterRole = role;
  this.showFilterMenu = false;
  this.applyStaffFilters();
}
updateVisibleTablePages() {

  const total = this.tableTotalPages;
  const current = this.tableCurrentPage;

  let start = Math.max(current - 1, 1);
  let end = start + 2;

  if (end > total) {
    end = total;
    start = Math.max(end - 2, 1);
  }

  this.visibleTablePages = [];

  for (let i = start; i <= end; i++) {
    this.visibleTablePages.push(i);
  }
}
editTable(table: any) {
  this.newTable = { ...table };
  Swal.fire({
    icon: 'info',
    title: 'Edit Mode',
    text: 'Edit mode (UI only)'
  });
}

deleteTableUI(table: any) {
  Swal.fire({
    title: 'Delete Table?',
    text: `Delete "${table.name}"? This cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33'
  }).then(result => {
    if (!result.isConfirmed) return;

    this.http.delete(`http://localhost:8080/api/tables/${table.id}`)
      .subscribe({
        next: () => {
          this.tables = this.tables.filter(t => t.id !== table.id);
          this.applyTableFilters();
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            timer: 1200,
            showConfirmButton: false
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Cannot Delete',
            text: 'Table may have active bookings.'
          });
        }
      });
  });
}
submitCafe() {

  const ownerId = localStorage.getItem('userId');
  const formData = new FormData();

  formData.append('name', this.newCafe.name || '');
  formData.append('tagline', this.newCafe.tagline || '');
  formData.append('description', this.newCafe.description || '');
  formData.append('openTime', this.newCafe.openTime || '');
  formData.append('closeTime', this.newCafe.closeTime || '');
  formData.append('phone', this.newCafe.phone || '');
  formData.append('email', this.newCafe.email || '');

  formData.append('streetNo', this.newCafe.streetNo || '');
  formData.append('streetName', this.newCafe.streetName || '');
  formData.append('landmark', this.newCafe.landmark || '');
  formData.append('state', this.newCafe.state || '');
  formData.append('country', this.newCafe.country || '');
  formData.append('pincode', this.newCafe.pincode || '');

  formData.append('fssai', this.newCafe.fssai || '');
  formData.append('gst', this.newCafe.gst || '');
  formData.append('tradeLicense', this.newCafe.tradeLicense || '');

  formData.append('accountName', this.newCafe.accountName || '');
  formData.append('bankName', this.newCafe.bankName || '');
  formData.append('accountNumber', this.newCafe.accountNumber || '');
  formData.append('ifsc', this.newCafe.ifsc || '');

  formData.append('status', 'ACTIVE');

  if (this.newCafe.proof) {
    formData.append('proof', this.newCafe.proof);
  }

  // 🔥 FILES
  if (this.cafePhotos && this.cafePhotos.length > 0) {
    this.cafePhotos.forEach((file: File) => {
      formData.append('files', file);
    });
  }

if (this.selectedCafe && this.selectedCafe.id) {

  console.log("Updating Cafe ID:", this.selectedCafe.id); // 🔥 debug

  this.http.put(
    `http://localhost:8080/owner/cafes/${this.selectedCafe.id}`,
    formData
  )
      .subscribe({
        next: () => {
          alert("Cafe Updated Successfully");
          this.afterSaveCafe();
        },
        error: (err) => {
          console.error(err);
          alert("Update Failed");
        }
      });

  } else {

    // 🔥 CREATE
this.http.post(`http://localhost:8080/owner/cafes/${ownerId}`, formData)
  .subscribe({
    next: () => {

      Swal.fire({
        icon: 'success',
        title: 'Cafe Added!',
        text: 'Your cafe has been added successfully 🎉',
        timer: 1500,
        showConfirmButton: false
      });

      this.afterSaveCafe();
    },
    error: (err) => {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Cafe creation failed ❌'
      });
    }
  });
  }

}
afterSaveCafe() {
  this.showAdd = false;
  this.step = 1;
  this.newCafe = {};
  this.previewImages = [];
  this.cafePhotos = [];

  this.loadCafes();

  this.page = 'welcome';
}
onDateChange() {
  this.availabilityStatus = null;
}

checkAvailability() {

 if (!this.selectedDate) {
   Swal.fire({
     icon: 'warning',
     title: 'Select Date',
     text: 'Please select a date'
   });
   return;
 }

  const formattedDate = new Date(this.selectedDate)
    .toISOString()
    .split('T')[0];

  this.http.get<any[]>(
    `http://localhost:8080/api/bookings/details/${this.cafeId}/${formattedDate}`
  ).subscribe(res => {

    console.log("Bookings:", res);

    this.tables = this.tables.map(t => {

      const booking = res.find(b =>
        b.tableId === t.id &&
        b.bookingTime === this.selectedTime
      );

      if (booking) {
        return {
          ...t,
          status: 'UNAVAILABLE',
          bookingId: booking.bookingId,
          bookingTime: booking.bookingTime,
          customerLastName: booking.lastName
        };
      }

      return {
        ...t,
        status: 'AVAILABLE',
        bookingId: null,
        bookingTime: null,
        customerLastName: null
      };

    });

    this.applyTableFilters();

  });

}
onCafePhotosUpload(event: any) {

  const files = event.target.files;
  if (!files) return;

  this.cafePhotos = [];      // actual files
  this.previewImages = [];   // preview images

  for (let i = 0; i < files.length; i++) {

    const file = files[i];
    this.cafePhotos.push(file);

    // preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImages.push(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}
editStaff(s: any) {

  this.staff = {
    ...s,
    personal_details: s.personal_details || {},
    address_details: s.address_details || {},
    education_details: s.education_details || [{}],
    work_details: s.work_details || [{}],
    document_details: s.document_details || []
  };

  this.previewPhoto = s.photo
    ? 'http://localhost:8080/uploads/' + s.photo
    : null;

  this.editMode = true;
  this.showModal = true;
}

afterCafeSave() {
  this.showAdd = false;
  this.newCafe = {};
  this.loadOwnerCafes();
}
  /* ================= MENU ================= */

  loadMenu() {

    if (!this.cafeId) return;

    this.http.get(`${this.base}/menu/${this.cafeId}`)
      .subscribe((res: any) => {

        this.menuList = res || [];

        // ⭐ GET LATEST CHEF SPECIAL
        const chefSpecialItems = this.menuList
          .filter((m:any)=> m.category === 'Chef Special');

        if(chefSpecialItems.length){
          this.chefSpecial = chefSpecialItems[chefSpecialItems.length - 1];
        }

        this.menuCurrentPage = 1;
        this.applyMenuFilters();

        setTimeout(()=>{
          this.loadFoodCategoryChart();
        });

      });
  }
  applyMenuFilters() {

    let filtered = [...this.menuList];

    if (this.searchText)
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(this.searchText.toLowerCase()));

    if (this.filterCategory !== 'ALL')
      filtered = filtered.filter(m => m.category === this.filterCategory);

    if (this.filterStatus !== 'ALL')
      filtered = filtered.filter(m => m.status === this.filterStatus);

    this.menuTotalPages = Math.ceil(filtered.length / this.menuItemsPerPage) || 1;

    const start = (this.menuCurrentPage - 1) * this.menuItemsPerPage;
    const end = start + this.menuItemsPerPage;

    this.paginatedMenu = filtered.slice(start, end);
  }

  changeMenuPage(page: number) {
    if (page < 1 || page > this.menuTotalPages) return;
    this.menuCurrentPage = page;
    this.applyMenuFilters();
  }

  toggleStatus(item: any) {
    item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.http.put(`${this.base}/menu/status`, item).subscribe();
  }

  openAddMenu() {
    this.resetMenuForm();
    this.editingMenuId = null;
    this.showMenuAdd = true;
  }

  editMenu(item: any) {
    this.newMenu = { ...item };
    this.uploadedImages = item.images || [];
    this.editingMenuId = item.id;
    this.showMenuAdd = true;
  }

saveMenu() {

  console.log("Before saving, uploadedImages:", this.uploadedImages);
if (!this.newMenu.images || this.newMenu.images.length === 0) {
  Swal.fire({
    icon: 'warning',
    title: 'Upload Required',
    text: 'Please upload at least one image'
  });
  return;
}
  // 🔥 Always assign fresh copy
  this.newMenu.images = [...this.uploadedImages];

  console.log("Saving menu with images:", this.newMenu.images);

  if (!this.newMenu.images || this.newMenu.images.length === 0) {
    alert("Upload image first!");
    return;
  }

  if (this.editingMenuId) {
    this.http.put(`${this.base}/menu/${this.editingMenuId}`, this.newMenu)
      .subscribe(() => {
        this.afterSave();
      });
  } else {
    this.http.post(`${this.base}/menu/${this.cafeId}`, this.newMenu)
      .subscribe(() => {
        this.afterSave();
      });
  }
}
afterSave() {
  this.showMenuAdd = false;
  this.loadMenu();

  // 🔥 Only clear AFTER successful save
  this.resetMenuForm();
}
deleteMenu(id: number) {

Swal.fire({
  title: 'Delete Menu Item?',
  text: 'This action cannot be undone!',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, Delete',
  cancelButtonText: 'Cancel',
  confirmButtonColor: '#d33'
}).then(result => {

if(result.isConfirmed){

this.http.delete(`${this.base}/menu/${id}`)
.subscribe({

next: () => {

this.loadMenu();

Swal.fire({
  icon: 'success',
  title: 'Deleted!',
  text: 'Menu item has been deleted',
  timer: 1200,
  showConfirmButton: false
});

},

error: () => {

Swal.fire({
  icon: 'error',
  title: 'Delete Failed',
  text: 'Something went wrong!'
});

}

});

}

});

}

  closeMenuPopup() {
    this.showMenuAdd = false;
    this.resetMenuForm();
  }

  resetMenuForm() {
    this.newMenu = {
      name: '',
      category: 'Beverages',
      price: '',
      description: '',
      images: [],
      status: 'ACTIVE'
    };
    this.uploadedImages = [];
  }
uploadMenuImages(event: any) {
  const files = event.target.files;
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const fd = new FormData();
    fd.append("file", files[i]);

    this.http.post("http://localhost:8080/upload", fd, { responseType: 'text' })
      .subscribe({
        next: (name: any) => {
          console.log("Uploaded:", name);

          this.uploadedImages.push(name);

          // 🔥 Immediately bind to newMenu
          this.newMenu.images = [...this.uploadedImages];
        },
        error: err => {
          console.error("Upload failed:", err);
        }
      });
  }
}

  openImagePopup(item: any) {
    if (item.images?.length) {
      this.selectedImages = item.images;
      this.showImagePopup = true;
    } else {
     Swal.fire({
       icon: 'info',
       title: 'No Images',
       text: 'No images available'
     });
    }
  }

  closeImagePopup() {
    this.showImagePopup = false;
  }

  /* ================= STAFF ================= */

saveStaff() {
  this.cafeId = Number(localStorage.getItem("cafeId"));

  const payload = {
    ...this.staff,
    cafeId: this.cafeId,                                          // ✅ add cafeId
    personalDetails: JSON.stringify(this.staff.personal_details),
    addressDetails: JSON.stringify(this.staff.address_details),
    educationDetails: JSON.stringify(this.staff.education_details),
    workDetails: JSON.stringify(this.staff.work_details),
    documentDetails: JSON.stringify(this.staff.document_details)
  };

  delete payload.personal_details;
  delete payload.address_details;
  delete payload.education_details;
  delete payload.work_details;
  delete payload.document_details;

  console.log("Saving staff payload:", payload); // ✅ check in browser console

  if (this.editMode) {
    // UPDATE
    this.http.put(`${this.base}/staff/${this.staff.userId}`, payload)
      .subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Staff Updated', timer: 1500, showConfirmButton: false });
          this.resetStaffForm();
          this.showModal = false;
          this.loadStaff();
        },
        error: err => {
          console.error("Update failed:", err);
          Swal.fire({ icon: 'error', title: 'Update Failed', text: err.error?.message || 'Something went wrong' });
        }
      });
  } else {
    // ✅ REGISTER — use /staff/register/{cafeId}
  this.http.post(`${this.base}/staff/cafe/${this.cafeId}`, payload)
      .subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Staff Added!', timer: 1500, showConfirmButton: false });
          this.resetStaffForm();
          this.showModal = false;
          this.loadStaff();
        },
        error: err => {
          console.error("Register failed:", err);
          Swal.fire({ icon: 'error', title: 'Failed to Add Staff', text: err.error?.message || 'Check console for details' });
        }
      });
  }
}
resetStaffForm() {
  this.staff = {
    email: '',
    phone: '',
    password: '',
    role: 'WAITER',
    personal_details: {
      firstName: '',
      lastName: '',
      dob: '',
      gender: 'Male'
    },
    address_details: {},
    education_details: [{}],
    work_details: [{}],
    document_details: []
  };

  this.previewPhoto = null;
  this.editMode = false;
}

 applyStaffFilters() {

   const search = (this.staffSearchText || '').toLowerCase();

   this.staffFiltered = this.staffList.filter(s => {

     const firstName = s.personal_details?.firstName || '';
     const email = s.email || '';

     const searchMatch =
       firstName.toLowerCase().includes(search) ||
       email.toLowerCase().includes(search);

     const roleMatch =
       this.filterRole === 'ALL' || s.role === this.filterRole;

     return searchMatch && roleMatch;
   });

   this.staffTotalPages =
     Math.ceil(this.staffFiltered.length / this.staffItemsPerPage) || 1;

   if (this.staffCurrentPage > this.staffTotalPages) {
     this.staffCurrentPage = 1;
   }

   const start =
     (this.staffCurrentPage - 1) * this.staffItemsPerPage;

   this.staffPaginated =
     this.staffFiltered.slice(start, start + this.staffItemsPerPage);
 }


addEducation() {
  this.staff.education_details.push({
    school: '',
    degree: '',
    year: ''
  });
}

removeEducation(index: number) {
  this.staff.education_details.splice(index, 1);
}

addWork() {
  this.staff.work_details.push({
    company: '',
    role: '',
    exp: ''
  });
}
paginatedReservations:any[] = [];

resCurrentPage = 1;
resPageSize = 12;
resTotalPages = 1;
visibleResPages:number[] = [];
removeWork(index: number) {
  this.staff.work_details.splice(index, 1);
}

openModal() {
  this.editMode = false;

  this.staff = {
    email: '',
    phone: '',
    password: '',
    role: 'WAITER',
    personal_details: {
      firstName: '',
      lastName: '',
      dob: '',
      gender: 'Male',
      photo: ''
    },
    address_details: {
      door: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    education_details: [{}],
    work_details: [{}],
    document_details: []
  };

  this.previewPhoto = null;
  this.subTab = 'personal';
  this.showModal = true;
}

/*editStaff(s: any) {
  this.staff = JSON.parse(JSON.stringify(s));
  this.previewPhoto = this.staff.personal_details?.photo;
  this.editMode = true;
  this.subTab = 'personal';   // VERY IMPORTANT
  this.showModal = true;
}*/
  closeModal() { this.showModal = false; }


deleteStaff(id: any) {

Swal.fire({
  title: 'Delete Staff?',
  text: 'This action cannot be undone!',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, Delete',
  cancelButtonText: 'Cancel',
  confirmButtonColor: '#d33'
}).then(result => {

if(result.isConfirmed){

this.http.delete(`${this.base}/staff/${id}`)
.subscribe({

next: () => {

this.loadStaff();

Swal.fire({
  icon: 'success',
  title: 'Deleted!',
  text: 'Staff removed successfully',
  timer: 1200,
  showConfirmButton: false
});

},

error: () => {

Swal.fire({
  icon: 'error',
  title: 'Delete Failed',
  text: 'Something went wrong!'
});

}

});

}

});

}
closeDetail() {
  this.selectedStaff = null;
}
onProofUpload(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("file", file);

  this.http.post("http://localhost:8080/upload", fd, { responseType: 'text' })
    .subscribe({
      next: (fileName: any) => {
        this.staff.document_details = [fileName.trim()];
        Swal.fire({
          icon: 'success',
          title: 'Document Uploaded',
          timer: 1000,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Upload Failed' });
      }
    });
}
onPhotoSelect(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    this.previewPhoto = reader.result;
    this.staff.personal_details.photo = reader.result;
  };

  reader.readAsDataURL(file);
}
viewProof() {
  if (this.selectedStaff?.document_details?.length) {
    const proof = this.selectedStaff.document_details[0];
    // Add backend URL if not already a full URL
    const url = proof.startsWith('http')
      ? proof
      : 'http://localhost:8080/uploads/' + proof;
    window.open(url, '_blank');
  } else {
    Swal.fire({
      icon: 'info',
      title: 'No Document',
      text: 'No proof uploaded for this staff member.'
    });
  }
}
applyFilter() {
  this.applyStaffFilters();
}
openDetail(s: any) {
  this.selectedStaff = s;
}
addTable() {

if (!this.newTable.name?.trim() || !this.newTable.size) {
  Swal.fire({
    icon: 'warning',
    title: 'Missing Fields',
    text: 'Please fill all fields'
  });
  return;
}

const payload = {
  cafeId: this.cafeId,
  tableName: this.newTable.name,
  seats: Number(this.newTable.size),
  status: 'AVAILABLE'
};

this.http.post<any>(
  'http://localhost:8080/api/tables',
  payload
).subscribe({
  next: () => {

    this.loadTable();

    Swal.fire({
      icon: 'success',
      title: 'Table Added',
      timer: 1200,
      showConfirmButton: false
    });

    this.newTable = {
      name: '',
      size: '',
      status: 'AVAILABLE'
    };

  },
  error: () => {

    Swal.fire({
      icon: 'error',
      title: 'Failed',
      text: 'Error saving table'
    });

  }
});

}
onGovtIdUpload(event: any) {

  const file = event.target.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("file", file);

  this.http.post("http://localhost:8080/upload", fd, { responseType: 'text' })
    .subscribe({
      next: (fileName: any) => {

        this.newCafe.proof = fileName;

        alert("Govt ID uploaded successfully");
      },
      error: err => {
        console.error(err);
        alert("Upload failed");
      }
    });
}

loadTable() {

  if (!this.cafeId) return;

  this.http.get<any[]>(
    `http://localhost:8080/api/tables/${this.cafeId}`
  ).subscribe(res => {

    console.log("Tables from API:", res);

this.tables = res.map(t => ({
  id: t.id,
  name: t.tableName,
  number: t.id,   // id acts as table number
  size: t.seats,
  status: t.status
}));

    this.applyTableFilters();

  });
}
applyTableFilters() {

  this.filteredTables = this.tables.filter(t => {

    const tableName = (t.name || '').toLowerCase();
    const searchText = (this.tableSearchText || '').toLowerCase();

    const matchesSearch =
      tableName.includes(searchText);

const matchesStatus =
  this.filterTableStatus === 'ALL' ||
  (this.filterTableStatus === 'UNAVAILABLE' && t.status === 'UNAVAILABLE') ||
  (this.filterTableStatus === 'Available' && t.status === 'AVAILABLE');
this.updateVisibleTablePages();
    return matchesSearch && matchesStatus;
  });

  this.tableCurrentPage = 1;
  this.setupPagination();
}
setupPagination() {

  this.tableTotalPages =
    Math.ceil(this.filteredTables.length / this.tablePageSize) || 1;

  this.updatePaginatedTables();
this.updateVisibleTablePages();
  this.tableVisiblePages = [];
  for (let i = 1; i <= this.tableTotalPages; i++) {
    this.tableVisiblePages.push(i);
  }
}

updatePaginatedTables() {

  const start =
    (this.tableCurrentPage - 1) * this.tablePageSize;

  const end =
    start + this.tablePageSize;

  this.paginatedTables =
    this.filteredTables.slice(start, end);
}
changeTablePage(page: number) {

  if (page < 1 || page > this.tableTotalPages) return;

  this.tableCurrentPage = page;
  this.updatePaginatedTables();
  this.updateVisibleTablePages();
}
loadBookedTables() {

  if (!this.selectedDate) return;

  // Example: randomly mark some tables as booked
  this.bookedTables = [];

  this.tables.forEach(t => {

    if (Math.random() > 0.6) {
      t.status = 'BOOKED';
      this.bookedTables.push(t);
    } else {
      t.status = 'AVAILABLE';
    }

  });

  this.applyTableFilters();
}
updateTableStatusForDate(date: string) {

  this.http.get<number[]>(
    `http://localhost:8080/api/bookings/${this.cafeId}/${date}`
  ).subscribe(bookedIds => {

    this.tables = this.tables.map(table => ({
      ...table,
      status: bookedIds.includes(table.id)
        ? 'BOOKED'
        : 'AVAILABLE'
    }));

    this.applyTableFilters();
  });
}
loadBookingDetails() {

  if (!this.selectedDate) return;

  this.http.get<any[]>(
    `http://localhost:8080/api/bookings/details/${this.cafeId}/${this.selectedDate}`
  ).subscribe(res => {

    this.tables = this.tables.map(t => {

      const booking = res.find(b => b.tableId === t.id);

      if (booking) {
        return {
          ...t,
          status: 'UNAVAILABLE',
          bookingId: booking.bookingId,
          bookingTime: booking.bookingTime,
          customerLastName: booking.lastName
        };
      }

      return {
        ...t,
        status: 'AVAILABLE',
        bookingId: null,
        bookingTime: null,
        customerLastName: null
      };

    });

    this.applyTableFilters();

  });

}
loadCafes() {
  const ownerId = localStorage.getItem('userId');

  this.http.get<any[]>(`http://localhost:8080/owner/cafes/${ownerId}`)
    .subscribe(res => {

      res.forEach(c => {

        // 🔥 FIX ID mapping
        c.id = c.id || c.cafeId;

        // 🔥 parse photos
        try {
          c.photos = JSON.parse(c.photos || "[]");
        } catch {
          c.photos = [];
        }

      });

      console.log("CAFES:", res); // 🔥 DEBUG

      this.cafes = res;
    });
}
loadCafeDetails() {

  if (!this.cafeId) return;

  this.http.get<any>(
    `http://localhost:8080/api/cafe/${this.cafeId}`
  ).subscribe(res => {

    this.selectedCafe = res;

    this.cafeImages = res.photos
      ? JSON.parse(res.photos)
      : [];

    if (this.cafeImages.length) {
      this.currentImageIndex = 0;
      this.currentCafeImage =
        'http://localhost:8080/uploads/' +
        this.cafeImages[0];
    }

    this.startAutoSlide();
  });
}
nextImage() {
  if (!this.cafeImages.length) return;

  this.currentImageIndex =
    (this.currentImageIndex + 1) % this.cafeImages.length;

  this.updateImage();
}

prevImage() {
  if (!this.cafeImages.length) return;

  this.currentImageIndex =
    (this.currentImageIndex - 1 + this.cafeImages.length)
    % this.cafeImages.length;

  this.updateImage();
}

updateImage() {
  this.currentCafeImage =
    'http://localhost:8080/uploads/' +
    this.cafeImages[this.currentImageIndex];
}

carouselInterval: any;

startAutoSlide() {

  if (this.carouselInterval)
    clearInterval(this.carouselInterval);

  this.carouselInterval = setInterval(() => {

    if (!this.cafeImages.length) return;

    this.currentImageIndex =
      (this.currentImageIndex + 1)
      % this.cafeImages.length;

  }, 3000);
}
viewGovtId() {

  if (this.selectedCafe?.proof) {

    window.open(
      'http://localhost:8080/uploads/' + this.selectedCafe.proof,
      '_blank'
    );

  } else {

    alert("No Government ID uploaded");

  }
}
editCafe() {

  Swal.fire({
    icon: 'info',
    title: 'Edit Mode',
    text: 'You can now edit cafe details ✏️',
    timer: 1200,
    showConfirmButton: false
  });

  console.log("Editing cafe:", this.selectedCafe);

  this.newCafe = { ...this.selectedCafe };

  this.newCafe.id = this.selectedCafe.id;

  try {
    this.newCafe.photos = JSON.parse(this.selectedCafe.photos || "[]");
  } catch {
    this.newCafe.photos = [];
  }

  this.previewImages = this.newCafe.photos.map((p: string) =>
    'http://localhost:8080/uploads/' + p
  );

  this.step = 1;
  this.showAdd = true;
}
deleteCafe() {

if (!this.cafeId) return;

Swal.fire({
  title: 'Delete Cafe?',
  text: 'This action cannot be undone!',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, Delete',
  cancelButtonText: 'Cancel',
  confirmButtonColor: '#d33'
}).then(result => {

if(result.isConfirmed){

this.http.delete(`${this.base}/cafes/${this.cafeId}`)
.subscribe({

next: () => {

Swal.fire({
  icon: 'success',
  title: 'Cafe Deleted',
  text: 'Cafe has been deleted successfully',
  timer: 1500,
  showConfirmButton: false
});

this.selectedCafe = null;
this.cafeId = undefined as any;
this.page = 'welcome';

this.loadOwnerCafes();

},

error: () => {

Swal.fire({
  icon: 'error',
  title: 'Delete Failed',
  text: 'Something went wrong!'
});

}

});

}

});

}
getCafeImage(cafe: any): string {

  if (!cafe.photos) {
    return 'assets/cafe.png';
  }

  try {
    const photos = typeof cafe.photos === 'string'
      ? JSON.parse(cafe.photos)
      : cafe.photos;

    if (photos && photos.length > 0) {
      return 'http://localhost:8080/uploads/' + photos[0];
    }

  } catch (e) {
    console.error("Photo parse error", e);
  }

  return 'assets/cafe.png';
}
selectImage(index: number) {
  this.currentImageIndex = index;
  this.updateImage();
}
// 2. In loadFoodCategoryChart() — populate labels FIRST before new Chart()
loadFoodCategoryChart() {
  if (this.foodChart) this.foodChart.destroy();

  const categoryCount: any = {};
  this.menuList.forEach((item: any) => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  });

  const labels = Object.keys(categoryCount);
  const data: any[] = Object.values(categoryCount);
  const total = this.menuList.length;

  const colors = [
    '#6C63FF', '#22c55e', '#f97316',
    '#ef4444', '#3b82f6', '#eab308'
  ];

  // ✅ populate BEFORE chart renders
  this.foodChartLabels = labels.map((l, i) => ({
    label: l,
    color: colors[i % colors.length],
    count: data[i]
  }));

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart: any) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      ctx.restore();
      const cx = (chartArea.left + chartArea.right) / 2;
      const cy = (chartArea.top + chartArea.bottom) / 2;
      ctx.font = "bold 26px Poppins, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1e293b";
      ctx.fillText(total, cx, cy - 10);
      ctx.font = "12px Poppins, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Items", cx, cy + 14);
      ctx.save();
    }
  };

  this.foodChart = new Chart("foodChart", {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 8
      }]
    },
    options: {
      cutout: '65%',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 8 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => ` ${ctx.label}: ${ctx.raw} items`
          }
        }
      }
    },
    plugins: [centerTextPlugin]
  });
}
get staffVisiblePages() {
  const pages = [];
  for (let i = 1; i <= this.staffTotalPages; i++) {
    pages.push(i);
  }
  return pages;
}

changeStaffPage(page: number) {
  this.staffCurrentPage = page;
  this.applyStaffFilters();
}
loadStaff() {

  this.cafeId = Number(localStorage.getItem("cafeId"));

  if (!this.cafeId) return;

  this.http.get(`${this.base}/staff/cafe/${this.cafeId}`)
    .subscribe({
      next: (d: any) => {

        this.staffList = d.map((s: any) => ({
          userId: s.userId || s.user_id,   // 🔥 IMPORTANT
          photo: s.photo,
          role: s.role,
          email: s.email,
          phone: s.phone,
          personal_details: s.personalDetails
            ? JSON.parse(s.personalDetails)
            : {},
          address_details: s.addressDetails
            ? JSON.parse(s.addressDetails)
            : {},
          education_details: s.educationDetails
            ? JSON.parse(s.educationDetails)
            : [],
          work_details: s.workDetails
            ? JSON.parse(s.workDetails)
            : [],
          document_details: s.documentDetails
            ? JSON.parse(s.documentDetails)
            : []
        }));

        this.applyStaffFilters();

        this.waiterCount =
          this.staffList.filter((s: any) => s.role === 'WAITER').length;

        this.chefCount =
          this.staffList.filter((s: any) => s.role === 'CHEF').length;
      },
      error: err => {
        console.error("Staff load failed:", err);
      }
    });
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

/* pagination setup */

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
loadOrders() {
  this.http.get<any>(`http://localhost:8080/api/orders/cafe/${this.cafeId}`)
    .subscribe(res => {

      this.allOrders = res || [];  // ✅ keep master copy
      this.orders = [...this.allOrders];

      // counts exclude cancelled
      this.pendingOrders = this.allOrders.filter((o: any) =>
        o.chefStatus === 'PENDING' && o.orderStatus !== 'CANCELLED'
      ).length;

      this.preparingOrders = this.allOrders.filter((o: any) =>
        o.chefStatus === 'COMPLETED' &&
        o.waiterStatus === 'PENDING' &&
        o.orderStatus !== 'CANCELLED'
      ).length;

      this.completedOrders = this.allOrders.filter((o: any) =>
        o.waiterStatus === 'SERVED' &&
        o.orderStatus !== 'CANCELLED'
      ).length;

      this.orderTotalPages =
        Math.ceil(this.allOrders.length / this.orderPageSize) || 1;

      this.applyOrderFilters();
    });
}
changeOrderPage(page: number) {
  this.orderCurrentPage = page;
  const start = (page - 1) * this.orderPageSize;
  const end = start + this.orderPageSize;
  this.paginatedOrders = this.filteredOrders.slice(start, end);
  this.updateOrderPages();
}


updateOrderPages(){

let start = Math.max(1,this.orderCurrentPage-1);
let end = Math.min(start+2,this.orderTotalPages);

if(end-start < 2){
start = Math.max(1,end-2);
}

this.visibleOrderPages = [];

for(let i=start;i<=end;i++){
this.visibleOrderPages.push(i);
}

}
// REPLACE existing getOrderColor
getOrderColor(o: any) {
  if (o.orderStatus === 'CANCELLED') return 'statusCancelled';
  if (o.chefStatus === 'PENDING') return 'statusPending';
  if (o.chefStatus === 'COMPLETED' && o.waiterStatus === 'PENDING') return 'statusPreparing';
  return 'statusCompleted';
}
loadPayments(){

this.http.get<any>(`http://localhost:8080/api/payments/cafe/${this.cafeId}`)
.subscribe(res=>{

this.payments = res || [];

/* TOTAL REVENUE */
this.totalRevenue = this.payments.reduce(
(sum:any,p:any)=> sum + Number(p.amount || 0),0
);

/* TODAY REVENUE */

const today = new Date().toISOString().split('T')[0];

this.todayRevenue = this.payments
.filter((p:any)=> p.paymentTime?.startsWith(today))
.reduce((sum:any,p:any)=> sum + Number(p.amount || 0),0);

this.paymentTotalPages =
Math.ceil(this.payments.length / this.paymentPageSize);

this.changePaymentPage(1);

/* LOAD CHART */

setTimeout(()=>{
this.loadRevenueChart();
},200);

});

}
applyPaymentFilter(){

let data = [...this.payments];

if(this.paymentDateFilter){

data = data.filter((p:any)=>
p.paymentDate?.startsWith(this.paymentDateFilter)
);

}

this.payments = data;

this.paymentTotalPages =
Math.ceil(this.payments.length / this.paymentPageSize);

this.changePaymentPage(1);

}
setPage(p: PageType) {

  this.page = p;

  if (p === 'dashboard') {

    // Small delay so HTML + canvas loads properly
    setTimeout(() => {

      // 🔥 Load all dashboard data
      this.loadMenu();
      this.loadStaff();
      this.loadTable();
      this.loadPayments();     // ⭐ THIS FIXES CHART
      this.loadOrders();
      this.loadReservations();

    }, 100);
  }
}
changePaymentPage(page:number){

this.paymentCurrentPage = page;

const start = (page-1) * this.paymentPageSize;
const end = start + this.paymentPageSize;

this.paginatedPayments =
this.payments.slice(start,end);

this.updatePaymentPages();

}


updatePaymentPages(){

let start = Math.max(1,this.paymentCurrentPage-1);
let end = Math.min(start+2,this.paymentTotalPages);

if(end-start < 2){
start = Math.max(1,end-2);
}

this.visiblePaymentPages = [];

for(let i=start;i<=end;i++){
this.visiblePaymentPages.push(i);
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

/* FILTER TYPE */

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

/* reset pagination */

this.resTotalPages =
Math.ceil(this.reservations.length / this.resPageSize);

this.changeReservationPage(1);

}

loadRevenueChart(){

if(!this.revenueChartRef) return;

const ctx = this.revenueChartRef.nativeElement.getContext("2d");

if(this.revenueChart){
this.revenueChart.destroy();
}

const revenueMap:any = {};

this.payments.forEach((p:any)=>{

const date = p.paymentTime?.split("T")[0];

if(!revenueMap[date]){
revenueMap[date] = 0;
}

revenueMap[date] += Number(p.amount);

});

const labels = Object.keys(revenueMap);
const values = Object.values(revenueMap);

this.revenueChart = new Chart(ctx,{
type:'bar',
data:{
labels:labels,
datasets:[{
label:'Daily Revenue',
data:values,
backgroundColor:'#b87a2c'
}]
},
options:{
responsive:true,
plugins:{
legend:{display:false}
},
scales:{
y:{
beginAtZero:true
}
}
}
});
}
// ADD these two new methods (keep old ones too)
getReservationStatusColor(r: any): string {
  if (r.status === 'CANCELLED') return 'statusCancelled';
  const today = new Date().toISOString().split('T')[0];
  if (r.bookingDate === today) return 'statusToday';
  if (r.bookingDate > today) return 'statusUpcoming';
  return 'statusCompleted';
}

getReservationStatusText(r: any): string {
  if (r.status === 'CANCELLED') return 'CANCELLED';
  const today = new Date().toISOString().split('T')[0];
  if (r.bookingDate === today) return 'TODAY';
  if (r.bookingDate > today) return 'UPCOMING';
  return 'COMPLETED';
}
orderSearch = '';
orderFilter = 'ALL';
filteredOrders: any[] = [];
searchOrders(e: any) {
  this.orderSearch = e.target.value.toLowerCase();
  this.applyOrderFilters();
}
filterOrders(e: any) {
  this.orderFilter = e.target.value;
  this.applyOrderFilters();
}
applyOrderFilters() {

  // ✅ always start from master copy
  let data = [...this.allOrders];

  // STATUS FILTER
  if (this.orderFilter !== 'ALL') {
    data = data.filter((o: any) => {

      if (this.orderFilter === 'PENDING') {
        return o.chefStatus === 'PENDING'
          && o.orderStatus !== 'CANCELLED';
      }
      if (this.orderFilter === 'PREPARING') {
        return o.chefStatus === 'COMPLETED'
          && o.waiterStatus === 'PENDING'
          && o.orderStatus !== 'CANCELLED';
      }
      if (this.orderFilter === 'COMPLETED') {
        return o.waiterStatus === 'SERVED'
          && o.orderStatus !== 'CANCELLED';
      }
      if (this.orderFilter === 'CANCELLED') {
        return o.orderStatus === 'CANCELLED';
      }
      return true;
    });
  }

  // SEARCH FILTER
  if (this.orderSearch) {
    data = data.filter((o: any) =>
      o.orderId?.toLowerCase().includes(this.orderSearch) ||
      ('user ' + o.customerId).includes(this.orderSearch)
    );
  }

  this.orderTotalPages =
    Math.ceil(data.length / this.orderPageSize) || 1;

  // ✅ paginate from filtered data, not this.orders
  this.orderCurrentPage = 1;
  const start = 0;
  const end = this.orderPageSize;
  this.paginatedOrders = data.slice(start, end);

  this.updateOrderPages();

  // store filtered for pagination
  this.filteredOrders = data;
}
}
