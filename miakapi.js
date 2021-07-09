const Miakapi = require('miakapi');
const jsonata = require('jsonata');

/** @type {Miakapi.Home} */
let HOME = null;

const variables = {};

const handlers = {
  ready: [],
  update: [],
  userLogin: [],
  /** @type {{ handler: (action: Miakapi.UserActionEvent) => void, inputID: string }[]} */
  userAction: [],
};

module.exports = (RED) => {
  // Init
  RED.nodes.registerType('initMiakapi', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.status({ fill: 'yellow', shape: 'dot', text: 'Connecting...' });

    HOME = Miakapi(config.home, config.coordID, config.coordSecret);

    HOME.onReady(() => {
      node.status({ fill: 'green', shape: 'dot', text: 'Ready !' });
      handlers.ready.forEach((h) => h());
    });

    HOME.onUpdate((users) => {
      handlers.update.forEach((h) => h(users));
    });

    HOME.onUserLogin((event) => {
      handlers.userLogin.forEach((h) => h(event));
    });

    HOME.onUserAction((action) => {
      handlers.userAction
        .filter((h) => h.inputID === action.input.id)
        .forEach((h) => h.handler(action));
    });
  });

  // Get users
  RED.nodes.registerType('getHomeUsers', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', (msg) => {
      if (HOME) {
        msg.users = HOME.users;
        node.send(msg);
      } else node.status({ fill: 'red', shape: 'ring', text: 'Not connected' });
    });
  });

  // Commit variables
  RED.nodes.registerType('commitVariables', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', (msg) => {
      const globalContext = {}
      node.context().global.keys().forEach((k) => globalContext[k] = node.context().global.get(k));
      const flowContext = {}
      node.context().flow.keys().forEach((k) => flowContext[k] = node.context().flow.get(k));

      const contexts = {
        msg,
        flow: flowContext,
        global: globalContext,
      };

      Object.keys(config.values).forEach((path) => {
        const { type, value } = config.values[path];

        if (type === 'jsonata') {
          variables[path] = jsonata(value || '""').evaluate(contexts) || '';
          return;
        }

        if (type === 'env') {
          variables[path] = process.env[value];
          return;
        }

        variables[path] = value;
      });

      if (HOME) {
        HOME.variables = variables;
        HOME.commit();
        node.status({ fill: 'green', shape: 'dot', text: 'Data sent !' });
      } else node.status({ fill: 'red', shape: 'ring', text: 'Not connected' });
    });
  });

  // On update
  RED.nodes.registerType('onHomeUpdate', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    handlers.update.push((users) => {
      node.send({ users });
      node.status({
        fill: 'green',
        shape: 'dot',
        text: `${users.length} user${users.length > 1 ? 's' : ''} !`,
      });
    });
  });

  // On user login
  RED.nodes.registerType('onUserLogin', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    handlers.userLogin.push((userEvent) => {
      node.send({ userEvent });

      node.status({
        fill: 'green',
        shape: 'dot',
        text: `[${userEvent.user.displayName}] ${userEvent.type}`,
      });
    });
  });

  // On user action
  RED.nodes.registerType('onUserAction', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    handlers.userAction.push({
      inputID: config.inputID,
      handler(userAction) {
        let allowed = false;
        if (config.allowedGroups && config.allowedGroups.length > 0) {
          config.allowedGroups.forEach((g) => {
            if (userAction.user.groups.includes(g)) allowed = true;
          });
        } else allowed = true;

        if (allowed) {
          node.send({ userAction });

          node.status({
            fill: 'green',
            shape: 'dot',
            text: `[${userAction.user.displayName}] ${userAction.type} ${userAction.input.id}`,
          });
        }
      },
    });
  });

    // Send notification
    RED.nodes.registerType('sendPushNotif', function(config) {
      RED.nodes.createNode(this, config);
      const node = this;

      node.on('input', (msg) => {
        if (HOME) {
          const globalContext = {}
          node.context().global.keys().forEach((k) => globalContext[k] = node.context().global.get(k));
          const flowContext = {}
          node.context().flow.keys().forEach((k) => flowContext[k] = node.context().flow.get(k));

          const contexts = {
            msg,
            flow: flowContext,
            global: globalContext,
          };

          const notif = {
            title: jsonata(config.title || '""').evaluate(contexts) || '',
            body: jsonata(config.body || '""').evaluate(contexts) || '',
            image: jsonata(config.image || '""').evaluate(contexts) || '',
            tag: config.tag || '',
          };

          console.log('notif', notif);

          const users = HOME.users.filter((u) => (
            u.notifications
            && (!config.adminOnly || u.isAdmin)
            && (!config.group || u.groups.includes(config.group))
          ));

          users.forEach((u) => u.sendPush(notif));

          node.status({ fill: 'green', shape: 'dot', text: `Sent to ${users.length} user${users.length > 1 ? 's' : ''}` });
        } else node.status({ fill: 'red', shape: 'ring', text: 'Not connected' });
      });
    });

  // Reconnect miakapi
  RED.nodes.registerType('reconnectMiakapi', function(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', () => {
      if (HOME) HOME.reconnect();
      else node.status({ fill: 'red', shape: 'ring', text: 'Not connected' });
    });
  });
}
