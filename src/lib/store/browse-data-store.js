export class BrowseDataStore {
    constructor(){
        this.showsMap = {};
        this.limit = 5;
        this.myListOffset = null;
        this.trendingList = null;
        this.activeId = null;
        this.activeTitle = '';
    }
    updateShowMap (ids) {
        this.showsMap = Object.assign(this.showsMap, 
            ids.reduce((prev, curr)=>{
                prev[curr.videoId] = curr;
                return prev;
            }, {})
        )
    }
    updateActiveShow (id) {
        this.activeId = id;
        this.activeTitle = this.showsMap[this.activeId].title;
    }
}