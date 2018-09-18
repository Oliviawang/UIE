import { getDetails } from '../api/index';
import { DetailsNav } from './details-nav';
import { onNavItemClick } from '../router';
import { PubSub } from '../util/pub-sub';
import { DetailsView } from './details-view';
export class DetailsPage {
  constructor(id) {
    this.id = id;
    this.pubSub = new PubSub();
    onNavItemClick.instance = this;
  }

  async init() {
    const data = await getDetails(this.id);
    this.dataStore = data;
    this.renderDOM();
  }

  renderDOM() {
    this.viewDom = document.createElement('main');
    this.navDom = document.createElement('nav');
    this.navDom.className = 'nav-details';
    document.body.appendChild(this.viewDom);
    document.body.appendChild(this.navDom);
    this.navigateSubscription = this.pubSub.subscribe('navigateTo', this.navigate.bind(this));
    this.nav = new DetailsNav(this.navDom, this.dataStore, this.pubSub);
    this.nav.init();
    this.view = new DetailsView(this.viewDom, this.dataStore);
    this.view.init();
  }

  navigate() {
    onNavItemClick('/', this.id);
  }

  destroy() {
    this.nav.destroy();
    this.navigateSubscription.remove();
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  }
}
