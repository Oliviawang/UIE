import { getCategoryIds, getMyList, getTrendingList } from '../../api/api';
import { isVisible } from '../../util/is-visible';
import { pubSub } from '../../action/pub-sub';
import { getCurrentCategory, getVisibleChildren, getDistance, slidePrevOrNext } from '../../util/util';
export class BrowseNav {
    constructor(el, store, options){
        this.el = el;
        this.store= store;
        this.pubSub = options.pubSub;
        this.keyboardHandler = this.keyboardHandler.bind(this)
        this.init().then(ids=>{        // initially only load trending list and myList, other categories can be lazy loaded
            this.store.updateShowMap(ids);
            this.render(ids);
            this.bindEvent();
        })
    }
    async keyboardHandler(e){
        e = e || window.event;
        if (e.keyCode == '13') {
            this.pubSub.publish('navigateTo');
            return;
        }
        let isNextExist = false;
        const focusItem =  document.getElementsByClassName('is-focus')[0];
        if (e.keyCode == '38') {
            // up arrow, find last category same pos
            const currCat = getCurrentCategory(focusItem);
            isNextExist = this.goToVerticalSibling(currCat.categoryIdx-1, currCat.visibleIdx);
           
        }
        else if (e.keyCode == '40') {
            // down arrow, find next category same pos
            const currCat = getCurrentCategory(focusItem);
            isNextExist = this.goToVerticalSibling(currCat.categoryIdx+1, currCat.visibleIdx);
        }
        else if (e.keyCode == '37') {
            // left arrow , find previous sibling
            isNextExist = this.goToHorizontalSibling(focusItem.parentElement.previousElementSibling);
            if(isNextExist&&!isVisible(focusItem.parentElement.previousElementSibling, focusItem.parentElement.parentElement)){
                slidePrevOrNext(getDistance(focusItem.parentElement, true), focusItem.parentElement.parentElement, true);
            }
        }
        else if (e.keyCode == '39') {
            // right arrow, find next sibling
            const ids = await this.fecthNextPage(focusItem.parentElement.nextElementSibling, focusItem.parentElement.parentElement);
            this.store.updateShowMap(ids);
            isNextExist = this.goToHorizontalSibling(focusItem.parentElement.nextElementSibling);
            if(isNextExist&&!isVisible(focusItem.parentElement.nextElementSibling, focusItem.parentElement.parentElement)){
                slidePrevOrNext(getDistance(focusItem.parentElement, false), focusItem.parentElement.parentElement, false);
            } 
        }
        if(isNextExist) {
            focusItem.classList.remove('is-focus');
        }
    }
    goToHorizontalSibling (targetNode) {
        if( targetNode && targetNode.tagName === 'LI'){
            const newItem = targetNode.children[0];
            this.setFocus(newItem);
            return true;
        }   
    }
    goToVerticalSibling (categoryIdx, visibleIdx) {
        const newCategory = document.querySelectorAll('.shows-category')[categoryIdx];
        if(newCategory){
             const visibleChildren = getVisibleChildren(newCategory);
             this.setFocus(visibleChildren[visibleIdx].children[0]);
             return true;
        }
    }
    async fecthNextPage (el, targetNode) {
        const categoryIdx = Array.prototype.indexOf.call(document.querySelectorAll('.shows-category'), targetNode)
        let nextPageIds = [];
        if (categoryIdx === 0) {
            if (this.store.myListOffset && el == null) {
                nextPageIds =  await getMyList(this.store);
                this.appendNewShows(targetNode, nextPageIds);
            }
        } else  {
            if (this.store.trendingOffset && el == null) {
                nextPageIds =  await getTrendingList(this.store);
                this.appendNewShows(targetNode, nextPageIds);
            }
        }
        return nextPageIds;
    }
    appendNewShows (targetNode, ids) {
        ids.forEach((v, index)=>{
            targetNode.insertAdjacentHTML( 'beforeend', `<li><img  data-id='${v.videoId}' src='/images/boxart/${v.videoId}.jpg'/></li>` );
        })
    }
    async init () {
        const myList = await getMyList(this.store);
        const trendingList = await getTrendingList(this.store);
        return myList.concat(trendingList);
    }
    render (ids) {
        this.boxContainer = document.createElement('nav');
        this.boxContainer.className = 'nav-list';
        this.el.appendChild(this.boxContainer);
        const myList = ids.map((v, index)=>{
            if(v.category == 'myList'){
                const isFocus = index === 0 ? 'is-focus' : '';
                return `<li><img class='${isFocus}' data-id='${v.videoId}' src='/images/boxart/${v.videoId}.jpg'/></li>`;
            }  
        }).join('');
        const trendingList = ids.map(v=>{
            if(v.category == 'trending'){
                return `<li><img data-id='${v.videoId}' src='/images/boxart/${v.videoId}.jpg'/></li>`;
            }
        }).join('');
        this.boxContainer.innerHTML =  `<h3>My List</h3>
        <ul class="shows-category">
            ${myList}
            </ul>
            <h3>New Releases</h3>
            <ul class="shows-category">${trendingList}</ul>
        `;
        this.setFocus(document.querySelector('.shows-category li img'));
    }
    setFocus(newItem){
        newItem.classList.add('is-focus');
        this.store.updateActiveShow(newItem.dataset.id);
        this.pubSub.publish('update-show')
    }
    bindEvent () {
        document.addEventListener('keydown', this.keyboardHandler)
    }
    destroy() {
        document.removeEventListener('keydown', this.keyboardHandler); 
    }
}