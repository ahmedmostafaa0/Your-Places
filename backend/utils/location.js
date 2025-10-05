const axios = require('axios')
const HttpError = require('../utils/http-error')

const getCoordsForAddress = async (address) => {
    const response = await axios.get(`${process.env.API_KEY}?format=json&q=${encodeURIComponent(
      address
    )}&limit=1`)

    const data = response.data
    if(!data || data.length === 0){
        const error = new HttpError('Couldn\'t find location for the specified address.', 422)
        throw error
    }
    return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
    }
}

module.exports = getCoordsForAddress