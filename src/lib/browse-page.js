import { onNavItemClick } from '../router';
import { PubSub } from '../action/pub-sub';
import { BrowseNav } from './components/browse-nav';
import { BrowseDataStore } from './store/browse-data-store'
export class BrowsePage {
    constructor(){
        this.render();
    }
    navigate () {
        onNavItemClick('/details', this, {videoId: this.store.activeId});
    }
    render (ids){
        this.displayContainer = document.createElement('main');
        document.body.appendChild(this.displayContainer);
        this.activeTitleNode = document.createElement('h1')
        this.activeImageNode = document.createElement('img')
        this.displayContainer.appendChild(this.activeTitleNode);
        this.displayContainer.appendChild(this.activeImageNode);

        this.store = new BrowseDataStore();
        this.pubSub = new PubSub();
        this.showSubscription = this.pubSub.subscribe('update-show', this.updateDisplayView.bind(this));
        this.navigateSubscription = this.pubSub.subscribe('navigateTo', this.navigate.bind(this));
        this.nav = new BrowseNav(document.body, this.store, {
            pubSub: this.pubSub
        });
        
    }
    updateDisplayView(){
        this.activeTitleNode.textContent = this.store.activeTitle;
        this.activeImageNode.src = '/images/displayart/'+this.store.activeId+'.jpg'
    }
    destroy(){
        this.nav.destroy();
        this.showSubscription.remove();
        this.navigateSubscription.remove();
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    }
}