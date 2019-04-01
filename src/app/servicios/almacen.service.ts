import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from   'rxjs/operators';
import { ProductoInterface } from '../interfaces/productointerface';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class AlmacenService {
  private ProductosCollection : AngularFirestoreCollection<ProductoInterface>;
  productos: Observable <ProductoInterface[]>;
  productosDoc: AngularFirestoreDocument <ProductoInterface>;

  constructor(public db: AngularFirestore) {
    this.ProductosCollection = db.collection<ProductoInterface >('productos');
    this.productos= this.ProductosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a=>{
        const data = a.payload.doc.data() as ProductoInterface;
        const id =a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }
  addProduct(producto: ProductoInterface){
    this.ProductosCollection.add(producto);
  }
  editProduct(producto: ProductoInterface){
    console.log('Metodo edit');
  }
  deleteProduct(id: string){
    console.log("producto elimnado en el service");
    this.productosDoc=this.db.doc(`productos/${id}`);
    this.productosDoc.delete();
  }
  getProducts(){
    return this.productos;
  }
  updateProduct(producto: ProductoInterface){
    console.log("productoeditado en el service");
    this.productosDoc=this.db.doc(`productos/${producto.id}`);
    this.productosDoc.update(producto);
  }

}
