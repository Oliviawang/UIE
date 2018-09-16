import { getDetails } from '../api/index';
import { DetailsNav } from './components/details-nav';
import { onNavItemClick } from '../router';
import { PubSub } from '../action/index';
import { DetailsView } from './components/details-view';
export class DetailsPage {
  constructor(id) {
    this.id = id;
    onNavItemClick.instance = this;
    this.init();
  }

  async init() {
    const data = await getDetails(this.id);
    this.dataStore = data;
    this.render();
  }

  navigate() {
    onNavItemClick('/', this.id);
  }

  render() {
    this.viewDom = document.createElement('main');
    this.navDom = document.createElement('nav');
    this.navDom.className = 'nav-details';
    document.body.appendChild(this.viewDom);
    document.body.appendChild(this.navDom);
    this.pubSub = new PubSub();
    this.navigateSubscription = this.pubSub.subscribe('navigateTo', this.navigate.bind(this));
    this.nav = new DetailsNav(this.navDom, this.dataStore, {
      pubSub: this.pubSub,
    });
    this.view = new DetailsView(this.viewDom, this.dataStore);
  }

  destroy() {
    this.nav.destroy();
    this.navigateSubscription.remove();
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  }
}
