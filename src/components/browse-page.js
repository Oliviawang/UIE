import { onNavItemClick } from '../router';
import { PubSub } from '../util/pub-sub';
import { BrowseNav } from './browse-nav';
import { BrowseDataStore } from '../store/browse-data-store';
import { BrowseView } from './browse-view';
export class BrowsePage {
  constructor() {
    onNavItemClick.instance = this;
    this.store = new BrowseDataStore();
    this.pubSub = new PubSub();
  }

  init() {
    this.navigateSubscription = this.pubSub.subscribe('navigateTo', this.navigate.bind(this));
    this.nav = new BrowseNav(document.body, this.store, this.pubSub);
    this.nav.init();
    this.view = new BrowseView(document.body, this.store, this.pubSub);
    this.view.init();
  }

  navigate() {
    onNavItemClick(`/details/${this.store.activeId}`);
  }

  destroy() {
    this.nav.destroy();
    this.view.destroy();
    this.navigateSubscription.remove();
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  }
}
