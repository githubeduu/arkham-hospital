import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private baseUrl = 'https://18gd5vtcm8.execute-api.us-east-1.amazonaws.com';

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pacientes`);
  }

  addPaciente(nuevoPaciente: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/guardarPaciente`, nuevoPaciente);
  }

  updatePaciente(id: number, paciente: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updatePaciente/${id}`, paciente);
  }
  
  deletePaciente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deletePaciente/${id}`);
  }
}
