import { BrowsePage } from './components/browse-page';
import { DetailsPage } from './components/details-page';
export const routes = {
  '/': BrowsePage,
  '/details': DetailsPage,
};
window.onpopstate = () => {
  onNavItemClick(window.location.pathname);
};
export function onNavItemClick(pathName) {
  if (onNavItemClick.instance) {
    onNavItemClick.instance.destroy();
  }
  window.history.pushState(pathName, pathName, window.location.origin + pathName);
  let params;
  const paths = pathName.split('/');
  if (paths.length > 2) {
    params = paths[2];
    pathName = `/${paths[1]}`;
  }
  onNavItemClick.instance = new routes[pathName](params);
  onNavItemClick.instance.init();
}
