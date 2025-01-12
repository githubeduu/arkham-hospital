import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private apiUrl = 'https://pacientes-service-162097676670.us-east1.run.app/api/pacientes';

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addPaciente(nuevoPaciente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, nuevoPaciente);
  }

  updatePaciente(id: number, paciente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${paciente.rut}`, paciente);
  }
  
  deletePaciente(rut: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${rut}`);
  }
}
