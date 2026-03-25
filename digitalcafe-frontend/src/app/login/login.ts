import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import swal from 'sweetalert';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
goLanding(){
  this.router.navigate(['/']);
}

goLogin(){
  this.router.navigate(['/register']);
}
onLogin(){

const loginData={
  email:this.email,
  password:this.password
};

this.authService.login(loginData).subscribe({

next:(res:any)=>{

console.log("LOGIN RESPONSE:",res);

/* STORE SESSION DATA */

localStorage.setItem("userId", res.userId);
localStorage.setItem("role", res.role);
localStorage.setItem("cafeId", res.cafeId);

/* SUCCESS POPUP */

swal({
  title: "Login Successful 🎉",
  text: "Welcome back!",
  icon: "success",
  buttons: ["Continue"]
}).then(()=>{

const role = res.role;

/* NAVIGATION */

if(role==="ADMIN"){
  this.router.navigate(['/admin']);
}
else if(role==="OWNER"){
  this.router.navigate(['/owner']);
}
else if(role==="CHEF"){
  this.router.navigate(['/chef-dashboard']);
}
else if(role==="WAITER"){
  this.router.navigate(['/waiter']);
}
else if(role==="CUSTOMER" || role==="USER"){
  this.router.navigate(['/user-dashboard']);
}
else{
  swal("Error","Invalid role from server","error");
}

});

},

error:(err)=>{

console.error(err);

swal({
  title: "Login Failed ❌",
  text: "Invalid email or password",
  icon: "error",
  buttons: ["Try Again"]
});

}

});

}




}
