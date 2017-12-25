var Random = require("random-js");
var engine = Random.engines.mt19937().autoSeed();

//Generate random integer.
module.exports.getRandomInteger = function() {
    return Random.integer(1000000, 9999999)(engine);
}