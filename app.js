
require('color');

const   {   inquirerMenu,
            pausa,
            leerIn
        } = require('./ayudas/inquirer');
const Tareas = require ('./modelos/tareas');


const main = async() => {

    console.log("Hello, world!");

    let opt = '';
    const tareas = new Tareas ();

    do {
        opt = await inquirerMenu();
        
        switch (opt){
            case '1':
                const desc = await leerIn ('descripción: ');
                tareas.crearTarea ( desc);
            break;

            case '2':
                console.log(tareas._listado);
            break;
        }

        await pausa();

    } while (opt !== '0') ;
    

}


main();