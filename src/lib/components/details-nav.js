
import { onNavItemClick } from '../../router';
export class DetailsNav {
    constructor(el, store, options){
        this.el= el;
        this.store= store;
        this.pubSub = options.pubSub;
        this.keyboardEvent= this.keyboardEvent.bind(this)
        this.bindEvent();
        this.render();
    }
    render (){
        this.el.innerHTML =  `
        <ul>
         <li class="is-focus">Play</li>
         <li data-action="back">Back</li>
         <li>Rate</li>
         <li>Episodes</li>
        </ul>`

    }
    keyboardEvent (e) {
        e.stopImmediatePropagation();
        e = e || window.event;
        const focusItem =  document.getElementsByClassName('is-focus')[0];
        if (e.keyCode == '13') {
            this.handleEnter(focusItem);
            return;
        }
        let isNextExist = false;
        if (e.keyCode == '38') {
           if(focusItem.previousElementSibling){
               isNextExist = true;
               this.setFocus(focusItem.previousElementSibling);
           }
        }
        else if (e.keyCode == '40') {
           if (focusItem.nextElementSibling){
            isNextExist = true;
            this.setFocus(focusItem.nextElementSibling);
           }
        }
        
        if(isNextExist) {
            focusItem.classList.remove('is-focus');
        }
    
    }
    bindEvent () {
        document.addEventListener('keydown', this.keyboardEvent)
    }
    setFocus (el) {
        el.classList.add('is-focus');
    }
    handleEnter (el) {
        if(el.dataset.action === 'back') {
            this.pubSub.publish('navigateTo');
        } else {
            alert(el.innerText + ' ' + this.store.title);
        }
    }
    destroy() {
        document.removeEventListener('keydown', this.keyboardEvent); 
    }
}