// Stores some functions for general help
var fs = require('fs');

// Checks if string is a natural number
function isNaturalNumber(s) {
    var n = Math.floor(Number(s));
    return n !== Infinity && String(n) === s && n >= 0;
}
module.exports.isNaturalNumber = isNaturalNumber;

function get_random_file_from_folder(folder) 
{
    fs.readdirSync(folder).forEach(file => {
        console.log(file);
      });

    return "helper.js";
}

module.exports.get_random_file_from_folder = get_random_file_from_folder;
