export class BrowseView {
  constructor(el, store, pubSub) {
    this.el = el;
    this.store = store;
    this.pubSub = pubSub;
    this.render();
  }

  updateDisplayView() {
    this.activeTitleNode.textContent = this.store.activeTitle;
    this.activeImageNode.src = `/images/displayart/${this.store.activeId}.jpg`;
  }

  render() {
    this.displayContainer = document.createElement('main');
    this.el.appendChild(this.displayContainer);
    this.activeTitleNode = document.createElement('h1');
    this.activeImageNode = document.createElement('img');
    this.displayContainer.appendChild(this.activeTitleNode);
    this.displayContainer.appendChild(this.activeImageNode);
    this.videosSubscription = this.pubSub.subscribe('update-video', this.updateDisplayView.bind(this));
  }

  destroy() {
    this.videosSubscription.remove();
  }
}
