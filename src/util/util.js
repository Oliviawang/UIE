import { isVisible } from '../util/is-visible';
export const  getCurrentCategory = (focusItem) => {
    const visibleIdx = Array.prototype.indexOf.call(getVisibleChildren(focusItem.parentElement.parentElement), focusItem.parentElement)
    const categoryIdx = Array.prototype.indexOf.call(document.querySelectorAll('.shows-category'), focusItem.parentElement.parentElement)
    return {
        visibleIdx: visibleIdx,
        categoryIdx: categoryIdx
    }
}
export const getVisibleChildren = (parent) => {
    return Array.prototype.slice.call(parent.children).filter(v=>isVisible(v, parent))
 }
export const getDistance  = (el, isNext) => {
    if (isNext) {
        return  el.getBoundingClientRect().x - el.previousElementSibling.getBoundingClientRect().x - 4; 
    } else {
        return el.getBoundingClientRect().x - el.previousElementSibling.getBoundingClientRect().x; 
    }
}
export const slidePrevOrNext = (gap, targetNode, slideRight) => {
    const oldVal = parseInt(targetNode.style.marginLeft) || 0
    targetNode.style.marginLeft = (oldVal + (slideRight ? gap : -gap)) + 'px'
}