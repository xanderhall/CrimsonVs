const Discord = require('discord.js');
const auth = require('./auth.json');

const bot = new Discord.Client({
    autorun: true,
    token: auth.token,
});

const help = new Map([
    ['force', 'A card that uses the term "force" indicates an effect that overrides the usual flow of the game. If both Generals have forced effects that conflict, they cancel each other out.'],
    ['nullify', 'This keyword indicates that the effect specified by the card is nullified, as well any effects that would normally occur as a result.'],
]);

bot.on('ready', () => {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', (user, userID, channelID, message, event) => {
    if (message === 'ping') {
        bot.sendMessage({
            to: channelID,
            message: 'pong',
        });
    }
    // Command
    if (message.startsWith('!')) {
        if (message.startsWith('!help')) {
            const topic = message.split(' ')[1].toLowerCase();
            if (help.has(topic)) {
                bot.sendMessage({
                    to: channelID,
                    message: help.get(topic),
                });
            } else {
                bot.sendMessage({
                    to: channelID,
                    message: `No help available for ${topic}`,
                });
            }
        }
    }
});
