export class BrowseDataStore {
  constructor() {
    this.videosMap = {};
    this.limit = 5;
    this.categories = {};
    this.activeId = null;
    this.activeTitle = '';
  }

  updateVideoMap(ids) {
    ids.reduce((prev, curr) => {
      prev[curr.videoId] = curr;
      return prev;
    }, this.videosMap);
  }

  updateCategories(arr) {
    arr.forEach((item) => {
      this.categories[item.id] = item;
    });
  }

  updateActiveShow(id) {
    this.activeId = id;
    this.activeTitle = this.videosMap[this.activeId].title;
  }
}
