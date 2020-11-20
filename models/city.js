const fs = require('fs')
const path = require('path')

class City {
    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'city.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(content))
                    }
                }
            )
        })

    }
    static async getByCity(name) {
        const city = await City.getAll()
        const arrCity = []
        city.forEach((c) => {
            c.cities.forEach((e) => {
                arrCity.push(e)
            })
        })
        return arrCity.find(c => c.nameEn === name)
    }
}

module.exports = City