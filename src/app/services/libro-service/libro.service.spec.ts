import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LibroService } from './libro.service';

describe('LibroService', () => {
  let service: LibroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LibroService]
    });
    service = TestBed.inject(LibroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener un libro por ID', () => {
    const mockBook = [{ 
      id: 1, 
      titulo: 'Libro 1', 
      autor: 'Autor 1', 
      anioPublicacion: 2020, 
      genero: 'Fantasía', 
      imagenurl: 'assets/images/libro1.png', 
      precio: 1990 
    }];
  
    service.getBookById(1).subscribe((books) => {
      expect(books).toEqual(mockBook); 
      expect(books[0]).toEqual(mockBook[0]);
    });
  
    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
  
    req.flush(mockBook);
  });  
  

  it('debería agregar un libro', () => {
    const newBook = { titulo: 'Nuevo Libro' };
    const mockResponse = { id: 1, ...newBook };

    service.addBook(newBook).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newBook);
    req.flush(mockResponse);
  });

  it('debería actualizar un libro', () => {
    const updatedBook = { id: 1, titulo: 'Libro Actualizado' };

    service.UpdateBook(1, updatedBook).subscribe((response) => {
      expect(response).toEqual(updatedBook);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedBook);
    req.flush(updatedBook);
  });

  it('debería eliminar un libro', () => {
    service.deleteBook(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debería obtener libros por género', () => {
    const mockBooks = [{ id: 1, genero: 'Fantasía' }];
    const genero = 'Fantasía';

    service.getBookByGenero(genero).subscribe((books) => {
      expect(books).toEqual(mockBooks);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/genero`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ genero });
    req.flush(mockBooks);
  });
});
