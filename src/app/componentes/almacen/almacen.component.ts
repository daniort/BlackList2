import { FormControl, FormGroup, FormBuilder, Validators  ,ReactiveFormsModule} from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AlmacenService } from '../../servicios/almacen.service';
import { ProductoInterface } from '../../interfaces/productointerface';
import { AngularFireStorage} from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.css']
})
export class AlmacenComponent implements OnInit {

productoitem: ProductoInterface[];

  productoitemAlll:string[];
productoeditar:ProductoInterface;
productonuevo:ProductoInterface={
        nombre:'',
        compra:0,
        cantidad:0,
        venta:0,
        storage:''
      };
  editState:boolean=false;
  deleteState:boolean=false;
  createState:boolean=false;
  load_new_file:boolean;
  idToDelete:string;
  searchText:string; //eto es para el pipe de busqueda

  idfile = Math.random().toString(36).substring(2);
  inicio:boolean;
  namelist:string[];
  filtroActive:boolean=null;
  filtroVacio:boolean=null;
  productoitemFilter:ProductoInterface[];
  resultadosIguales:boolean;
  up_file:boolean=false;
  myForm: FormGroup;
  progreso:number=20;
  error_formato:boolean=false;
  no_foto:boolean=false;
  no_campo_comple:boolean=false;
  constructor(public AlmacenService: AlmacenService,
              private storage: AngularFireStorage,
              private fb:FormBuilder) {
                this.namelist=[];
  }

  @ViewChild('imageUser') inputImageUser: ElementRef;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;

  ngOnInit() {

    this.inicio=true;
    this.AlmacenService.getProducts().subscribe(producto =>{
      this.productoitem=producto;
      for (let unaDeuda of this.productoitem) {
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
            this.productoitemFilter=myArray2;
            //this.totalDeudasResultados=0;
              for (let i = 0; i < this.productoitemFilter.length; i++) {
                console.log(this.resultadosIguales);
                let primernombre;
                if ( this.productoitemFilter.length==1) {
                          this.resultadosIguales=true;
                }
                if (i==0) {
                      primernombre=this.productoitemFilter[i].nombre;
                }else{
                      if (primernombre==this.productoitemFilter[i].nombre) {
                        primernombre=this.productoitemFilter[i].nombre;
                        this.resultadosIguales=true;
                        }else{
                        this.resultadosIguales=false;
                        break
                      }
                }
              }//fin de for para ver si son iguales

        }else{
          //Vacio
          this.filtroActive=true;
          this.filtroVacio=true;
          this.productoitemAlll=this.getDeudasAll();
        }
      }else{
        //todos las deudas
        this.filtroActive=false;
        this.filtroVacio=null;
        this.productoitemAlll=this.getDeudasAll();
      }
    });

  }

  onUpload(e){
    console.log("onuplad");
    let img:any = e.target;
    if(img.files.length > 0){
      console.log(img.files[0].type);
      let tipo = img.files[0].type
      if(tipo == "image/jpeg" || tipo == "image/jpg" || tipo == "image/png"){
        console.log("es una imagen");
        this.no_foto=false;
        this.up_file=true;

        const id = Math.random().toString(36).substring(2);
        const file = e.target.files[0];
        const filePath = `products/profile_${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
      }else{
        console.log("no es un aimagen")
        this.error_formato=true;
        //mensaje de que la extencion es incorrecta
      }

    }
  }
  onNada(){
    if (this.urlImage == null){
      //console.log("te falta foto");
      this.no_foto=true;
    }else{

      //console.log("ento al if");
        this.no_campo_comple=true;
        const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
        this.no_campo_comple=false;
        //console.log("salio del while");


    }


  }
  sleep() {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > 9000){
        break;
      }
    }
  }
  delay(ms: number)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  getDeudasAll():string[]{
    let myArray3=[];
    for (let entry of this.productoitem) {
        myArray3.push(entry);
    }
    return myArray3;
  }
  onEditProducto( event, producto:ProductoInterface){
    console.log("quieres editar");

    this.urlImage=null;
    this.productoeditar=producto;
    console.log(this.productoeditar);
    console.log(this.urlImage);
    this.editState= true;
}
  getDeudasByNombre(val:string):ProductoInterface[]{
  console.log(val);
  let encontrados=0;
  let myArray=[];
  for (let entry of this.productoitem) {
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
  onDeleteProducto(event, id:string){
  this.deleteState= true;
  this.idToDelete=id;
  }
  onDeleteConfirmer(){
    this.AlmacenService.deleteProduct(this.idToDelete);
    this.deleteState= false;
  }
  onCancel(){
    this.deleteState= false;
    this.editState=false;
    this.createState=false;
    this.productoeditar=null;
  //  this.productonuevo=null,
    this.productonuevo={nombre:'',compra:0,cantidad:0,venta:0,storage:''};
    this.load_new_file=null;
    this.urlImage=null;
    this.up_file=false;
  }
  onGuardar(){
    console.log(this.productoeditar);
    if(this.load_new_file){
      this.productoeditar.storage=this.inputImageUser.nativeElement.value;
    }
    this.AlmacenService.updateProduct(this.productoeditar);
    this.editState= false;
    this.load_new_file=null;
  }
  onCreate(){
   this.createState=true;
  }
  onCreateYa(){
    console.log(this.impsec());
    console.log(this.urlImage);
    this.createState=false;
    this.productoeditar=null;
    //this.productonuevo=null;
    this.productonuevo.storage=this.inputImageUser.nativeElement.value;
    this.AlmacenService.addProduct(this.productonuevo);
    this.onCancel();
  }
  impsec(){

  }
}
