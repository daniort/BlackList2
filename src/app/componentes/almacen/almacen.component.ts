import { Component, OnInit } from '@angular/core';
import { AlmacenService } from '../../servicios/almacen.service';
import { ProductoInterface } from '../../interfaces/productointerface';

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
      };
  editState:boolean=false;
  deleteState:boolean=false;
  createState:boolean=false;
  idToDelete:string;
  searchText:string; //eto es para el pipe de busqueda

  constructor(public AlmacenService: AlmacenService) { }
  ngOnInit() {
    this.AlmacenService.getProducts().subscribe(producto =>{
      this.productoitem=producto;
     console.log(producto);
      console.log("Arreglo de Productos Obtenidos");
    });
  }
  onEditProducto( event, producto:ProductoInterface){
    console.log("quieres editar");
    this.editState= true;
    this.productoeditar=producto;
    console.log(this.productoeditar);
}
onDeleteProducto(event, id:string){
  console.log("quieres eliminar");
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
  this.AlmacenService.addProduct(this.productonuevo);
  this.createState=false;
}
}
