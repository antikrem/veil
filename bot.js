
// Stores the state of the bot, including lists of channels, banend users, e.g.
var state = require("./state");

// Import version number
var version = require("./version");

// Import version number
var helper = require("./helper");

// Import help dialogue
var help_dialogue = require("./help_dialogue");

// Import role_management module
var role_manage = require("./role_manage")

// Import discord api
const { Client, MessageAttachment } = require('discord.js')

// Functional components

// Obfuscates a given message, deleting the original
// Message is the original message to be obfuscated
// Channel is the channel to post the obfuscated message
// if delete is true, the message will be deleted
function obfuscateMessage(message, channel, deleteMessage) {
    var embeds = message.embeds;
    var attachments = message.attachments.array();

    console.log("\nObfuscation Begins:")
    console.log("attachments: " + message.attachments.size)
    
    var textBody = "";

    // Handle message content, storing in textBody
    if (message.content != "") {
       // If there is no user id, then create one
       if ( !(state.userToUUID.has(message.author.id)) ) {
            state.userToUUID.set(message.author.id, state.generateUUID())
        }

        //post a message of text
        textBody = "`UserID: " + state.userToUUID.get(message.author.id) +'`\n'
                 + message.content;
    }    

    // Handle attachments  
    var attachmentUrls = attachments.map(m => m.url);
    
    var imagePromise = null;

    // Post each image, which requires image urls to be valid
    for (var i = 0; i < attachmentUrls.length; i++) {
        var UUID = state.generateUUID();
        state.imageUUIDToPoster.set(UUID, message.author.id);
        imagePromise = channel.send("`ID: " + UUID + "`\n", {file: attachmentUrls[i]});
        console.log("Image posted");
        console.log("Image " + (i+1) + " of " + attachments.length + " posted by [REDACTED]")
    }

    // Delete message if delete is true
    if (!deleteMessage) {
        // Pass
    }
    else if (imagePromise) {
        // If theres an image promise, require
        // waiting for image post before deleting
        imagePromise.then(
            function(value) {
                message.delete();
            }
        );
    }
    else {
        message.delete();
    }
    
    // If there is a some text to post, send it
    if (textBody != "") {
        channel.send(textBody);
        console.log(textBody)
    }   
}

// Writes a message to all active channels
function writeMessageToAllChannels(messageString) {
    for (var i = 0; i < state.activeChannels.length; i++) {
        // Try to get the channel via id
        client.channels.get(state.activeChannels[i]).send(messageString);
    }
}

// Handles a command message posted in a channel
function handleChannelCommand(message) {
    let args = message.content.substr(1).split(" ");
    let cmd = args[0].toLowerCase();
    let prm = args.slice(1);
    let isMod = state.isUserMod(message.author);
    
    console.log("Cmd recieved: " + args);
    console.log("idMod?: " + isMod);
    
    switch (cmd) {
        case "add" :
            state.addChannel(message.channel);
            message.channel.send("The veil covers this channel")
            break;

        case "changeid" :
            state.resetID(message.author);
            break;

        case "changeallids" :
            state.resetAllID();
            break;

        case "ban" :
            if (prm.length > 0 && isMod) {
                if (state.banUser(prm[0])) {
                    message.channel.send("User has been banned from posting");
                } else {
                    message.channel.send("UUID not found");
                }
            }
            break;

        case "bandump" :
            state.dumpAllBans();        
            break;

        case "maintenance":
            writeMessageToAllChannels("Veil will be down for maintenance");
            break;

        case "version":
            message.channel.send("veil ultra: version: " + version.VERSION_RELEASE + "." + version.VERSION_MAJOR + "." + version.VERSION_MINOR)
            break;
    }

    message.delete();
}

// Small dialogue to be sent when requesting a channel
function postAllProxyChannels(message) {
    message.channel.send("Select a channel to post with `%proxy [index]`, choosing index:");
    for (var i = 0; i < state.activeChannels.length; i++) {
        message.channel.send("`" + i + "` : `" + client.channels.get(state.activeChannels[i]).name + "`");
    }
}

// Handles a non-command dm to the bot
function handleNonCommandDM(message) {
    let proxyChannel = state.getUsersProxyChannel(message.author.id);

    if (proxyChannel) {
        obfuscateMessage(message, client.channels.get(proxyChannel), false);
    }
    else {
        postAllProxyChannels(message);
    }
}

// Handles a dm command meesage to the bot
function handleCommandDM(message) {
    let args = message.content.substr(1).split(" ");
    let cmd = args[0].toLowerCase();
    let prm = args.slice(1);
    let isMod = state.isUserMod(message.author);

    console.log("DM Cmd recieved: " + args);
    console.log("idMod?: " + isMod);

    switch (cmd) {
        case "proxy":
            if (args.length == 2 && helper.isNaturalNumber(args[1]) && Number(args[1]) < state.activeChannels.length) {
                state.usersProxyChannel.set(message.author.id, state.activeChannels[Number(args[1])]);
                message.channel.send("Selection made: All posts here will be mirrored to selected challenge");
            }
            else {
                message.channel.send("Invalid selection, use `%help proxy` for more info");
            }
            break;

        case "changeid":
            state.resetID(message.author);
            break;

        case "changeallids":
            state.resetAllID();
            break;

        case "maintenance":
            writeMessageToAllChannels("Veil will be down for maintenance");
            break;

        case "channels":
            postAllProxyChannels(message);
            break;

        case "roles":
            message.channel.send(role_manage.getRoles());
            break;

        case "getrole":
            if (args.length == 2) {
                message.channel.send(role_manage.addRole(message, args[1]));
            }
                
            break;

        case "help":
            var messageString = "";
            if (args.length == 2) {
                messageString = help_dialogue.getHelpKeyword(args[1])
            }
            else {
                messageString = help_dialogue.getEmptyHelp()
            }

            if (messageString) {
                message.channel.send(messageString);
            }

            break;

        case "version":
            message.channel.send("veil ultra: version: " + version.VERSION_RELEASE + "." + version.VERSION_MAJOR + "." + version.VERSION_MINOR)
            break;
    }
}

// Hourly state update
function executeHourStateUpdate() {
    var currentHour = state.incrementHour();
    if (currentHour % state.resetTime == 0) {
        state.resetAllID();
        console.log("All IDs have been reset");
    } 
}

// Event Handlers
const client = new Client()

// General event handler
client.on('message', (message) => {
    // Catch self message case, a simple parrot and leave
    if (message.author == client.user) {
    }

    // Server text channel messages will be treated as expected
    else if (message.channel.type == 'text') {
        // Handle banned user
        if (state.isUserBanned(message.author.id)) {
            message.author.send("You have been banned, and your message deleted");
            message.delete();
        }
        //otherwise handle commands and messages differently
        else {
            if (message.content.startsWith(state.cmdToken)) {
                handleChannelCommand(message);
            }
            else if (state.isChannelActive(message.channel)) {
                if (state.isUserBanned(message.author)) {
                    if (message.author.dmChannel) {
                        message.author.dmChannel.send("You have been banned from using the veil")
                    }
                    message.delete();
                } 
                else {
                    obfuscateMessage(message, message.channel, true);
                }
                
            }
            
        }
        
    }  
    // Dm channels are managed different
    else if (message.channel.type == 'dm') {
        // Handle banned user
        if (message.content.startsWith(state.cmdToken)) {
            handleCommandDM(message);
        }
        else {
            handleNonCommandDM(message);
        }


    }  
})

// Handles first load in
client.on('ready', () => {
    
    if (state.isFirstConnect()) {
        console.clear();
        console.log("Connected as " + client.user.tag + "\n");
    } else {
        console.log("Reconnected as " + client.user.tag + "\n");
    }
    
})

// Handles an error event, usually
// a small disconnect or internet interrupt
client.on('error', () => {
    console.log("An error event has occured\n");
})

// Executer for hourly update
setInterval(
    executeHourStateUpdate,
    // Length of hour in milliseconds
    60 * 60 * 1000
);

role_manage.loadRoles();

client.login(state.getLoginToken())