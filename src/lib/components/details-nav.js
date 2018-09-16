
export class DetailsNav {
    constructor(el, store, options){
        this.el= el;
        this.store= store;
        this.pubSub = options.pubSub;
        this.keyboardHandler= this.keyboardHandler.bind(this)
        this.bindEvent();
        this.render();
    }

    keyboardHandler (e) {
        e.stopImmediatePropagation();
        const focusItem = document.getElementsByClassName('is-focus')[0];
        if (e.keyCode === 13) {
            this.handleEnter(focusItem);
            return;
        }
        let isNextExist = false;
        if (e.keyCode === 38) {
           if(focusItem.previousElementSibling){
               isNextExist = true;
               focusItem.previousElementSibling.classList.add('is-focus');
           }
        }
        else if (e.keyCode === 40) {
           if (focusItem.nextElementSibling){
                isNextExist = true;
                focusItem.nextElementSibling.classList.add('is-focus');
           }
        }
        
        if(isNextExist) {
            focusItem.classList.remove('is-focus');
        }
    }

    handleEnter (el) {
        if(el.dataset.action === 'back') {
            this.pubSub.publish('navigateTo');
        } else {
            alert(el.innerText + ' ' + this.store.title);
        }
    }

    bindEvent () {
        document.addEventListener('keydown', this.keyboardHandler)
    }
  
    render (){
        this.el.innerHTML = `
        <ul>
         <li class="is-focus">Play</li>
         <li data-action="back">Back</li>
         <li>Rate</li>
         <li>Episodes</li>
        </ul>`
    }

    destroy() {
        document.removeEventListener('keydown', this.keyboardHandler); 
    }
}