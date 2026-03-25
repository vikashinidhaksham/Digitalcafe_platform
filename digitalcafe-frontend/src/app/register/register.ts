import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

constructor(
  private authService: AuthService,
  private router: Router,
  private route:ActivatedRoute
) {}
ngOnInit(){

  this.route.queryParams.subscribe(params => {
    if (params['role']) {
      this.selectedRole = params['role']; // OWNER or CUSTOMER
      this.roleSelected = true;
      this.activeTab = 1;
    }
  });

}
  // ---------------- ROLE ----------------
  roleSelected = false;
  selectedRole: string = '';
  submitted = false;

  selectRole(role: string) {
    this.selectedRole = role;
    this.roleSelected = true;
  }

  // ---------------- TABS ----------------
  activeTab = 1;

  // TAB 1 – Personal
  personal = {
    firstName: '',
    lastName: '',
    phone: '',
    gmail: '',
    dob: '',
    gender: ''
  };

  // TAB 2 – Address
  address = {
    doorNo: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  };

  // TAB 3 – Education
  educationList = [
    { school: '', degree: '', year: '' }
  ];

  // TAB 4 – Work
  workList = [
    { company: '', role: '', experience: '' }
  ];

  // TAB 5 – Document
  documentFile: File | null = null;

  // ⭐⭐⭐ NEW — CHEF CAFE DETAILS ONLY
  cafe = {
    name: '',
    address: '',
    phone: ''
  };

  // ---------- NAVIGATION ----------
next() {
  this.submitted = true;

  if (this.activeTab < 5 && this.isCurrentTabValid()) {
    this.submitted = false;
    this.activeTab++;
  }
}

  goLogin(){
    this.router.navigate(['/login']);
  }

  goLanding(){
    this.router.navigate(['/']);
  }

  prev(){

    if(this.activeTab === 1){
      this.roleSelected = false;
      return;
    }

    this.activeTab--;
  }

  // ---------- ADD MORE ----------
  addEducation() {
    this.educationList.push({ school: '', degree: '', year: '' });
  }

  addWork() {
    this.workList.push({ company: '', role: '', experience: '' });
  }

  onFileChange(event: any) {
    this.documentFile = event.target.files[0];
  }

  removeEducation(index: number) {
    this.educationList.splice(index, 1);
  }

  removeWork(index: number) {
    this.workList.splice(index, 1);
  }

  // ---------- VALIDATION ----------
  isCurrentTabValid(): boolean {

    if (this.activeTab === 1) {
      return (
        this.personal.firstName.trim() !== '' &&
        this.personal.lastName.trim() !== '' &&
        this.personal.phone.trim() !== '' &&
        this.personal.gmail.trim() !== '' &&
        this.personal.dob !== '' &&
        this.personal.gender !== ''
      );
    }

    if (this.activeTab === 2) {
      return (
        this.address.doorNo.trim() !== '' &&
        this.address.city.trim() !== '' &&
        this.address.state.trim() !== '' &&
        this.address.pincode.trim() !== ''
      );
    }

    if (this.activeTab === 3) {
      return this.educationList.every(e =>
        e.school.trim() !== '' &&
        e.degree.trim() !== '' &&
        e.year.trim() !== ''
      );
    }

    if (this.activeTab === 4) {
      return this.workList.every(w =>
        w.company.trim() !== '' &&
        w.role.trim() !== '' &&
        w.experience.trim() !== ''
      );
    }

    if (this.activeTab === 5) {
      return this.documentFile !== null;
    }

    return true;
  }

  // ---------- SUBMIT ----------
 submit() {

 const payload = {

   role: this.selectedRole,

   email: this.personal.gmail,
   phone: this.personal.phone,
   password: this.personal.phone,

   personalDetails: this.personal,
   addressDetails: this.address,
   educationDetails: this.educationList,
   workDetails: this.workList,

   documentDetails: {
     fileName: this.documentFile?.name || ''
   },


 };

 console.log('Register payload:', payload);

 this.authService.register(payload).subscribe({

 next: () => {

 Swal.fire({
   icon: 'success',
   title: 'Registration Successful 🎉',
   text: 'Your password will be sent via email',
   confirmButtonColor: '#3085d6'
 }).then(() => {
   this.router.navigate(['/login']);
 });

 },

 error: () => {

 Swal.fire({
   icon: 'error',
   title: 'Registration Failed ❌',
   text: 'Please try again',
   confirmButtonColor: '#d33'
 }).then(() => {
   this.router.navigate(['/landing']);
 });

 }

 });

 }
}
