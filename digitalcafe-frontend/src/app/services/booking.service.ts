import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl = "http://localhost:8080/api/bookings";

  constructor(private http: HttpClient) {}

  getBookedTables(cafeId:number,date:string,time:string){
    return this.http.get<number[]>(
      `${this.baseUrl}/${cafeId}/${date}/${time}`
    );
  }

  bookTable(data:any){
    return this.http.post(this.baseUrl,data);
  }
}
