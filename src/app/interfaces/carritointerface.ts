export interface CarritoInterface {
  id ?: string;
  vendedor ?: string;

  total ?: number;
  cobrado ?: number;
  vuelto ?: number;

  deuda ?: boolean;

  productos ?: [string];
  //fecha:any;
}
