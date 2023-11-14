
require('color');

const { guardarDB, leerDB} = require('./ayudas/guardarArchivo');

const   {   inquirerMenu,
            pausa,
            leerInput,
            listadoTareasBorrar,
            confirmar,
            mostrarListadoCheckList
        } = require('./ayudas/inquirer');


const Tareas = require ('./modelos/tareas');


const main = async() => {

    let opt = '';
    const tareas = new Tareas ();
    const tareasDB = leerDB();

    if ( tareasDB ) {  //cargar tareas
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {  //imprime el menu y retorna una opción, trabajo con el async y await
       opt = await inquirerMenu(); 
       
       switch (opt) {
           case '1':
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea(desc);  
            break;

            case '2':
                tareas.listadoCompleto();
            break;  

            case '3':  //listar completadas
                tareas.listarPendientesCompletadas(true);
            break;   

            case '4':  //listar pendientes
                tareas.listarPendientesCompletadas(false);    
            break; 

            case '5': // completado | pendiente
                const ids = await mostrarListadoCheckList( tareas.listadoArr);
                tareas.toggleCompletadas( ids );
            break; 
               
            case '6':  //borrar
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if ( id !== '0' ) {
                    const ok = await confirmar('¿Está seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
            break;  
       
       }

        guardarDB( tareas.listadoArr);

        await pausa();
        
    } while (opt !=='0');
}


main();