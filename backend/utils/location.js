
const axios = require('axios');
const HttpError = require('../utils/http-error');

const getCoordsForAddress = async (address) => {
  if (!address || typeof address !== 'string') {
    throw new HttpError('Invalid address provided.', 422);
  }

  try {
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          format: 'json',
          q: address,
          limit: 1
        },
        headers: {
          'User-Agent': 'YourPlacesApp/1.0 (contact: a7med.mostafa.s3d@gmail.com)'
        },
        timeout: 10000
      }
    );

    const data = response.data;

    if (!Array.isArray(data) || data.length === 0) {
      throw new HttpError(
        "Couldn't find location for the specified address.",
        422
      );
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };

  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    console.error('Nominatim API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    throw new HttpError(
      'Failed to fetch location. Please try again later.',
      500
    );
  }
};

module.exports = getCoordsForAddress;
