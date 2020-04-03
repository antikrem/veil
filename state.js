/* Contains the "state" of the bot
 * Which is a collections of conatiners
 * with information on users, chanells, etc 
 * Also includes some features that are hard coded in
 */

var fs = require('fs');

// Boolean value used to stop later connects clearing
module.exports.firstConnect = true;

// Returns if this is the first connect
function isFirstConnect() {
    var oldValue = module.exports.firstConnect;
    module.exports.firstConnect = false;
    return oldValue;
}

module.exports.isFirstConnect = isFirstConnect;

// Token for commands
module.exports.cmdToken = '%'

// Array of active channels
module.exports.activeChannels = []

// Array of bans
module.exports.bannedUsers = []

// A list of signitures associated with admins:
module.exports.mods = ["chally#4215", "ehryus#2741", "Lewen#8592"]

// Ties a uuid of image post to user id
module.exports.imageUUIDToPoster = new Map();

// Ties a user id to UUID
module.exports.userToUUID = new Map();

// Generates a UUID, of 8 random letters (case-sensitive)
function generateUUID() {
    var UUID = "";
    for (var i = 0; i < 8; i++) {
        if (Math.random() < 0.5) {
            UUID += String.fromCharCode(Math.floor(Math.random()*25+65));
        } 
        else {
            UUID += String.fromCharCode(Math.floor(Math.random()*25+97));
        }
    }    
    return UUID;
}

module.exports.generateUUID = generateUUID;

const tokenFile = './login_token'
// Gets the token for logging in
function getLoginToken() {
    try {
        var file = fs.readFileSync(tokenFile);
        return file.toString();
    } catch {
        console.log("Error: no token file found, expected a file \"" + tokenFile + "\" with token for use");
        process.exit(1);
    }
}

module.exports.getLoginToken = getLoginToken;

// Returns true is channel is active
function isChannelActive(channel) {
    return module.exports.activeChannels.includes(channel.id);
}

module.exports.isChannelActive = isChannelActive;

// Adds current channel into activeChannels
// No effect is already in active channel
function addChannel(channel) {
    if (!module.exports.activeChannels.includes(channel.id)) {
        module.exports.activeChannels.push(channel.id);
    }
}

module.exports.addChannel = addChannel;

// Returns a unique signiture for each person
function getSig(user) {
    return user.username+'#'+user.discriminator
}

module.exports.getSig = getSig;

// Returns true if user is banned
function isUserBanned(user) {
    return module.exports.bannedUsers.includes(user.id);
}

module.exports.isUserBanned = isUserBanned;

// tries to ban a user by uuid, return false on failure
function banUser(uuid) {
    // Check image posters
    if (module.exports.imageUUIDToPoster.has(uuid)) {
        module.exports.bannedUsers.push(module.exports.imageUUIDToPoster.get(uuid))
        return true;
    }

    // Check text users
    for (let [n, id] of module.exports.userToUUID) {
        if (id == uuid) {
            module.exports.bannedUsers.push(n)
            return true;
        }
     }
    
    return false;
}

module.exports.banUser = banUser;

// Returns true if user is a mod
function isUserMod(user) {
    return module.exports.mods.includes(getSig(user));
}

module.exports.isUserMod = isUserMod;

// Resets a users UUID
function resetID(user) {
    module.exports.userToUUID.set(user.id, generateUUID())
}

module.exports.resetID = resetID;

// Resets all UUID 
function resetAllID() {
    for (let [user, id] of module.exports.userToUUID) {
        module.exports.userToUUID.set(user, generateUUID())    
    }
}

module.exports.resetAllID = resetAllID;

// Dump all banned id
function dumpAllBans() {
    for (let i = 0; i < module.exports.bannedUsers.length; i++) {
        console.log(module.exports.bannedUsers.length[i])
    }   
}

module.exports.dumpAllBans = dumpAllBans;

// Timing system

// Keeps a timer of number of hours since start of bot
module.exports.hoursPassed = 0;

// Reset time in hours
module.exports.resetTime = 24;

// Increments and returns new hour passed
function incrementHour() {
    module.exports.hoursPassed++;
    return module.exports.hoursPassed;
}

module.exports.incrementHour = incrementHour;