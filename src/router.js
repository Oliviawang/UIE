import { BrowsePage } from './components/browse-page';
import { DetailsPage } from './components/details-page';
/*
routes mapping :<url, component>
*/
export const routes = {
  '/': BrowsePage,
  '/details': DetailsPage,
};
/*
handel back button event in the browser
*/
window.onpopstate = () => {
  onNavItemClick(window.location.pathname);
};
/*
core function that navigates between components according to routes map
*/
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
