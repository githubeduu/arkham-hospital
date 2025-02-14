import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VitalesService {
  private baseUrl = 'http://localhost:8081/vitales';

  constructor(private http: HttpClient) {}
  

  getSenalesVitales(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/paciente/${id}`);
  }
  

}
