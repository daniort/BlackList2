import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators  ,ReactiveFormsModule} from '@angular/forms';
import { UserInterface } from '../../../interfaces/userinterface';
import {UserService} from '../../../servicios/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  registrar:boolean=false;
  usuarioNuevo:UserInterface={
    user:"",
    pass:'',
    estado:false
  }
  useritem:UserInterface[];
  namelist:string[];
  firstPass:string;
  secondPass:string;
  olvidado:boolean;
  perm:boolean;
  pass:boolean;
  user:boolean;
  vacio:boolean;
  contrasena:string;
  usuario:string;



    @Output() activar:EventEmitter<string>=new EventEmitter<string>();

  //passMenssageFail:boolean;
  //userMenssageFail:boolean;

  constructor( private  UserService:UserService) {
          this.namelist=[];
     }

  ngOnInit() {
    this.UserService.getUsers().subscribe(users =>{
            this.useritem=users;
             for (let unaDeuda of this.useritem) {
             this.namelist.push(unaDeuda.user);//llenamos el arreglo de nombres
           }
       });
  }
  enviarDatos(){
    //convertimos los datos a mayusculas
    this.usuarioNuevo.user= this.usuarioNuevo.user.toUpperCase();
    this.usuarioNuevo.pass= this.secondPass.toUpperCase();
    //enviamos el arreglo de la nueva deuda
    this.UserService.addUser(this.usuarioNuevo);
    //this.onCancel();
    this.registrar=false;
    this.ngOnInit();
  }

  onLogin(){
    let i=0;
    if(this.usuario != null && this.contrasena != null ){
      let c = this.usuario.toUpperCase();
      let d = this.contrasena.toUpperCase();
      for (let unaUsuario of this.useritem) {
        i++;
        //console.log(unaUsuario.user);
        //console.log(i);
        if (c === unaUsuario.user) {
            if (d === unaUsuario.pass) {
              if (unaUsuario.estado) {
                this.UserService.Auth(unaUsuario.user);
                this.activar.emit(unaUsuario.id); //enviamos la id al componente principal
                 break
              }else{
                this.perm=true;
                this.pass=null;
                this.user=null;
                //console.log("no autorizado");
              }
              break;
            }else{
              this.pass=true;
              this.user=null;
              //console.log("password incorrecto ");
              break;
            }
        }else{
            //console.log("usuario incorrecto ");
          if (i==this.getNumberofUser()){
            this.user=true;
            this.pass=null;
            this.perm=null;
            //console.log("usuario no encontrados ");
          }
          //algoritmo para ver si esta o no el uduario
        }
      }
    }else{
      //mensaje de formualrio Vacio
      //alert("form vacio");
      this.vacio=true;
    }
    }


  getNumberofUser(){
    let encontrados=0;
    for (let entry of this.useritem) {
        encontrados=encontrados+1;
      }
    return  encontrados;
  }

}
