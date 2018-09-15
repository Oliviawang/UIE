export class PubSub {
    constructor(){
        this.messageQueue = {};
    }
    subscribe (message, listener) {
        // Create the topic's object if not yet created
        if(!this.messageQueue[message]) this.messageQueue[message] = [];
  
        // Add the listener to queue
        var index = this.messageQueue[message].push(listener) -1;
  
        // Provide handle back for removal of topic
        return {
          remove: ()=> {
            delete this.messageQueue[message][index];
          }
        };
      }
      publish (message, info) {
        // If the topic doesn't exist, or there's no listeners in queue, just leave
        if(!this.messageQueue[message]) return;
  
        // Cycle through topics queue, fire!
        this.messageQueue[message].forEach(function(item) {
            item(info != undefined ? info : {});
        });
      }
}