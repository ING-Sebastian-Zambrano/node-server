

require('color');


const mostrarMenu =  () => {

    return new Promise ( resolve => {

        console.clear();
        console.log('================================');
        console.log('Seleccione una Opción');
        console.log('================================\n');


        console.log('1. Crear Tarea'); 
        console.log('2. Ver Tareas'); 
        console.log('3. Comletar Tarea'); 
        console.log('4. Eliminar Tareas'); 
        console.log('Salir \n'); 

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Selecciones una Opcion: ', (opt) => {
            readline.close();
            resolve(opt);
        }) 


    });
}

const pausa = () =>{

    return new Promise ( resolve => {

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        readline.question('\nPresione ENTER para continuar\n', (opt) => {
            readline.close();
            resolve();
        }) 


     });

        

 }

module.exports = {
    mostrarMenu,
    pausa
}