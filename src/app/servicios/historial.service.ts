import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from   'rxjs/operators';
import { HistoriaInterface } from '../interfaces/historiainterface';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private HistoriaCollection : AngularFirestoreCollection<HistoriaInterface>;
  historia: Observable <HistoriaInterface[]>;
  HistoriaDoc: AngularFirestoreDocument <HistoriaInterface>;

  constructor(public db: AngularFirestore) {
    this.HistoriaCollection = db.collection<HistoriaInterface>('historias', ref => ref.orderBy('fecha','desc'));
  }
  getDeudas(){
    this.historia= this.HistoriaCollection.snapshotChanges().pipe(
      map(actions => actions.map(a=>{
        const data = a.payload.doc.data() as HistoriaInterface;
        const id =a.payload.doc.id;
        return {id, ...data};
      }))
    );
    return this.historia;
  }
  addHis(historia:HistoriaInterface){
    const fechaNow = Date.now();
    historia.fecha=fechaNow;

    //deuda.idUserDeuda=this.idActive
    this.HistoriaCollection.add(historia);
  }
}
