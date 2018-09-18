export class BrowseView {
  constructor(el, store, pubSub) {
    this.el = el;
    this.store = store;
    this.pubSub = pubSub;
  }

  init() {
    this.renderDOM();
    this.videosSubscription = this.pubSub.subscribe('update-video', this.updateDisplayView.bind(this));
  }

  renderDOM() {
    this.displayContainer = document.createElement('main');
    this.el.appendChild(this.displayContainer);
    this.activeTitleNode = document.createElement('h1');
    this.activeImageNode = document.createElement('img');
    this.displayContainer.appendChild(this.activeTitleNode);
    this.displayContainer.appendChild(this.activeImageNode);
  }

  updateDisplayView() {
    this.activeTitleNode.textContent = this.store.activeTitle;
    this.activeImageNode.src = `/images/displayart/${this.store.activeId}.jpg`;
  }

  destroy() {
    this.videosSubscription.remove();
  }
}
