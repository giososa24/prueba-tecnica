
//Interfaz para obtener una respuesta con los parametros de la paginacion que llegan del backend

export class Pagination {
    public hasNextPage: boolean;
    public hasPrevPage: boolean;
    public page: number;
    public limit: number;
    public totalDocs: number;
    public totalPages: number;
    public nextPage: number;
    public prevPage: number;
    public pagingCounter: number;
    constructor() {
        this.hasNextPage = false;
        this.hasPrevPage = false;
        this.page = 1;
        this.limit = 0;
        this.totalDocs = 0;
        this.totalPages = 0;
        this.nextPage = 0;
        this.prevPage = 0;
        this.pagingCounter = 0;
    }
  
  }
    