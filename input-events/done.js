'use strict';

const { Broadcast, Logger } = require('ranvier');
const PlayerClass = require('../../bundle-example-classes/lib/PlayerClass');


/**
 * Login is done, allow the player to actually execute commands
 */
module.exports = {
  event: state => (socket, args) => {
    let player = args.player;
    player.hydrate(state);

    player.playerClass = PlayerClass.get(player.getMeta('class'));

    // Allow the player class to modify the player (adding attributes, changing default prompt, etc)
    player.playerClass.setupPlayer(state, player);

    player.save();

    player._lastCommandTime = Date.now();

    state.CommandManager.get('look').execute(null, player);

    Broadcast.prompt(player);

    // All that shit done, let them play!
    player.socket.emit('commands', player);

    player.emit('login');
  }
};
