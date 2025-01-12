import { TestBed } from '@angular/core/testing';
import { CarroService } from './carro.service';


describe('CarroService', () => {
  let service: CarroService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [CarroService],
    });
    service = TestBed.inject(CarroService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar un producto al carro', () => {
    const producto = { id: 1, titulo: 'Producto 1', precio: 100, imagenurl: 'test imagen' };
    service.agregarAlCarro(producto);

    const items = service.getItems();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual({ ...producto, cantidad: 1 });
  });

  it('debería eliminar un producto del carro', () => {
    const producto = { id: 1, titulo: 'Producto 1', precio: 100 };
    service.agregarAlCarro(producto);

    service.borrarDeCarro(producto);
    const items = service.getItems();
    expect(items.length).toBe(0);
  });

  it('debería aumentar la cantidad de un producto en el carro', () => {
    const producto = { id: 1, titulo: 'Producto 1', precio: 100 };
    service.agregarAlCarro(producto);

    service.sumarCantidad(1);
    const items = service.getItems();
    expect(items[0].cantidad).toBe(2);
  });

  it('debería disminuir la cantidad de un producto en el carro', () => {
    const producto = { id: 1, titulo: 'Producto 1', precio: 100 };
    service.agregarAlCarro(producto);

    service.sumarCantidad(1);
    service.restarCantidad(1);
    const items = service.getItems();
    expect(items[0].cantidad).toBe(1);
  });
  

  it('debería calcular el total de la compra', () => {
    const producto1 = { id: 1, titulo: 'Producto 1', precio: 100 };
    const producto2 = { id: 2, titulo: 'Producto 2', precio: 200 };
  
    service.agregarAlCarro(producto1);
    service.agregarAlCarro(producto2);
  
    service.sumarCantidad(1);
    const total = service.getTotal();
    expect(total).toBe(400);

  });
  
  
  

  it('debería guardar y recuperar datos de localStorage', () => {
    const producto = { id: 1, titulo: 'Producto 1', precio: 100, imagenurl: 'test imagen' };
    service.agregarAlCarro(producto);

    const nuevoServicio = TestBed.inject(CarroService);
    const items = nuevoServicio.getItems();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual({ ...producto, cantidad: 1 });
  });
});
