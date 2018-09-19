export class PubSub {
  constructor() {
    this.messageQueue = {};
  }

  subscribe(message, listener) {
    /*
    Create the message's object if not yet created
    */
    if (!this.messageQueue[message]) this.messageQueue[message] = [];

    /*
    Add the listener to queue
    */
    const index = this.messageQueue[message].push(listener) - 1;

    /*
    Provide handle back for removal of topic
    */
    return {
      remove: () => {
        delete this.messageQueue[message][index];
      },
    };
  }

  publish(message, info) {
    if (!this.messageQueue[message]) return;
    /*
    Cycle through message queue
    */
    this.messageQueue[message].forEach((cb) => {
      cb(info !== undefined ? info : {});
    });
  }
}
