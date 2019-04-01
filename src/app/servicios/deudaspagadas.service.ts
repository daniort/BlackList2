
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from   'rxjs/operators';
import { DeudorPaInterface } from '../interfaces/deudorpainterface';
import { DeudorInterface } from '../interfaces/deudorinterface';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class DeudaspagadasService {
  private DeudaspaCollection : AngularFirestoreCollection<DeudorPaInterface>;
  deudaspa: Observable <DeudorPaInterface[]>;
  deudaspaDoc: AngularFirestoreDocument <DeudorPaInterface>;

  deudapagada:DeudorPaInterface={

    nombre : '',
    cantidad : 0,
    descripcion : '',
    nota : '',
    fechadeuda : '',
    idUserDeuda : '',
    idUserSaldo : '',
    botella:null,
  };

  constructor(public db: AngularFirestore) {
    this.DeudaspaCollection = db.collection<DeudorPaInterface>('deudaspagadas', ref => ref.orderBy('fechapago','desc'));
 }
 getDeudas(){
   this.deudaspa= this.DeudaspaCollection.snapshotChanges().pipe(
     map(actions => actions.map(a=>{
       const data = a.payload.doc.data() as DeudorPaInterface;
       const id =a.payload.doc.id;
       return {id, ...data};
     }))
   );
   return this.deudaspa;
 }
 addDeuda(deuda:DeudorInterface,id:string){
   console.log(deuda);
   const fechaNow = Date.now();
   console.log("conversion");

  this.deudapagada.nombre=deuda.nombre;
  this.deudapagada.cantidad=deuda.cantidad;
  this.deudapagada.descripcion=deuda.descripcion;
  this.deudapagada.nota=deuda.nota;
   this.deudapagada.fechapago=fechaNow;
   this.deudapagada.fechadeuda=deuda.fecha;
   this.deudapagada.botella=deuda.botella;
   this.deudapagada.idUserDeuda=deuda.idUserDeuda; //Usuario que dio la deuda
   this.deudapagada.idUserSaldo=id; //Usario que atendio el saldo de deuda
   console.log(this.deudapagada);
   this.DeudaspaCollection.add(this.deudapagada);
 }
 deleteDeuda(id: string){
   //this.deudaspaDoc=this.db.doc(`deudas/${id}`);
   //this.deudaspaDoc.delete();
 }
 editDeuda(deuda:DeudorPaInterface){
  // this.deudaspaDoc=this.db.doc(`deudas/${deuda.id}`);
   //this.deudaspaDoc.update(deuda);
 }
}
