import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from   'rxjs/operators';
import { UserInterface } from '../interfaces/userinterface';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private UserCollection : AngularFirestoreCollection<UserInterface>;
  users: Observable <UserInterface[]>;
  usersDoc: AngularFirestoreDocument <UserInterface>;
  root:string="ADMIN";

  esAdmin:boolean=false;

  constructor(public db: AngularFirestore) {
    this.UserCollection = db.collection<UserInterface>('users');
}
getUsers(){
  this.users= this.UserCollection.snapshotChanges().pipe(
    map(actions => actions.map(a=>{
      const data = a.payload.doc.data() as UserInterface;
      const id =a.payload.doc.id;
      return {id, ...data};
    }))
  );
  return this.users;
}
addUser(user: UserInterface){
  this.UserCollection.add(user);
  console.log("registrado!")
}
editUser(user: UserInterface):void{
    this.usersDoc=this.db.doc<UserInterface>(`users/${user.id}`);
    this.usersDoc.update(user);
}
Auth(name:string){
  if (name===this.root) {
    this.esAdmin=true;
    }
}
info(){
  return this.esAdmin
}
Reset(){
  this.esAdmin=false;
}
getUsersbyId(){
  
}

}
