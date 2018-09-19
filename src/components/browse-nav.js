import { BrowseApi } from '../api/index';
import * as util from '../util/index';
export class BrowseNav {
  constructor(el, store, pubSub) {
    this.el = el;
    this.store = store;
    this.pubSub = pubSub;
    this.keyboardHandler = this.keyboardHandler.bind(this);
    this.ids = [];
    this.contentTmpl = '';
  }

  async init() {
    const categories = await BrowseApi.getVideoCategory();
    this.store.updateCategories(categories);
    await Promise.all(categories.map(async (category) => {
      const videos = await BrowseApi.getVideoList(this.store, category.id);
      this.ids = this.ids.concat(videos);
      this.contentTmpl += util.renderVideosAndCategoriesDom(category, videos);
      return videos;
    }));

    this.store.updateVideoMap(this.ids);
    this.renderDOM();
    this.bindEvent();
  }

  bindEvent() {
    document.addEventListener('keydown', this.keyboardHandler);
  }

  renderDOM() {
    this.boxContainer = document.createElement('nav');
    this.boxContainer.className = 'nav-list';
    this.el.appendChild(this.boxContainer);

    this.boxContainer.innerHTML = this.contentTmpl;
    this.setFocus(document.querySelector('.videos-category li img'));
  }

  async keyboardHandler(e) {
    if (e.keyCode === 13) {
      this.pubSub.publish('navigateTo', 'details');
      return;
    }

    let isNextExist = false;
    const focusItem = document.getElementsByClassName('is-focus')[0];
    const categoryIdx = parseInt(focusItem.dataset.categoryId, 10);
    const visibleIdx = util.getVisibleChildIdx(focusItem);

    if (e.keyCode === 38) {
      // up arrow, find last category same pos
      isNextExist = util.goToVerticalSibling(categoryIdx - 1, visibleIdx, this.setFocus.bind(this));
    } else if (e.keyCode === 40) {
      // down arrow, find next category same pos
      isNextExist = util.goToVerticalSibling(categoryIdx + 1, visibleIdx, this.setFocus.bind(this));
    } else if (e.keyCode === 37) {
      // left arrow , find previous sibling
      isNextExist = util.goToHorizontalSibling(focusItem.parentElement.previousElementSibling,
        this.setFocus.bind(this));
      if (isNextExist && !util.isVisible(focusItem.parentElement.previousElementSibling,
        focusItem.parentElement.parentElement)) {
        util.slidePrevOrNext(util.getDistance(focusItem.parentElement, true),
          focusItem.parentElement.parentElement, true);
      }
    } else if (e.keyCode === 39) {
      // right arrow, find next sibling
      await this.fecthNextPage(categoryIdx, focusItem.parentElement.nextElementSibling,
        focusItem.parentElement.parentElement);

      isNextExist = util.goToHorizontalSibling(focusItem.parentElement.nextElementSibling,
        this.setFocus.bind(this));

      if (isNextExist && !util.isVisible(focusItem.parentElement.nextElementSibling,
        focusItem.parentElement.parentElement)) {
        util.slidePrevOrNext(util.getDistance(focusItem.parentElement, false),
          focusItem.parentElement.parentElement, false);
      }
    }
    if (isNextExist) {
      focusItem.classList.remove('is-focus');
    }
  }

  async fecthNextPage(categoryIdx, el, targetNode) {
    let nextPageIds = [];
    if (this.store.categories[categoryIdx].offset && el == null) {
      nextPageIds = await BrowseApi.getVideoList(this.store, categoryIdx);
      util.appendNewVideos(targetNode, nextPageIds, categoryIdx);
      this.store.updateVideoMap(nextPageIds);
    }
    return nextPageIds;
  }

  setFocus(newItem) {
    newItem.classList.add('is-focus');
    this.store.updateActiveShow(newItem.dataset.id);
    this.pubSub.publish('update-video');
  }

  destroy() {
    document.removeEventListener('keydown', this.keyboardHandler);
  }
}
