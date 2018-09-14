import { onNavItemClick } from '../router';
export class DetailsPage {
    constructor (options) {
        this.id = options.videoId
        this.keyboardEvent= this.keyboardEvent.bind(this)
        this.bindEvent();
        this.getDetails(this.id).then(data=>{
            this.dataStore = data;
            this.render(data);
        })
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
    async getDetails (id){
        const videoObj = await fetch('/api/v1/shows/' + id).then(res=>res.json())
        return videoObj;
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
        <nav class="nav-details">
        <ul>
         <li class="is-focus">Play</li>
         <li data-action="back">Back</li>
         <li>Rate</li>
         <li>Episodes</li>
        </ul>
        </nav>
        `
        document.body.innerHTML = content;
    }
    handleEnter (el) {
        if(el.dataset.action === 'back') {
            onNavItemClick('/', this);
        } else {
            alert(el.innerText + ' ' + this.dataStore.title);
        }
       
    }
    destroy(){
        document.removeEventListener('keydown', this.keyboardEvent)
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    }
}