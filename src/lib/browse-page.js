import { isVisible } from '../util/is-visible';
import { onNavItemClick } from '../router';
export class BrowsePage {
    constructor(){
        this.showsMap = {};
        this.limit = 5;
        this.LIST_PADDING = 14;
        this.keyboardHandler = this.keyboardHandler.bind(this)
        this.bindEvent();
        this.init().then(ids=>{        // initially only load trending list and myList, other categories can be lazy loaded
            this.updateShowMap(ids);
            this.render(ids);
        })
    }
    async init () {
        const myList = await this.getMyList();
        const trendingList = await this.getTrendingList();
        return myList.concat(trendingList);
    }
    async getMyList () {
        const myListIds =  await fetch('/api/v1/shows',{
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                limit: this.limit * 2,
                offset: this.myListOffset,
                category: 0
            })
          }).then(res=>res.json()); 
          this.myListOffset = myListIds[this.limit] ? myListIds[this.limit].videoId : null
          return myListIds.slice(0, this.limit);
    }
    async getTrendingList () {
        const trendingIds =  await fetch('/api/v1/shows',{
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                limit: this.limit * 2,
                offset: this.trendingOffset,
                category: 1
            })
          }).then(res=>res.json()); 
          this.trendingOffset = trendingIds[this.limit] ? trendingIds[this.limit].videoId : null
          return trendingIds.slice(0, this.limit);
    }
    updateShowMap (ids) {
        this.showsMap = Object.assign(this.showsMap, 
            ids.reduce((prev, curr)=>{
                prev[curr.videoId] = curr;
                return prev;
            }, {})
        )
    }
    getVisibleChildren (parent) {
       return Array.prototype.slice.call(parent.children).filter(v=>isVisible(v, parent))
    }
    getCurrentCategory (focusItem) {
        const visibleIdx = Array.prototype.indexOf.call(this.getVisibleChildren(focusItem.parentElement.parentElement), focusItem.parentElement)
        const categoryIdx = Array.prototype.indexOf.call(document.querySelectorAll('.shows-category'), focusItem.parentElement.parentElement)
        return {
            visibleIdx: visibleIdx,
            categoryIdx: categoryIdx
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
             const visibleChildren = this.getVisibleChildren(newCategory);
             this.setFocus(visibleChildren[visibleIdx].children[0]);
             return true;
        }
    }
    async keyboardHandler(e){
            e = e || window.event;
            if (e.keyCode == '13') {
                onNavItemClick('/details', this, {videoId: this.activeId});
                return;
            }
            let isNextExist = false;
            const focusItem =  document.getElementsByClassName('is-focus')[0];
            if (e.keyCode == '38') {
                // up arrow, find last category same pos
                const currCat = this.getCurrentCategory(focusItem);
                isNextExist = this.goToVerticalSibling(currCat.categoryIdx-1, currCat.visibleIdx);
               
            }
            else if (e.keyCode == '40') {
                // down arrow, find next category same pos
                const currCat = this.getCurrentCategory(focusItem);
                isNextExist = this.goToVerticalSibling(currCat.categoryIdx+1, currCat.visibleIdx);
            }
            else if (e.keyCode == '37') {
                // left arrow , find previous sibling
                isNextExist = this.goToHorizontalSibling(focusItem.parentElement.previousElementSibling);
                if(isNextExist&&!isVisible(focusItem.parentElement.previousElementSibling, focusItem.parentElement.parentElement)){
                    this.slidePrevOrNext(this.getDistance(focusItem.parentElement, true), focusItem.parentElement.parentElement, true);
                }
            }
            else if (e.keyCode == '39') {
                // right arrow, find next sibling
                const ids = await this.fecthNextPage(focusItem.parentElement.nextElementSibling, focusItem.parentElement.parentElement);
                this.updateShowMap(ids);
                isNextExist = this.goToHorizontalSibling(focusItem.parentElement.nextElementSibling);
                if(isNextExist&&!isVisible(focusItem.parentElement.nextElementSibling, focusItem.parentElement.parentElement)){
                        this.slidePrevOrNext(this.getDistance(focusItem.parentElement, false), focusItem.parentElement.parentElement, false);
                } 
            }
            if(isNextExist) {
                focusItem.classList.remove('is-focus');
            }
    }
    bindEvent () {
        document.addEventListener('keydown', this.keyboardHandler)

    }
    getDistance (el, isNext) {
        if (isNext) {
            return  el.getBoundingClientRect().x - el.previousElementSibling.getBoundingClientRect().x - 4; 
        } else {
            return el.getBoundingClientRect().x - el.previousElementSibling.getBoundingClientRect().x; 
        }
    }
    appendNewShows (targetNode, ids) {
        ids.forEach((v, index)=>{
            targetNode.insertAdjacentHTML( 'beforeend', `<li><img  data-id='${v.videoId}' src='/images/boxart/${v.videoId}.jpg'/></li>` );
        })
    }
    async fecthNextPage (el, targetNode) {
        const categoryIdx = Array.prototype.indexOf.call(document.querySelectorAll('.shows-category'), targetNode)
        let nextPageIds = [];
        if (categoryIdx === 0) {
            if (this.myListOffset && el == null) {
                nextPageIds =  await this.getMyList();
                this.appendNewShows(targetNode, nextPageIds);
            }
        } else  {
            if (this.trendingOffset && el == null) {
                nextPageIds =  await this.getTrendingList();
                this.appendNewShows(targetNode, nextPageIds);
            }
        }
        return nextPageIds;
    }
    slidePrevOrNext (gap, targetNode, slideRight) {
        const oldVal = parseInt(targetNode.style.marginLeft) || 0
        console.log(gap);
        targetNode.style.marginLeft = (oldVal + (slideRight ? gap : -gap)) + 'px'
    }
    render (ids){
        this.activeId = ids[0].videoId;
        this.activeTitle = ids[0].title;
        this.displayContainer = document.createElement('main');
        document.body.appendChild(this.displayContainer);
        this.boxContainer = document.createElement('nav');
        this.boxContainer.className = 'nav-list';
        document.body.appendChild(this.boxContainer);
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
        this.activeTitleNode = document.createElement('h1')
        this.activeImageNode = document.createElement('img')
        this.displayContainer.appendChild(this.activeTitleNode);
        this.displayContainer.appendChild(this.activeImageNode);
        this.updateDisplayView();
        
    }
    updateDisplayView(){
        this.activeTitleNode.textContent = this.activeTitle;
        this.activeImageNode.src = '/images/displayart/'+this.activeId+'.jpg'
    }
    setFocus(newItem){
        newItem.classList.add('is-focus');
        this.activeId = newItem.dataset.id;
        this.activeTitle = this.showsMap[this.activeId].title;
        this.updateDisplayView();
    }
    destroy(){
        document.removeEventListener('keydown', this.keyboardHandler); 
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    }
}