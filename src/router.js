import { BrowsePage as defaultExport } from './lib/browse-page';
import { DetailsPage } from './lib/details-page';
export const routes = {
    '/': defaultExport,
    '/details': DetailsPage,
  };
  window.onpopstate = () => {
    document.body.innerHTML = new routes[window.location.pathname]().contentDiv.innerHTML;
  };
  
  export function onNavItemClick (pathName, lastInstance, params) {
    lastInstance.destroy();
    window.history.pushState({}, pathName, window.location.origin + pathName);
    const instance = new routes[pathName](params);
  }