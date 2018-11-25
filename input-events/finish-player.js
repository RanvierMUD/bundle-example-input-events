'use strict';

const { Player } = require('ranvier');

/**
 * Finish player creation. Add the character to the account then add the player
 * to the game world
 */
module.exports = {
  event: state => (socket, args) => {
    let player = new Player({
      name: args.name,
      account: args.account,
    });


    // TIP:DefaultAttributes: This is where you can change the default attributes for players
    const defaultAttributes = {
      health: 100,
      strength: 20,
      agility: 20,
      intellect: 20,
      stamina: 20,
      armor: 0,
      critical: 0
    };

    for (const attr in defaultAttributes) {
      player.addAttribute(state.AttributeFactory.create(attr, defaultAttributes[attr]));
    }

    args.account.addCharacter(args.name);
    args.account.save();

    player.setMeta('class', args.playerClass);

    const room = state.RoomManager.startingRoom;
    player.room = room;
    player.save();

    // reload from manager so events are set
    player = state.PlayerManager.loadPlayer(state, player.account, player.name);
    player.socket = socket;

    socket.emit('done', socket, { player });
  }
};
