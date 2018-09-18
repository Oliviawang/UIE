class Api {
  static async get(url) {
    return fetch(url).then(res => res.json());
  }

  static async post(url, payload) {
    return fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(res => res.json());
  }
}

class BrowseApi {
  static async getVideoCategory() {
    const categories = await Api.get('/api/v1/categories');
    return categories;
  }

  static async getVideoList(store, categoryId) {
    const listIds = await Api.post('/api/v1/videos', {
      limit: store.limit * 2,
      offset: store.categories[categoryId].offset,
      category: categoryId,
    });

    store.categories[categoryId].offset = listIds[store.limit]
      ? listIds[store.limit].videoId : null;

    return listIds.slice(0, store.limit);
  }
}

class DetailsApi {
  static async getDetails(id) {
    const videoObj = await Api.get(`/api/v1/videos/${id}`);
    return videoObj;
  }
}

export {
  BrowseApi,
  DetailsApi,
};
