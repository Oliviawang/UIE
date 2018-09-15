import { BrowsePage } from './lib/browse-page';
import { DetailsPage } from './lib/details-page';
export const routes = {
    '/': BrowsePage,
    '/details': DetailsPage,
  };
  window.onpopstate = () => {
    routes.instance.destroy();
    new routes[window.location.pathname]();
  };
  
  export function onNavItemClick (pathName, lastInstance, params) {
    if (lastInstance) {
        lastInstance.destroy();
    }
    window.history.pushState({}, pathName, window.location.origin + pathName);
    routes.instance = new routes[pathName](params);
  }