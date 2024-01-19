const fs= require('fs')

const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json'

    constructor(){
        //TODO: leer db si existe
        this.leerDB()
    }


   get historialCapitalizado(){

    return this.historial.map(h => { 
        return h.charAt(0).toUpperCase() + h.slice(1)
  })
   }

    async ciudad ( lugar = '') {

        //peticion http
        const instance = axios.create({
            baseURL: `https://eu1.locationiq.com/v1/search/structured`,
            params: {
                "city" : lugar,
                "key" : process.env.LOCATIONIQ_KEY,
                "limit":5,
                "format" : "json"
            }
        })

        const resp = await instance.get();
        return resp.data.map(lugar => ({
            id: lugar.place_id,
            nombre: lugar.display_name,
            lat : lugar.lat,
            lon: lugar.lon
        })
        )
        // console.log('ciudad', lugar);



        
    }

    async climaLugar(lat, lon){

        try {

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    "lat":lat,
                    "lon":lon,
                    "appid":process.env.OPEN_WEATHER_KEY,
                    "lang":"es",
                    "units":"metric"
                }
            })
    
            const resp = await instance.get();
            return {
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max : resp.data.main.temp_max,
                temp: resp.data.main.temp
            }
            

            //instance axios.create()

            //respuesta.data

            //retornar una objeto con la desc: nubes, min, max, temp
            
        } catch (error) {
            console.log(error);
            
        }

    }

    agregarHistorial( lugar = ''){

        // Condicional para ver si existe ya guardado

        if(this.historial.includes( lugar.toLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5)

        this.historial.unshift(lugar.toLowerCase())

        //Guardar en base de datos

        this.guardarDB();

        
        
    }

    guardarDB(){

        const payload = {
            historial : this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify( payload))


    }

    leerDB(){

        if(!fs.existsSync(this.dbPath)){
            return
        }

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        const data = JSON.parse(info)

        this.historial = data.historial


    }

}




module.exports = Busquedas