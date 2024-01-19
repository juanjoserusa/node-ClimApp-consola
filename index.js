require('dotenv').config({path: "./vars/.env"})

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() => {

    const busquedas = new Busquedas
    let opt

    do {
        
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                
            //Mostrar mensaje
            const inputLugares = await leerInput('Ciudad: '); 
            
            //Buscar los lugares
            const lugares = await busquedas.ciudad(inputLugares)
            
            // seleccionar el lugar
            const id = await listarLugares(lugares);
            if(id == 0) continue;

            const lugarSel = lugares.find(l =>  l.id === id)

            //Guardar en DB
            busquedas.agregarHistorial( lugarSel.nombre)
            
            // Clima
            const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lon)
            
            // Mostrar resultados
            console.clear()
            console.log('\nInformacion de la ciudad\n'.green)
            console.log('Ciudad:'.green, lugarSel.nombre);
            console.log('Lat:'.green, lugarSel.lat, );
            console.log('Lon:'.green, lugarSel.lon, );
            console.log('Temperatura:'.green, clima.temp, 'ºC');
            console.log('Mínima:'.green, clima.min, 'ºC');
            console.log('Máxima:'.green, clima.max, 'ºC');
            console.log('Clima:'.green, clima.desc);

                break;

            case 2:

            busquedas.historialCapitalizado.forEach((lugar, i )=> {
                const idx = `${i + 1}.`.green
                console.log(`${idx} ${lugar}`);
            })

                break;
        
            default:
                break;
        }

        if (opt !== 0) {await pausa()}

    } while (opt !== 0);
}

 main()