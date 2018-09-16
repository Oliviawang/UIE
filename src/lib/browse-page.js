import { onNavItemClick } from '../router';
import { PubSub } from '../action/index';
import { BrowseNav } from './components/browse-nav';
import { BrowseDataStore } from './store/browse-data-store'
import { BrowseView } from './components/browse-view'
export class BrowsePage {
    constructor(){
        this.render();
        onNavItemClick.instance = this;
    }
    navigate () {
        onNavItemClick('/details/' + this.store.activeId);
    }
    render (){
        this.store = new BrowseDataStore();
        this.pubSub = new PubSub();
        this.navigateSubscription = this.pubSub.subscribe('navigateTo', this.navigate.bind(this));
        this.nav = new BrowseNav(document.body, this.store, {
            pubSub: this.pubSub
        });
        this.view = new BrowseView(document.body, this.store, this.pubSub)
    }

    destroy(){
        this.nav.destroy();
        this.view.destroy();
        this.navigateSubscription.remove();
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    }
}