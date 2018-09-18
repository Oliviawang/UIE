export class DetailsNav {
  constructor(el, store, pubSub) {
    this.el = el;
    this.store = store;
    this.pubSub = pubSub;
    this.keyboardHandler = this.keyboardHandler.bind(this);
  }

  init() {
    this.bindEvent();
    this.renderDOM();
  }

  bindEvent() {
    document.addEventListener('keydown', this.keyboardHandler);
  }

  renderDOM() {
    this.el.innerHTML = `
        <ul>
         <li class="is-focus">Play</li>
         <li data-action="back">Back</li>
         <li>Rate</li>
         <li>Episodes</li>
        </ul>`;
  }

  keyboardHandler(e) {
    e.stopImmediatePropagation();
    const focusItem = document.getElementsByClassName('is-focus')[0];
    if (e.keyCode === 13) {
      this.handleEnter(focusItem);
      return;
    }
    let isNextExist = false;
    if (e.keyCode === 38) {
      if (focusItem.previousElementSibling) {
        isNextExist = true;
        focusItem.previousElementSibling.classList.add('is-focus');
      }
    } else if (e.keyCode === 40) {
      if (focusItem.nextElementSibling) {
        isNextExist = true;
        focusItem.nextElementSibling.classList.add('is-focus');
      }
    }

    if (isNextExist) {
      focusItem.classList.remove('is-focus');
    }
  }

  handleEnter(el) {
    if (el.dataset.action === 'back') {
      this.pubSub.publish('navigateTo');
    } else {
      alert(`${el.innerText}  ${this.store.title}`);
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.keyboardHandler);
  }
}
