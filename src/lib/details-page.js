import { getDetails } from '../api/api';
import { DetailsNav } from './components/details-nav';
import { onNavItemClick } from '../router';
import { PubSub } from '../action/pub-sub';
export class DetailsPage {
    constructor (options) {
        this.id = options.videoId
        getDetails(this.id).then(data=>{
            this.dataStore = data;
            this.render(data);
        })
    }
    navigate () {
        onNavItemClick('/', this);
    }
    render (videoObj){
        const { title, releaseYear, rating, videoId}  = videoObj
        const content = `
        <main>
        <section class="details-header">
        <h1>${title}</h1>
        <span>${releaseYear}</span>
        <span>${rating}</span>
        </section>
        <img src='/images/displayart/${videoId}.jpg' />
        </main>
        `
        document.body.innerHTML = content;
        this.navDom = document.createElement('nav');
        this.navDom.className = 'nav-details';
        document.body.appendChild(this.navDom);
        this.pubSub = new PubSub();
        this.navigateSubscription = this.pubSub.subscribe('navigateTo', this.navigate.bind(this));
        this.nav = new DetailsNav(this.navDom, this.dataStore, {
            pubSub: this.pubSub
        });
    }
    destroy(){
        this.nav.destroy();
        this.navigateSubscription.remove();
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    }
}