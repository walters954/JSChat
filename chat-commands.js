/**
 * This file defines console command logic.
 */
module.exports = function(io, session) {
var commands = {
	"nick": {
		numArgs: 1,
		handler: function(args, io, session, player) {
			player.nick = args[0];
			session.players[player.uuid] = player;
			io.sockets.emit('nickname', player.nick);
		}
	},
	"clear": {
		numArgs: 0,
		handler: function(args, io, session, player) {
			session.log[player.currentChat] = "";
			player.socket.emit('clear');
		}
	},
	"help": {
		numArgs: 0,
		handler: function(args, io, session, player) {
			player.socket.emit('message', '/nick <nickname> - change your username\n /clear - clear your chat log.');
		}
	},
	"channel":
	{
		numArgs: 1,
		handler: function(args,io,session,player){
			if (args[0] < session.log.length)
			{
				player.currentChat = args[0];
				player.socket.emit('clear');
				player.socket.emit('message',  session.log[player.currentChat]);
			}
			else
			{
				player.socket.emit('message',  'Incorrect Channel Selection: ' + args[0]);
			}
		}
	},
	"list":
	{
		numArgs: 1,
		handler: function(args,io,session,player){
			channelList = "";

			var arrayLength = session.log.length;


			if (args[0] != null)
			{
				for (var i = 0; i < arrayLength; i++)
				 {
					 var channelName = session.log[i].split(" ");
					 if (channelName[0].indexOf(args[0]) > -1)
					 {
						 channelList += 'Number: ' + i + ' Name: ' +channelName[0] + '\n';
					 }
				 }
				 //Change to show when channel length < 1 to show the entire channel list
				if (channelList.length < 1)
				{
					player.socket.emit('message',  'No channel meets search: ' + args[0]);
				}
				else
				{
					player.socket.emit('message',  channelList);
				}


			}
			else
			{

				for (var i = 0; i < arrayLength; i++)
				 {
					 var channelName = session.log[i].split(" ");
					 channelList += 'Number: ' + i + ' Name: ' +channelName[0] + '\n';
				 }
				player.socket.emit('message',  'Channels: \n' +  channelList);
			}
		}
	},
	"quit": {
		numArgs: 0,
		handler: function(args, io, session, player) {
			io.sockets.emit('message', player.nick + ' has quit...');
			// player.socket.emit('message', player.nick + ' has quit... another message');
			io.sockets.emit('disconnect', '/nick <nickname> - change your username\n /clear - clear your chat log.');
		}
	}
}


var isCommand = function(msg) {
	return (msg.substring(0, 1) == "/");
}

/**
 * Runs a given command.
 * Parses a command into a name and a series of arg tokens.
 * @param  {Object}
 * @param  {String}
 */
var run = function(player, msg) {
	var cmd = msg.substring(1, msg.length);
	var args = cmd.match(/[0-9A-z][a-z]*/g);
	var fun = args.shift();

	commands[fun].handler(args, io, session, player);
}

	return {
		run: run,
		isCommand: isCommand
	}
}
