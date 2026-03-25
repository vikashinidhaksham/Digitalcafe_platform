import { Component, AfterViewInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements AfterViewInit {

  constructor(private http: HttpClient) {}

  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.startCounter();
    }, 200);
  }

  startCounter() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach((counter: any) => {
      const target = +counter.getAttribute('data-target');
      let count = 0;

      const update = () => {
        const increment = target / 120;

        if (count < target) {
          count += increment;
          counter.innerText = this.formatNumber(Math.floor(count));
          requestAnimationFrame(update);
        } else {
          counter.innerText = this.formatNumber(target);
        }
      };

      update();
    });
  }

  formatNumber(num: number): string {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + ' billion+';
    } else if (num >= 1000) {
      return num.toLocaleString() + '+';
    } else {
      return num + '+';
    }
  }

submitForm() {
  this.http.post('http://localhost:8080/api/query/save', this.form)
    .subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: 'We will get back to you soon.',
          confirmButtonColor: '#f97316',
          confirmButtonText: 'OK'
        });

        this.form = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Send',
          text: 'Something went wrong. Please try again.',
          confirmButtonColor: '#f97316',
          confirmButtonText: 'Retry'
        });
      }
    });
}
}
