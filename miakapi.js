const Miakapi = require('miakapi');

/** @type {Miakapi.Home} */
let HOME = null;

const handlers = {
  ready: [],
  update: [],
  userLogin: [],
  /** @type {{ handler: () => void, inputID: string }[]} */
  userAction: [],
};

module.exports = (RED) => {
  // Init
  RED.nodes.registerType('init', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.status({ fill: 'yellow', shape: 'dot', text: 'Connection...' });

    HOME = Miakapi(config.home, config.coordID, config.coordSecret);

    HOME.onReady(() => {
      node.status({ fill: 'green', shape: 'dot', text: 'Ready !' });
      handlers.ready.forEach((h) => h());
    });

    HOME.onUpdate((users) => {
      handlers.update.forEach((h) => h(users));
      // node.status({
      //   fill: 'green',
      //   shape: 'dot',
      //   text: `${users.length} users !`,
      // });
    });

    HOME.onUserLogin((event) => {
      handlers.userLogin.forEach((h) => h(event));
      // node.status({
      //   fill: 'green',
      //   shape: 'dot',
      //   text: `[${event.type}] ${event.user.displayName}`,
      // });
    });

    HOME.onUserAction((action) => {
      handlers.userAction
        .filter((h) => h.inputID === action.input.id)
        .forEach((h) => h.handler(action));
      // node.status({
      //   fill: 'green',
      //   shape: 'dot',
      //   text: `[${action.user.displayName}] ${action.type} ${action.input.name || action.input.id}`,
      // });
    });

    node.status({ fill: 'blue', shape: 'dot', text: 'Already connected' });
  });

  // Get users
  RED.nodes.registerType('getUsers', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', (msg) => {
      if (HOME) {
        msg.users = HOME.users;
        node.send(msg);
      } else node.status({ fill: 'red', shape: 'ring', text: 'Not connected' });
    });
  });

  // Commit
  RED.nodes.registerType('commit', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', (msg) => {
      console.log('CONFIG', config);
      console.log('MSG', msg);
      // if (HOME) {
      //   HOME.commit(msg.variables);
      // } else node.status({ fill: 'red', shape: 'ring', text: 'Not connected' });
    });
  });

  // Is in group
  RED.nodes.registerType('isInGroup', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', (msg) => {
      if (HOME) {
        HOME.users.find((id))
      } else node.status({ fill: 'red', shape: 'ring', text: 'Not connected' });
    });
  });

  // Reconnect
  RED.nodes.registerType('reconnect', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', () => {
      if (HOME) HOME.reconnect();
      else node.status({ fill: 'red', shape: 'ring', text: 'Not connected' });
    });
  });
}
