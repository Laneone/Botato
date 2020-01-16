'use strict';

var screenshot = require('screenshot-desktop'),
    fs = require('fs-extra'),
    path = require('path');

module.exports = function(bot, from, args, out) {
    screenshot({format: 'png', filename: 'screenshot.png'}).then((img) => {
        bot.imgur.uploadFile(path.join(bot.path, 'screenshot.png')).then(function(result) {
                out(result.data.link);
                fs.unlink(path.join(bot.path, 'screenshot.png'));
            }).catch(function(err) {
                out('Failed to upload screenshot to imgur: ' + err.message);
            }).catch((err) => {console.log(err)});
    })
}
