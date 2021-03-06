'use strict';

module.exports = function(bot, you, from, args) {
    var runCommand = function(command, args, shellCommand) {
        var out = bot.connection.send.bind(bot.connection, command);
        //Check if the person issuing the command is authorized to do so
        if ((!bot.usePassword) || (bot.authorized.indexOf(from) > -1 || (!shellCommand && command == 'auth'))) {
            try { //Dynamically fire the appropriate command
                if (!shellCommand) {
                    require('./commands/' + bot.noSpecialChars(command))(bot, from, args.slice(1), out);
                } else {
                    bot.runShellCommand(bot, args, out);
                }
                //Add to command history
                bot.history.push({
                    command: command,
                    args: args.slice(1),
                    raw: args,
                    shellCommand: shellCommand,
                    from: from
                });
            } catch (e) {
                if (e.code === 'MODULE_NOT_FOUND') {
                    out(command + " is not a valid command");
                } else {
                    console.log(e);
                }
            }
        } else {
            out(from.split('!')[0] + ': Unauthorized');
        }
    }
    var recipients = args[0].split(bot.nickSeperator).slice(1);
    //If the command starts with the appropriate delimiter, and it was intended for you, go ahead
    if ((args[0].length > bot.commandPrefix.length) && args[0].startsWith(bot.commandPrefix) && (args[0].indexOf(bot.nickSeperator) == -1 || recipients.indexOf(you) > -1)) {
        var command = args[0].split(bot.nickSeperator)[0].slice(bot.commandPrefix.length).toLowerCase();
        runCommand(command, args, false);
    } else if ((args[0].length > bot.shellPrefix.length) && args[0].startsWith(bot.shellPrefix) && (bot.getInteractiveIndex(bot) != -1)) {
        args[0] = args[0].slice(bot.shellPrefix.length);
        runCommand('SHELL', args, true);
    }
}
