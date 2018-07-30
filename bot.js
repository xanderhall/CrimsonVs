var Discord = require('discord.io');
var logger = require('./winstonConfig.js');
var auth = require('./auth.json');

// Initialize Discord Bot
var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

bot.on('ready', function(evt) {
	logger.info('Connected');
	logger.info('Logged in as: ');
	logger.info(bot.username + ' – (' + bot.id + ')');
});

const parseCommand = (user, userID, channelID, message, event) => {
	logger.info(user);
	logger.info(userID);
	logger.info(channelID);
	logger.info(message);
	logger.info(event);
	if (message.substring(0, 1) == '!') {
		var args = message.substring(1).split(' ');
		var cmd = args[0];

		args = args.splice(1);
		switch (cmd) {
			case 'intro':
				bot.sendMessage({
					to: channelID,
					message: 'Greetings! Welcome to the server!'
				});
				break;
		}
	}
};

bot.on('message', parseCommand);
