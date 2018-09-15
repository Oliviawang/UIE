export const  getCategoryIds = async (limit, offset, category)=>{
    const ids =  await fetch('/api/v1/shows',{
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            limit: limit,
            offset: offset,
            category: category
        })
      }).then(res=>res.json()); 
      return ids;
}
export const getDetails = async (id) => {
    const videoObj = await fetch('/api/v1/shows/' + id).then(res=>res.json())
    return videoObj;
}
export const getMyList = async (store) =>{
    const myListIds = await getCategoryIds(store.limit*2, store.myListOffset, 0);
    store.myListOffset = myListIds[store.limit] ? myListIds[store.limit].videoId : null
    return myListIds.slice(0, store.limit);
}
export const  getTrendingList = async (store) =>{
    const trendingIds =  await getCategoryIds(store.limit*2, store.trendingOffset, 1);
    store.trendingOffset = trendingIds[store.limit] ? trendingIds[store.limit].videoId : null
    return trendingIds.slice(0, store.limit);
}