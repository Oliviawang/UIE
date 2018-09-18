// import `.scss` files
import './style/styles.scss';
import 'babel-polyfill';
import { onNavItemClick } from './router';

export default class App {
  constructor() {
    onNavItemClick(window.location.pathname);
  }
}
