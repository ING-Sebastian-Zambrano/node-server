

require('color');


const mostrarMenu =  () => {

    return new Promise ( resolve => {

        console.clear();

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