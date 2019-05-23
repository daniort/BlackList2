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
  idToDelete:string;
  searchText:string; //eto es para el pipe de busqueda

  idfile = Math.random().toString(36).substring(2);

  constructor(public AlmacenService: AlmacenService, private storage: AngularFireStorage) { }

  @ViewChild('imageUser') inputImageUser: ElementRef;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;

  ngOnInit() {
    this.AlmacenService.getProducts().subscribe(producto =>{
      this.productoitem=producto;
    });
  }
  onUpload(e){
       const id = Math.random().toString(36).substring(2);
       const file = e.target.files[0];
       const filePath = `products/profile_${id}`;
       const ref = this.storage.ref(filePath);
       const task = this.storage.upload(filePath, file);
       this.uploadPercent = task.percentageChanges();
       task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
  }

onEditProducto( event, producto:ProductoInterface){
    console.log("quieres editar");
    this.editState= true;
    this.productoeditar=producto;
    console.log(this.productoeditar);
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
    this.productonuevo=null
  }
  onGuardar(){
    console.log(this.productoeditar);
    this.AlmacenService.updateProduct(this.productoeditar);
    this.editState= false;
  }
  onCreate(){
   this.createState=true;
  }
  onCreateYa(){
    console.log(this.urlImage);
    this.productonuevo.storage=this.inputImageUser.nativeElement.value;
    this.AlmacenService.addProduct(this.productonuevo);
    this.createState=false;
    this.productoeditar=null;
    this.productonuevo=null
  }
}
