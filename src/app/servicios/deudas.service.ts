import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from   'rxjs/operators';
import { DeudorInterface } from '../interfaces/deudorinterface';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {DeudorPaInterface}  from '../interfaces/deudorpainterface';
import {DeudaspagadasService} from '../servicios/deudaspagadas.service';



@Injectable({
  providedIn: 'root'
})
export class DeudasService {
  private DeudasCollection : AngularFirestoreCollection<DeudorInterface>;
  deudas: Observable <DeudorInterface[]>;
  deudasDoc: AngularFirestoreDocument <DeudorInterface>;

  idActive:string='';

  constructor(public db: AngularFirestore) {
    this.DeudasCollection = db.collection<DeudorInterface>('deudas', ref => ref.orderBy('fecha','desc'));
  }
  getDeudas(){
    this.deudas= this.DeudasCollection.snapshotChanges().pipe(
      map(actions => actions.map(a=>{
        const data = a.payload.doc.data() as DeudorInterface;
        const id =a.payload.doc.id;
        return {id, ...data};
      }))
    );
    return this.deudas;
  }
  addDeuda(deuda:DeudorInterface){
    const fechaNow = Date.now();
    deuda.fecha=fechaNow;
    //deuda.idUserDeuda=this.idActive
    this.DeudasCollection.add(deuda);
  }
  deleteDeuda(id: string){
    this.deudasDoc=this.db.doc(`deudas/${id}`);
    this.deudasDoc.delete();
  }
  editDeuda(deuda:DeudorInterface){
    this.deudasDoc=this.db.doc(`deudas/${deuda.id}`);
    this.deudasDoc.update(deuda);

  }
  setUserActive(id:string):void{
    this.idActive=id;
  }
  getUserActive(){
    return this.idActive;
  }
}
