import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators  ,ReactiveFormsModule} from '@angular/forms';
import { DeudorInterface } from '../../interfaces/deudorinterface';
import { DeudorPaInterface } from '../../interfaces/deudorpainterface';
import { UserInterface } from '../../interfaces/userinterface';
import { HistoriaInterface } from '../../interfaces/historiainterface';

import {DeudasService} from '../../servicios/deudas.service';
import {HistorialService} from '../../servicios/historial.service';
import {UserService} from '../../servicios/user.service';
import {DeudaspagadasService} from '../../servicios/deudaspagadas.service';

@Component({
  selector: 'app-deudores',
  templateUrl: './deudores.component.html',
  styleUrls: ['./deudores.component.css']
})
export class DeudoresComponent implements OnInit {
  //Declaracion de variables
@Input("iduser") id:string;
  myForm: FormGroup;
  myFormBita: FormGroup;
  myFormPagado: FormGroup;
  //////////////////////////////////////7
  deudoritem:DeudorInterface[];
  deudoritemPagado:DeudorPaInterface[];
  deudoritemPagadoFil:DeudorPaInterface[];
  deudoritemhistoFil:HistoriaInterface[];
  userlistAll:UserInterface[];
  deudoritemFilter:DeudorInterface[];
  deudoritemAlll:string[];
  namelist:string[];
  deudaParaEditar:DeudorInterface;
  deudornuevo:DeudorInterface={
      nombre:'',
      cantidad:0,
      descripcion:'',
      botella:null,
      nota:'',
      fecha:'',
      idUserDeuda:''
  };
  historianueva:HistoriaInterface={
    idUser : '',
    accion : '',
    idDeuda : '',
    nombre : '',
    cantidad : 0,
    descripcion : '',
    botella:null,
    nota : '',
  };
  historiasitem:HistoriaInterface[];
  crearState:boolean=false;
  ediState:boolean=false;
  deleState:boolean=false;
  deleVariosState:boolean=false;
  idToDelete:string;
  totalDeudas=0;
  totalDeudasResultados=0;
  abono:number;
  resto:number;
  cambio:number;
  efectivo:number;
  desbloq=false;
  mencrearState:boolean=false;
  menediState:boolean=false;
  mendeleState:boolean=false;
  byBuscar:string;
  filtroActive:boolean=null;
  filtroVacio:boolean=null;
  cobrarTodo:boolean=null;
  inicio:boolean=true;
  historial:boolean=null;
  deudaspagadas:boolean=null;
  resultadosIguales:boolean;
  editbotella=false;
  inputBuscar='';
  confirmerpagoTotal:boolean=false;
  resultadosBitacora:boolean;
  resultadosPagados:boolean;

  constructor( public DeudasService:DeudasService,
                          public DeudaspagadasService:DeudaspagadasService,
                          public UserService:UserService,
                          public HistorialService:HistorialService,
                          private fb:FormBuilder) {
                            this.namelist=[];
                             }
  ngOnInit() {
    //console.log(this.id);
    this.inicio=true;
    this.resultadosBitacora=false;
    this.resultadosPagados=false;
    this.historial=false;
    this.deudaspagadas=false;
    this.DeudaspagadasService.getDeudas().subscribe(deuda =>{
      this.deudoritemPagado=deuda;
    });
    this.HistorialService.getDeudas().subscribe(historias =>{
      this.historiasitem=historias;

    });
    this.UserService.getUsers().subscribe(user =>{
           this.userlistAll=user;
       });
    this.DeudasService.getDeudas().subscribe(deuda =>{
            this.deudoritem=deuda;
            this.totalDeudas=0;
             for (let unaDeuda of this.deudoritem) {
             this.totalDeudas += unaDeuda.cantidad;//generamos le total de dudas
             this.namelist.push(unaDeuda.nombre);//llenamos el arreglo de nombres
           }
       });

    this.myForm = this.fb.group({ buscar: '' });
    this.myForm.get('buscar').valueChanges.subscribe(val =>{
      if (val.length != 0){
        let  myArray2=this.getDeudasByNombre(val);
        if (myArray2.length!=0) {
          //se enceuntran resultados
            this.filtroActive=true;
            this.filtroVacio=null;
            this.deudoritemFilter=myArray2;
            this.totalDeudasResultados=0;
            //creamos el total de estas deudas
              for (let unaDeuda of this.deudoritemFilter) {
                  this.totalDeudasResultados += unaDeuda.cantidad;
                  //generamos le total de dudas
              }

              for (let i = 0; i < this.deudoritemFilter.length; i++) {
                console.log(  this.resultadosIguales);
                let primernombre;
                if ( this.deudoritemFilter.length==1) {
                          this.resultadosIguales=true;
                }
                if (i==0) {
                      primernombre=this.deudoritemFilter[i].nombre;
                }else{
                      if (primernombre==this.deudoritemFilter[i].nombre) {
                        primernombre=this.deudoritemFilter[i].nombre;
                        this.resultadosIguales=true;
                        }else{
                        this.resultadosIguales=false;
                        break
                      }
                }
              }//fin de for para ver si son iguales

        }else{
          //Vacio
          this.filtroActive=false;
          this.filtroVacio=true;
          this.deudoritemAlll=this.getDeudasAll();
        }
      }else{
        //todos las deudas
        this.filtroActive=false;
        this.filtroVacio=null;
        this.deudoritemAlll=this.getDeudasAll();
      }
    });

    this.myFormBita = this.fb.group({ history: '' });
    this.myFormBita.get('history').valueChanges.subscribe(val =>{
    if (val.length != 0){
      let  myArray2=this.getHistorialByNombre(val);
      if (myArray2.length!=0) {
        //resultados
          this.resultadosBitacora=true;
          this.deudoritemhistoFil=myArray2;
          }else{
            this.resultadosBitacora=false;
          }
    }else{
      this.resultadosBitacora=false;
    }
  });

      this.myFormPagado = this.fb.group({ pagado: '' });
      this.myFormPagado.get('pagado').valueChanges.subscribe(val =>{
      if (val.length != 0){
        let  myArray2=this.getPagadosByNombre(val);
        if (myArray2.length!=0) {
          //resultados
            this.resultadosPagados=true;
            this.deudoritemPagadoFil=myArray2;
            }else{
              this.resultadosPagados=false;
              //array Vacio
              // no resultados
            }
      }else{
        this.resultadosPagados=false;

      }
    });
      }
  getDeudasAll():string[]{
    let myArray3=[];
    for (let entry of this.deudoritem) {
        myArray3.push(entry);
    }
    return myArray3;
  }
  getDeudasByNombre(val:string):DeudorInterface[]{
    console.log(val);
    let encontrados=0;
    let myArray=[];
    for (let entry of this.deudoritem) {
      let k=0
      for (let i = 0; i < val.length; i++) {
        let a=entry.nombre.charAt(i).toLowerCase( )
        let b=val.charAt(i).toLowerCase( )
          if (a===b) {
              k=k+1;
            }else{
              k=0;
            }
      }
      if (k===val.length) {
          myArray.push(entry);
          encontrados=encontrados+1;
      }
    }
    return  myArray
  }
  onCreateDeuda($event){
        this.crearState=true;
  }
  onEditDeuda($event, deuda: DeudorInterface){
    this.deudaParaEditar=deuda;
    this.ediState=true;
  }
  onCreateYa(){
    //convertimos los datos a mayusculas
    this.deudornuevo.nombre= this.deudornuevo.nombre.toUpperCase();
    this.deudornuevo.descripcion= this.deudornuevo.descripcion.toUpperCase();
    this.deudornuevo.nota= this.deudornuevo.nota.toUpperCase();
    this.deudornuevo.idUserDeuda=this.getUserbyID(this.DeudasService.getUserActive());
    //this.DeudaspagadasService.addDeuda(this.deudaParaEditar,this.getUserbyID(this.DeudasService.getUserActive()));//ya funciona
    //enviamos el arreglo de la nueva deuda
    this.DeudasService.addDeuda(this.deudornuevo);
    this.historianueva.accion="Agregó";
    this.historianueva.nombre=this.deudornuevo.nombre;
    this.historianueva.descripcion=this.deudornuevo.descripcion;
    this.historianueva.nota=this.deudornuevo.nota;
    this.historianueva.cantidad=this.deudornuevo.cantidad;
    this.historianueva.botella=this.deudornuevo.botella;
    this.historianueva.idUser=this.getUserbyID(this.DeudasService.getUserActive());
    this.HistorialService.addHis(this.historianueva);
    //enviar datos a bitacora
    this.onCancel();
    this.totalDeudas=0;
    this.onMensajeCreador();
  }
  onCancel(){

    this.crearState=false;
    this.ediState=false;
    this.deleState=false;
    this.deleVariosState=false;
    this.cobrarTodo=false;
    this.desbloq = false;
    this.abono=0;
    this.resto=0;
    this.deudaParaEditar=null;
    this.totalDeudasResultados=0;
    this.cobrarTodo=null;
    this.deudornuevo={
        nombre:'',
        cantidad:0,
        descripcion:'',
        nota:'',
        fecha:'',
    };
    this.historianueva={
      idUser : '',
      accion : '',
      idDeuda : '',
      nombre : '',
      cantidad : 0,
      descripcion : '',
      nota : '',
    };
    this.editbotella=null;
  }
  onDeleteConfirmer($event){
    this.resto=this.deudaParaEditar.cantidad - this.abono;
    if (this.resto<=0){
      if (this.deudaParaEditar.botella) {
          //editar cantidad
           this.deudaParaEditar.cantidad=0;
            this.DeudasService.editDeuda(this.deudaParaEditar);
            this.historianueva.accion="Cobró";
            this.historianueva.idUser=this.getUserbyID(this.DeudasService.getUserActive());
            this.historianueva.idDeuda=this.deudaParaEditar.id;
            this.historianueva.nombre=this.deudaParaEditar.nombre;
            this.historianueva.descripcion=this.deudaParaEditar.descripcion;
            this.historianueva.nota=this.deudaParaEditar.nota;
            this.historianueva.cantidad=0;
            this.historianueva.botella=this.deudaParaEditar.botella;
            this.HistorialService.addHis(this.historianueva);
            this.onCancel();
            this.totalDeudas=0;
            this.onMensajeEditado();
      }else{
        //eliminar todo
        this.DeudasService.deleteDeuda(this.deudaParaEditar.id);
        this.DeudaspagadasService.addDeuda(this.deudaParaEditar,this.getUserbyID(this.DeudasService.getUserActive()));//ya funciona
        this.historianueva.accion="Eliminó";
        this.historianueva.idUser=this.getUserbyID(this.DeudasService.getUserActive());
        this.historianueva.idDeuda=this.deudaParaEditar.id;

        this.historianueva.nombre=this.deudaParaEditar.nombre;
        this.historianueva.descripcion=this.deudaParaEditar.descripcion;
        this.historianueva.nota=this.deudaParaEditar.nota;
        this.historianueva.cantidad=this.deudaParaEditar.cantidad;
        this.historianueva.botella=this.deudaParaEditar.botella;

        this.HistorialService.addHis(this.historianueva);


        this.onCancel();
        this.totalDeudas=0;
        this.onMensajeEliminado();
      }

        }else{
          this.deudaParaEditar.cantidad=this.resto;
          this.DeudasService.editDeuda(this.deudaParaEditar);
          //enviar a bitacora
          this.onCancel();
          this.totalDeudas=0;
          this.onMensajeEditado();
        }
      }
  onDeleteVarios($event){
    let sibotella;
    for (let unaDeuda of this.deudoritemFilter){
      if (unaDeuda.botella) {
          sibotella=true;
          }
    }
    if (sibotella) {
              //solo editar
              for (let unaDeuda of this.deudoritemFilter) {
                unaDeuda.cantidad=0;
                this.DeudasService.editDeuda(unaDeuda);

                      this.historianueva.accion="Cobró";
                      this.historianueva.idUser=this.getUserbyID(this.DeudasService.getUserActive());
                      this.historianueva.idDeuda=unaDeuda.id;
                      this.historianueva.nombre=unaDeuda.nombre;
                      this.historianueva.descripcion=unaDeuda.descripcion;
                      this.historianueva.nota=unaDeuda.nota;
                      this.historianueva.cantidad=0;
                      this.historianueva.botella=unaDeuda.botella;

                this.HistorialService.addHis(this.historianueva);
                this.DeudaspagadasService.addDeuda(unaDeuda,this.getUserbyID(this.DeudasService.getUserActive()));//ya funciona      //tambien enviar datos del usuario activo
                console.log("Eliminando...");
              }
              this.filtroActive=null;
              this.filtroVacio=null;
              this.totalDeudas=0;
              this.ngOnInit();
              this.onCancel();
    }else{
      //eliminar todo
      for (let unaDeuda of this.deudoritemFilter) {
        this.DeudasService.deleteDeuda(unaDeuda.id);
        this.historianueva.accion="Eliminó";
        this.historianueva.idUser=this.getUserbyID(this.DeudasService.getUserActive());
        this.historianueva.idDeuda=unaDeuda.id;

              this.historianueva.nombre=unaDeuda.nombre;
              this.historianueva.descripcion=unaDeuda.descripcion;
              this.historianueva.nota=unaDeuda.nota;
              this.historianueva.cantidad=unaDeuda.cantidad;
              this.historianueva.botella=unaDeuda.botella;

        this.HistorialService.addHis(this.historianueva);
        this.DeudaspagadasService.addDeuda(unaDeuda,this.getUserbyID(this.DeudasService.getUserActive()));//ya funciona      //tambien enviar datos del usuario activo
        console.log("Eliminando...");
      }
      this.filtroActive=null;
      this.filtroVacio=null;
      this.totalDeudas=0;
      this.ngOnInit();
      this.onCancel();
    }

  }
  onPrintln($event){
    console.log("imprimiendo");
    console.log(this.deudoritemFilter);
  }
  onDesbloq($event){
    this.desbloq =! this.desbloq;
  }
  onSaldarDeuda($event,duda: DeudorInterface){
    this.deudaParaEditar=duda;
    this.deleState=true;
  }
  onSaldarVariasDeuda($event){
    this.deleVariosState=true;
  }
  onGuardar($event){
    this.DeudasService.editDeuda(this.deudaParaEditar);
    this.historianueva.accion="Modificó";
    this.historianueva.idUser=this.getUserbyID(this.DeudasService.getUserActive());
    this.historianueva.idDeuda=this.deudaParaEditar.id;
    this.historianueva.nombre=this.deudaParaEditar.nombre;
    this.historianueva.descripcion=this.deudaParaEditar.descripcion;
    this.historianueva.nota=this.deudaParaEditar.nota;
    this.historianueva.cantidad=this.deudaParaEditar.cantidad;
    this.historianueva.botella=this.deudaParaEditar.botella;
    this.HistorialService.addHis(this.historianueva);
    this.onCancel();
    this.totalDeudas=0;
    this.onMensajeEditado();
  }
  onMensajeCreador(){
    this.mencrearState=true;
    setTimeout(() => {
       this.mencrearState = false;
     }, 2500);
  }
  onMensajeEditado(){
    this.menediState=true;
    setTimeout(() => {
       this.menediState = false;
     }, 2500);
  }
  onMensajeEliminado(){
    this.mendeleState=true;
    setTimeout(() => {
       this.mendeleState = false;
     }, 2500);
     this.ngOnInit();
  }
  onConfirmer($event){
    this.deleVariosState=false;
    this.confirmerpagoTotal=true;
  }
  historialChange(){
    this.inicio=false;
    this.deudaspagadas=false;
    this.historial=true;
  }
  listaChange(){
    this.inicio=false;
    this.historial=false;
    this.deudaspagadas=true;
  }
  inicioChange(){
    this.inicio=true;
    this.historial=false;
    this.deudaspagadas=false;
  }
  getUserbyID(ide:string){
    //console.log(this.userlistAll.length)
    let name;
       for(let u of this.userlistAll){
         if (u.id===ide) {
             name=u.user;
             break
         }
       }
       return name;
  }
  setColor(accion) {
    switch  (accion){
      case 'Eliminó': return 'red' ;
      case 'Modificó': return 'orange' ;
      case 'Agregó': return 'green' ;
    }
  }
  getHistorialByNombre(val:string){
    let myArray=[];
    for (let end of this.historiasitem) {
      let k=0
      for (let i = 0; i < val.length; i++) {
        if (end.nombre.charAt(i).toLowerCase()===val.charAt(i).toLowerCase( )) {
              k=k+1;
            }else{
              k=0;
            }
      }
      if (k===val.length) {
          myArray.push(end);
      }
    }
    return  myArray
  }
  getPagadosByNombre(val:string):DeudorPaInterface[]{
    let myArray=[];
    for (let end of this.deudoritemPagado) {
      let k=0
      for (let i = 0; i < val.length; i++) {
        if (end.nombre.charAt(i).toLowerCase()===val.charAt(i).toLowerCase( )) {
              k=k+1;
            }else{
              k=0;
            }
      }
      if (k===val.length) {
          myArray.push(end);
      }
    }
    return  myArray

  }
  deseditbotella(){
    this.editbotella=!this.editbotella;
  }
}
