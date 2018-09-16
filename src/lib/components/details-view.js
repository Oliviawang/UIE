export class DetailsView {
    constructor(el, store){
        this.el = el
        this.store = store
        this.render();
    }
    render() {
        const { title, releaseYear, rating, videoId} = this.store
        const content = `
        <section class="details-header">
        <h1>${title}</h1>
        <span>${releaseYear}</span>
        <span>${rating}</span>
        </section>
        <img src='/images/displayart/${videoId}.jpg' />
        `
        this.el.innerHTML = content;
    }
}