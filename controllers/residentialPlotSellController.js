const axios = require('axios');
const residentialPlotSellModel = require('../models/residentialPlotSellModel');

function setDefaultRatings(obj) {
  obj.zero = 0;
  obj.zero_point_five = 0;
  obj.one = 0;
  obj.one_point_five = 0;
  obj.two = 0;
  obj.two_point_five = 0;
  obj.three = 0;
  obj.three_point_five = 0;
  obj.four = 0;
  obj.four_point_five = 0;
  obj.five = 0;
}

exports.postSaleResidentialPlots = async (req, res) => {
  try {
    let ghyu = req.body.Url;
    const regex = /\/place\/([^\/]+)/;
    const match = ghyu.match(regex);

    if (!match) {
      return res.status(400).json({ error: "Invalid URL: No '/place/' found." });
    }

    const placePart = decodeURIComponent(match[1]);

    if (/^\d/.test(placePart)) {
      const match = ghyu.match(/\/place\/([^/@]+)/);
      if (match) {
        let v = [];
        let dmsCoordinates = decodeURIComponent(match[1]);
        let ansdf = dmsCoordinates.split("+");
        let latDMS = ansdf[0];
        let lngDMS = ansdf[1];

        let dmsRegex = /(\d+)°(\d+)'([\d.]+)"([NSEW])/;
        let match_lat = latDMS.match(dmsRegex);

        if (!match_lat) throw new Error("Invalid DMS format for latitude");

        let degrees = parseFloat(match_lat[1]);
        let minutes = parseFloat(match_lat[2]);
        let seconds = parseFloat(match_lat[3]);
        let direction = match_lat[4];

        let decimal = degrees + (minutes / 60) + (seconds / 3600);
        if (direction === "S" || direction === "W") decimal = -decimal;
        v.push(decimal);

        let match_long = lngDMS.match(dmsRegex);
        if (!match_long) throw new Error("Invalid DMS format for longitude");

        let degrees_one = parseFloat(match_long[1]);
        let minutes_one = parseFloat(match_long[2]);
        let seconds_one = parseFloat(match_long[3]);
        let direction_one = match_long[4];

        let decimal_long = degrees_one + (minutes_one / 60) + (seconds_one / 3600);
        if (direction_one === "S" || direction_one === "W") decimal_long = -decimal_long;
        v.push(decimal_long);

        req.body.lat = v[0];
        req.body.long = v[1];
        setDefaultRatings(req.body);

        const id = await residentialPlotSellModel.addResidentialPlotSell(req.body);
        return res.json({ message: "successful", id });
      }
    } else {
      const apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(req.body.Url) + '&key=' + process.env.GOOGLE_MAPS_API_KEY;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        req.body.lat = location.lat;
        req.body.long = location.lng;
        setDefaultRatings(req.body);

        const id = await residentialPlotSellModel.addResidentialPlotSell(req.body);
        return res.json({ message: "successful", id });
      } else {
        return res.status(404).json({ error: 'Address not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coordinates', details: error.message });
  }
};

exports.getAllResidentialSaleProperties = async (req, res) => {
  try {
    const properties = await residentialPlotSellModel.getAllResidentialPlotsSell();
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

exports.filterResidentialSaleProperties = async (req, res) => {
  try {
    const { state, city, pincode, min, max } = req.body;
    const prop = await residentialPlotSellModel.filterResidentialPlotsSell(state, city, pincode, min, max);
    res.json({ prop });
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter properties' });
  }
};

exports.filterMapSaleResidentialPlots = async (req, res) => {
  try {
    const { address, range } = req.body;
    const regex = /\/place\/([^\/]+)/;
    const match = address.match(regex);

    let userLat, userLng;
    if (match) {
      const placePart = decodeURIComponent(match[1]);
      if (/^\d/.test(placePart)) {
        const matchDMS = address.match(/\/place\/([^/@]+)/);
        if (matchDMS) {
          let ansdf = decodeURIComponent(matchDMS[1]).split("+");
          let latDMS = ansdf[0];
          let lngDMS = ansdf[1];
          let dmsRegex = /(\d+)°(\d+)'([\d.]+)"([NSEW])/;
          let match_lat = latDMS.match(dmsRegex);
          let match_long = lngDMS.match(dmsRegex);
          if (match_lat && match_long) {
            let lat = dmsToDecimal(match_lat);
            let lng = dmsToDecimal(match_long);
            userLat = lat;
            userLng = lng;
          }
        }
      }
    }
    if (userLat === undefined || userLng === undefined) {
      // fallback to geocoding
      const apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=' + process.env.GOOGLE_MAPS_API_KEY;
      const response = await axios.get(apiUrl);
      const data = response.data;
      if (data.results && data.results.length > 0) {
        userLat = data.results[0].geometry.location.lat;
        userLng = data.results[0].geometry.location.lng;
      } else {
        return res.status(404).json({ error: 'Address not found' });
      }
    }

    const properties = await residentialPlotSellModel.getAllResidentialPlotsSell();
    const nearbyProperties = [];
    for (const property of properties) {
      const propertyLat = property.lat;
      const propertyLng = property.long;
      const apiUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?' +
        'origins=' + userLat + ',' + userLng +
        '&destinations=' + propertyLat + ',' + propertyLng +
        '&key=' + process.env.GOOGLE_MAPS_API_KEY +
        '&units=metric';
      const distanceResponse = await axios.get(apiUrl);
      if (
        distanceResponse.data.rows &&
        distanceResponse.data.rows.length > 0 &&
        distanceResponse.data.rows[0].elements &&
        distanceResponse.data.rows[0].elements.length > 0
      ) {
        const distanceElement = distanceResponse.data.rows[0].elements[0];
        if (distanceElement.status === "OK") {
          let distanceInMeters = parseFloat(distanceElement.distance.value);
          let ranged = parseFloat(range);
          if (distanceInMeters <= ranged) {
            nearbyProperties.push(property);
          }
        }
      }
    }
    res.json({ nearbyprop: nearbyProperties });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coordinates' });
  }
};

// Helper function for DMS to decimal conversion
function dmsToDecimal(match) {
  let degrees = parseFloat(match[1]);
  let minutes = parseFloat(match[2]);
  let seconds = parseFloat(match[3]);
  let direction = match[4];
  let decimal = degrees + (minutes / 60) + (seconds / 3600);
  if (direction === "S" || direction === "W") decimal = -decimal;
  return decimal;
}