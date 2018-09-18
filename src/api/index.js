export const getCategoryIds = async (_limit, _offset, _category) => {
  const ids = await fetch('/api/v1/videos', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      limit: _limit,
      offset: _offset,
      category: _category,
    }),
  }).then(res => res.json());
  return ids;
};
export const getDetails = async (id) => {
  const videoObj = await fetch(`/api/v1/videos/${id}`).then(res => res.json());
  return videoObj;
};
export const getVideoCategory = async () => {
  const categories = await fetch('/api/v1/categories').then(res => res.json());
  return categories;
};
export const getVideoList = async (store, categoryId) => {
  const listIds = await getCategoryIds(store.limit * 2,
    store.categories[categoryId].offset, categoryId);
  store.categories[categoryId].offset = listIds[store.limit] ? listIds[store.limit].videoId : null;
  return listIds.slice(0, store.limit);
};
