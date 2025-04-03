const { State, City } = require('country-state-city');

/**
 * Fetches all states in the country.
 * It returns a JSON response containing the list of states.
 * The states are filtered to include only those in India (country code 'IN').
 */
exports.getStates = (req, res) => {
    const states = State.getAllStates();
    res.json(states);
};

/**
 * Fetches all cities in a given state.
 * It returns a JSON response containing the list of cities for the specified state code.
 * The state code is passed as a URL parameter.
 * The cities are filtered to include only 
 * those in India (country code 'IN') and the specified state.
 */
exports.getCities = (req, res) => {
    const stateCode = req.params.stateCode;
    const cities = City.getCitiesOfState('IN', stateCode);
    res.json(cities);
};