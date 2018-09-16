// import `.scss` files
import './style/styles.scss';
import 'babel-polyfill';
import { routes } from './router';

export default class App {
  constructor() {
    const paths = window.location.pathname.split('/');
    let pathName = window.location.pathname;
    let params;
    if (paths.length > 2) {
      pathName = `/${paths[1]}`;
      params = paths[2];
    }
    const instance = new routes[pathName](params);
  }
}
