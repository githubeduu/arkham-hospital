import { Injectable } from '@angular/core';

/**
 * @description
 * Servicio para la gestión del carro de compras.
 * Permite agregar, obtener, actualizar y eliminar elementos del carro de compras, así como también calcular el total de la compra.
 */

/**
 * @usageNotes
 * Este servicio utiliza el almacenamiento local para almacenar los elementos del carro de compras.
 * Los métodos proporcionados permiten agregar elementos al carro, obtener la lista de elementos, eliminar elementos del carro, y actualizar la cantidad de un elemento en el carro.
 * También se puede obtener el total de la compra, que es calculado como la suma del precio de cada elemento multiplicado por su cantidad en el carro.
 */

@Injectable({
  providedIn: 'root'
})
export class CarroService {
  private items: any[] = [];

  constructor() {
    if (this.isLocalStorageAvailable()) {
      this.items = JSON.parse(localStorage.getItem('itemsCarro') || '[]');
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Agrega un producto al carro de compras.
   * @param producto Producto a agregar al carro.
   */
  agregarAlCarro(producto: any) {
    const existingItem = this.items.find((item) => item.id === producto.id);
    if (existingItem) {
      existingItem.cantidad++;
    } else {
      this.items.push({
        id: producto.id,
        titulo: producto.titulo,
        imagenurl: producto.imagenurl,
        precio: producto.precio,
        cantidad: 1,
      });
    }
    this.updateLocalStorage();
  }
  
    /**
   * Obtiene los elementos del carro de compras.
   * @returns Lista de elementos del carro de compras.
   */
  getItems() {
    return this.items;
  }

  /**
   * Elimina un elemento del carro de compras.
   * @param item Elemento a eliminar del carro de compras.
   */
  borrarDeCarro(item: any) {
    this.items = this.items.filter((i) => i.id !== item.id);
    this.updateLocalStorage();
  }

  /**
   * Aumenta la cantidad de un elemento en el carro de compras.
   * @param id ID del elemento cuya cantidad se desea aumentar.
   */
  sumarCantidad(id: number) {
    let item = this.items.find((i) => i.id === id);
    if (item) {
      item.cantidad++;
      this.updateLocalStorage();
    }
  }

   /**
   * Disminuye la cantidad de un elemento en el carro de compras.
   * @param id ID del elemento cuya cantidad se desea disminuir.
   */
  restarCantidad(id: number) {
    let item = this.items.find((i) => i.id === id);
    if (item) {
      item.cantidad--;
      this.updateLocalStorage();
    }
  }

  /**
   * Calcula el total de la compra.
   * @returns Total de la compra.
   */
  getTotal() {
    return this.items.reduce((acc, item) => {
      return acc + item.precio * item.cantidad;
    }, 0);
  }

  private updateLocalStorage() {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('itemsCarro', JSON.stringify(this.items));
    }
  }
}
