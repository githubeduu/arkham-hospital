import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class LibroService {
    private apiUrl = 'http://localhost:9090/api/libros';
  
    constructor(private http: HttpClient) { }
  
    getAllBook(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
  
    getBookById(id: number): Observable<any[]> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<any[]>(url);
    }
  
    addBook(nuevoProducto: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, nuevoProducto);
    }
  
    UpdateBook(id: number, producto: any): Observable<any> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.put<any>(url, producto);
    }
  
    deleteBook(id: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    getBookByGenero(genero: string): Observable<any[]> {
      const url = `${this.apiUrl}/genero`;
      return this.http.post<any[]>(url, { genero: genero }, { headers: { 'Content-Type': 'application/json' } });
    }
    
  }
  