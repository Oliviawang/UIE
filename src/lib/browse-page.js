import { isVisible } from '../util/is-visible';
export class BrowsePage {
    constructor(){
        this.showsMap = {};
        this.bindEvent();
        this.limit = 5;
        this.getIds().then(ids=>{
            this.updateShowMap(ids);
            this.init(ids);
        })
    }
    async getIds(){
        const ids =  await fetch('/api/v1/shows').then(res=>res.json());   // load one time, with pagination support, UI filter by category
        return ids;
    }
    updateShowMap (ids) {
        this.showsMap = ids.reduce((prev, curr)=>{
            prev[curr.videoId] = curr;
            return prev;
        }, {})
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
    bindEvent (){
        document.addEventListener('keydown', (e)=>{
            e = e || window.event;
            if (e.keyCode == '13') {
                this.setSelected();
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
                isNextExist = this.goToHorizontalSibling(focusItem.parentElement.previousSibling);
                if(isNextExist&&!isVisible(focusItem.parentElement.previousSibling, focusItem.parentElement.parentElement)){
                    this.slidePrevOrNext(focusItem.parentElement.parentElement, true);
                }
            }
            else if (e.keyCode == '39') {
                // right arrow, find next sibling
                isNextExist = this.goToHorizontalSibling(focusItem.parentElement.nextSibling);
                if(isNextExist&&!isVisible(focusItem.parentElement.nextSibling, focusItem.parentElement.parentElement)){
                    this.slidePrevOrNext(focusItem.parentElement.parentElement, false);
                }
               
            }
            if(isNextExist) {
                focusItem.classList.remove('is-focus');
            }
        })

    }
    slidePrevOrNext (targetNode, slideRight) {
        const oldVal = parseInt(targetNode.style.marginLeft) || 0
        targetNode.style.marginLeft = (oldVal + (slideRight ? 20 : -20)) + '%'
    }
    init (ids){
        this.activeId = ids[0].videoId;
        this.activeTitle = ids[0].title;
        this.displayContainer = document.createElement('main');
        document.body.appendChild(this.displayContainer);
        this.boxContainer = document.createElement('nav');
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
        this.setSelected();
        
    }
    setSelected(){
        this.activeTitleNode.textContent = this.activeTitle;
        this.activeImageNode.src = '/images/displayart/'+this.activeId+'.jpg'
    }
    setFocus(newItem){
        newItem.classList.add('is-focus');
        this.activeId = newItem.dataset.id;
        this.activeTitle = this.showsMap[this.activeId].title;
    }
}