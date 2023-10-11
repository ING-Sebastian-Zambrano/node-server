
require('color');

const { mostrarMenu, pausa } = require('./ayudas/mensajes');
console.clear();


const main = async() => {

    console.log("Hello, world!");

    let opt = '';

    do {
        opt = await mostrarMenu();

        console.log({ opt })
        if (opt !== "0" ) await pausa();

    } while (opt !== '0') ;
    

}


main();