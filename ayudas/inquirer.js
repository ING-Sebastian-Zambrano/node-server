const inquirer = require('inquirer');
require ('color');


const menuOpt = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Seleccione una Opción',
        choices: [

            {
                value:'1',
                name: '1. Crear Tarea '

            },

            {
                value:'2',
                name: '2. Ver Tareas'
            },

            {
                value:'3',
                name: '3. Completar Tarea'
            },

            {
                value: '4',
                name: '4. Eliminar Tarea'
            },

            {
                value: '0',
                name: '0. Salir'
            },
        ]
    }
]



const inquirerMenu = async () => {


    console.clear();
    console.log('================================');
    console.log('       LISTA DE TAREAS');
    console.log('================================\n');

    const {opcion} = await inquirer.prompt(menuOpt)
    return opcion;


}

const pausa = async() => {
    const question = [
        {
            type: 'imput', 
            name: 'enter',
            message : "Presione ENTER para continuar"
        }
    ];


    console.log('\n');
    await inquirer.prompt(question)
}

const leerIn = async( message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate ( value ) { 
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor'
                }
                return true;
                
            }
        }

    ];

    const { desc} = await inquirer.prompt(question);
    return desc;
}


module.exports ={
    inquirerMenu,
    pausa,
    leerIn
}