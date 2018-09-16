import { getVideoCategory, getVideoList } from '../../api/index';
import { pubSub } from '../../action/index';
import * as util from '../../util/index';
export class BrowseNav {
  constructor(el, store, options) {
    this.el = el;
    this.store = store;
    this.pubSub = options.pubSub;
    this.keyboardHandler = this.keyboardHandler.bind(this);
    this.ids = [];
    this.contentTmpl = '';
    this.init();
  }

  async init() {
    const categories = await getVideoCategory();
    this.store.updateCategories(categories);
    await Promise.all(categories.map(async (category) => {
      const videos = await getVideoList(this.store, category.id);
      this.ids = this.ids.concat(videos);
      this.renderTmpl(videos, category);
      return videos;
    }));

    this.store.updateVideoMap(this.ids);
    this.render();
    this.bindEvent();
  }

  async keyboardHandler(e) {
    if (e.keyCode === 13) {
      this.pubSub.publish('navigateTo');
      return;
    }
    let isNextExist = false;
    const focusItem = document.getElementsByClassName('is-focus')[0];
    const categoryIdx = parseInt(focusItem.dataset.categoryId, 10);
    if (e.keyCode === 38) {
      // up arrow, find last category same pos
      const visibleIdx = util.getVisibleChildIdx(focusItem);
      isNextExist = util.goToVerticalSibling(categoryIdx - 1, visibleIdx, this.setFocus.bind(this));
    } else if (e.keyCode === 40) {
      // down arrow, find next category same pos
      const visibleIdx = util.getVisibleChildIdx(focusItem);
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
      const ids = await this.fecthNextPage(categoryIdx, focusItem.parentElement.nextElementSibling,
        focusItem.parentElement.parentElement);
      this.store.updateVideoMap(ids);
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
      nextPageIds = await getVideoList(this.store, categoryIdx);
      util.appendNewVideos(targetNode, nextPageIds, categoryIdx);
    }
    return nextPageIds;
  }

  setFocus(newItem) {
    newItem.classList.add('is-focus');
    this.store.updateActiveShow(newItem.dataset.id);
    this.pubSub.publish('update-video');
  }

  bindEvent() {
    document.addEventListener('keydown', this.keyboardHandler);
  }

  renderTmpl(videos, category) {
    this.contentTmpl += `<h3>${category.title}</h3><ul class='videos-category'>`;
    const list = videos.map((v, index) => `<li><img data-id='${v.videoId}' data-category-id='${category.id}' src='/images/boxart/${v.videoId}.jpg'/></li>`).join('');
    this.contentTmpl += `${list}</ul>`;
  }

  render() {
    this.boxContainer = document.createElement('nav');
    this.boxContainer.className = 'nav-list';
    this.el.appendChild(this.boxContainer);

    this.boxContainer.innerHTML = this.contentTmpl;
    this.setFocus(document.querySelector('.videos-category li img'));
  }

  destroy() {
    document.removeEventListener('keydown', this.keyboardHandler);
  }
}
