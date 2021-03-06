describe('Botato', function() {
    describe('Network Type', function() {
        describe('IRC', function() {
            var bot = {};
            beforeAll(function() {
                bot = require('../../config');
                bot.args = ['irc', 'workfra.me', '6697', 'true', '#workframe', '#bots', '#test'];
                bot.promptForArgs = false;
                bot.connection = new (require('../../NetworkHooks/irc'))(bot, require('../../parse'));
            });
            it('can pass the arguments check on given arguments', function() {
                bot.connection.argumentscheck();
                expect(true).toBe(true);
            });
            it('can connect to the given irc server and channels', function(done) {
                bot.connection.connect();
                var count = 0;
                bot.connection.connection.addListener('join', function(chan) {
                    count += 1;
                    if (count == 3) {
                        expect(true).toBe(true);
                        done();
                    }
                });
            }, 10000);
        });
    });
    describe('Command', function() {
        describe('!ping', function() {
            it('responds with given value', function() {
                require('../../commands/ping')({}, '', ['this', 'is', 'a', 'test'], function(out) {
                    expect(out).toBe('PONG this is a test');
                });
            });
        });
        describe('!auth', function() {
            it('adds a client having the right password to the authorized list', function() {
                var client = 'Test!Bot@D199B241.9A78455E.C6E678A9.IP';
                var bot = {
                    authorized: [],
                    password: 'sup3r s3cr3t passw0rd'
                };
                require('../../commands/auth')(bot, client, ['sup3r', 's3cr3t', 'passw0rd'], function() {});
                expect(bot.authorized.indexOf(client)).not.toBe(-1);
            });
        });
        describe('!address', function() {
            it('contains at least the loopback address', function(done) {
                var output = '';
                require('../../commands/address')({}, '', [], function(text) {
                    output += '\n' + text;
                });
                setTimeout(function() {
                    expect(output.includes('127.0.0.1')).toBe(true);
                    done();
                }, 3000);
            });
        });
        describe('!info', function() {
            it('contains at least the bot\'s version', function(done) {
                var bot = require('../../config');
                var output = '';
                require('../../commands/info')(bot, '', [], function(text) {
                    output += '\n' + text;
                });
                setTimeout(function() {
                    expect(output.includes(bot.version)).toBe(true);
                    done();
                }, 3000);
            });
        });
        describe('!exit', function() {
            it('should use process.exit to quit the bot', function(done) {
                var bot = require('../../config');
                var restore = process.exit;
                process.exit = function(code) {
                    expect(code).toBe(0);
                    process.exit = restore;
                    done();
                };
                require('../../commands/exit')(bot, '', [], function() {});
            });
        });
    });
});
