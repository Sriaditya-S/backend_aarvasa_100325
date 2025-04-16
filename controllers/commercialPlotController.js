const axios = require('axios');
const commercialPlotModel = require('../models/commercialPlotModel');

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

exports.postSaleCommercialPlots = async (req, res) => {
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

        const id = await commercialPlotModel.addCommercialPlot(req.body);
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

        const id = await commercialPlotModel.addCommercialPlot(req.body);
        return res.json({ message: "successful", id });
      } else {
        return res.status(404).json({ error: 'Address not found' });
      }
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    res.status(500).json({ error: 'Failed to fetch coordinates', details: error.message });
  }
};