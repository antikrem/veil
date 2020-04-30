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
// Returns string with message of success
module.exports.addRole = function (message, roleName) {
    if (!roles.includes(roleName)) {
        return "Role not availible. Availible roles can be found with `%roles`";
    }

    var role = message.guild.roles.find(role => role.name == roleName);
    message.member.addRole(role);
    return "Role has been added";
}

// Returns a list of roles as a message
module.exports.getRoles = function () {
    var text = "Get a role with `%getrole role`, choosing a role from:\n";
    for (var i = 0; i < roles.Length; i++) {
        text = text + "`" + roles[i] + "`; "; 
    }
    return text;
}