const { v4:uudiv4 } = require('uuid');

class Tarea {

    id= '';
    desc = '';
    completado = null;

    constructor( desc) {
        this.id  = uudiv4();
        this.desc = desc;
        this.completado = null;

    }

}

module.exports = Tarea;
