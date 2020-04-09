// Stores some functions for general help

// Checks if string is a natural number
function isNaturalNumber(s) {
    var n = Math.floor(Number(s));
    return n !== Infinity && String(n) === s && n >= 0;
}

