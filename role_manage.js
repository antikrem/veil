// Manages adding roles

var fs = require('fs');

// default name of role file
const ROLE_FILE = "roles.txt";

// Keeps a list of roles that can be added with dm
var roles = [];

// Loads roles from ROLE_FILE, does nothing if no role file can be found
module.exports.loadRoles = function() {
    fs.readFile(ROLE_FILE, function (err, data) {
        if (err) {
            return err;
        }

        roles.push(
            ...data.split(',').map(s => s.trim())
        );
    });
}

// Adds role to given user
// Returns empty string on successs
// Otherwise returns an error
module.exports.addRole = function (message, roleName) {
    if (!roles.includes(roleName)) {
        return "Role not availible. Availible roles can be found with `%roles`.";
    }

    var role = message.guild.roles.find(role => role.name == roleName);
    message.member.addRole(role);
}