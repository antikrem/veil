// Keeps function to return a formatted help string when requested

// List of messages to return on a help request
var HELP_KEY_LOOKUP = {
    "channels": "```DM COMMAND | Usage : %channels \n Lists all channels by index, use with %proxy to post through DMs.```",
    "changeid": "```DM/CHANNEL COMMAND | Usage : %changeid \n Changes your userID.```",
    "version": "```DM/CHANNEL COMMAND | Usage : %version \n Posts current version of veil. Change log available at: https://github.com/antikrem/veil ```",
    "help": "```DM COMMAND | Usage : %help [key] \n Posts information for a keyword (generally a command). Will list all options when invoked with no key ```",
    "proxy": "```DM COMMAND | Usage : %proxy index \n Sets up a channel to post to through DMs. Takes as a parameter the index of the channel (which can be found with %channels) ```"
}

// Generates a message when user asks for help with no keyword
module.exports.getEmptyHelp = function {
    var list = "```Veil: Anonymous posting bot \n Simply post in one of the tagged channels\n Further help can be found with %help keyword; with one of the following: \n";
    for (let [keyword, help] of module.exports.userToUUID) {
        list = list.concat(keyword + "; ")
    }
}

// Returns message to post, given a keyword
// returns false if keyword cannot be found
module.exports.getHelpKeyword = function getHelpKeyword(keyword) {
    if (!HELP_KEY_LOOKUP.has(keyword)) {
        return false;
    }
    else {
        return HELP_KEY_LOOKUP.get(keyword);
    }

}
