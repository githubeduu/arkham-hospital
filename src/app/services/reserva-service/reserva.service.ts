import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private baseUrl = 'http://localhost:9090/api/reservas/horaMedica';

  constructor(private http: HttpClient) {}

  /**
   * Realiza una reserva de cita médica.
   * @param reserva Datos de la reserva.
   * @returns Observable con la respuesta del backend.
   */
  reservarCita(reserva: any): Observable<any> {
    return this.http.post(this.baseUrl, reserva).pipe(
      catchError((error) => {
        console.error('Error en la reserva:', error);
        return throwError(() => new Error('Error en la reserva de cita.'));
      })
    );
  }
}
