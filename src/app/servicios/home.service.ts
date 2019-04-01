import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from   'rxjs/operators';
import { ProductoInterface } from '../interfaces/productointerface';
import { CarritoInterface } from '../interfaces/carritointerface';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})

export class HomeService {
  private ProductosCollection : AngularFirestoreCollection<ProductoInterface>;
  productos: Observable <ProductoInterface[]>;
  productosDoc: AngularFirestoreDocument <ProductoInterface>;

  private VentasCollection : AngularFirestoreCollection<CarritoInterface>;
  ventas: Observable <CarritoInterface[]>;
  ventasDoc: AngularFirestoreDocument <CarritoInterface>;

  constructor(public db: AngularFirestore) {
    this.ProductosCollection = db.collection<ProductoInterface >('productos');
    this.productos= this.ProductosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a=>{
        const data = a.payload.doc.data() as ProductoInterface;
        const id =a.payload.doc.id;
        return {id, ...data};
      }))
    );
    this.VentasCollection = db.collection<CarritoInterface >('ventas');
    this.ventas= this.VentasCollection.snapshotChanges().pipe(
      map(actions => actions.map(a=>{
        const data = a.payload.doc.data() as CarritoInterface;
        const id =a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }
  getProducts(){
    return this.productos;
  }

}
