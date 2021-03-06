# veil
> Discord bot for anonymous text/image posting, with moderation.

Node.js bot to make text/image channels anonymous. Each poster will be given a UUID for identification, which cannot be tied to a user. Posts are anonymised for images after fully loaded; text is instant.

## Installation

OS X & Linux:
In a directory containing all js files.
```sh
sudo apt install nodejs
sudo apt install npm 
npm install discord.js
node bot.js
```

Windows:

Follow the Windows equivalent of Linux installation. 

## Usage

1. Create a local file `login_token`, and provide a login key for the bot
2. Edit state.js to contain the dicord usernames of moderators.
3. Start bot, and add to channel by typing `%add`.
4. Mods can ban using `%ban UUID`, where UUID is a user or image id to be banned.

## Release History
* 0.3.2
    * Added error message on invalid dm command
    * Added channels command
* 0.3.1
    * Added help command
    * Added channels command
* 0.3.0
    * Added proxy posting through bot dm
* 0.2.4
    * Refactored message obfuscater to post into other channels
* 0.2.3
    * Styled connection message to be different on reconnect
    * Updated version command
* 0.2.2
    * FIX: Crash on maintenace command
* 0.2.1
    * Added hourly update
    * Added global maintenance message
    * Added version and version query command
* 0.2:
    * Updated console output
* 0.1.1
    * FIX: Messages in other channels being deleted
* 0.1.0:
    * Stable version release

## Meta

Chalinda Rodrigo – chalindarodrigo@gmail.com - [https://github.com/antikrem](https://github.com/antikrem/)

Distributed under the Unlicense.
