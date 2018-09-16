export function isVisible (el, parent) {
    const clientX = el.getBoundingClientRect().x;
    const clientY = el.getBoundingClientRect().y;
    const parentX = parent.parentElement.getBoundingClientRect().x - 20;
    const parentY = parent.getBoundingClientRect().y + 20;
    return clientX >= parentX && clientY <=parentY
}
export const getVisibleChildIdx= (focusItem) => {
    const visibleIdx = getChildIndex(getVisibleChildren(focusItem.parentElement.parentElement), focusItem.parentElement)
    return visibleIdx;
}
export const getChildIndex = (parent, child)=> {
    return Array.prototype.indexOf.call(parent, child);
}
export const getVisibleChildren = (parent) => {
    return Array.prototype.slice.call(parent.children).filter(v=>isVisible(v, parent))
 }
export const getDistance = (el, isNext) => {
    if (isNext) {
        return el.getBoundingClientRect().x - el.previousElementSibling.getBoundingClientRect().x - 4; 
    } 
    return el.getBoundingClientRect().x - el.previousElementSibling.getBoundingClientRect().x; 
    
}
export const slidePrevOrNext = (gap, targetNode, slideRight) => {
    const oldVal = parseInt(targetNode.style.marginLeft, 10) || 0
    targetNode.style.marginLeft = (oldVal + (slideRight ? gap : -gap)) + 'px'
}
export const appendNewVideos = (targetNode, ids, categoryIdx) => {
    ids.forEach((v, index)=>{
        targetNode.insertAdjacentHTML( 'beforeend', `<li><img  data-id='${v.videoId}' data-category-id='${categoryIdx}' src='/images/boxart/${v.videoId}.jpg'/></li>` );
    })
}
export const goToHorizontalSibling = (targetNode, callback) => {
    if( targetNode && targetNode.tagName === 'LI'){
        const newItem = targetNode.children[0];
        callback(newItem);
        return true;
    }  
    return false; 
}
export const goToVerticalSibling = (categoryIdx, visibleIdx, callback) => {
    const newCategory = document.querySelectorAll('.videos-category')[categoryIdx];
    if(newCategory){
         const visibleChildren = getVisibleChildren(newCategory);
         callback(visibleChildren[visibleIdx].children[0]);
         return true;
    }
    return false; 
}