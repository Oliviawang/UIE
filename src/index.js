// import `.scss` files
import './scss/styles.scss';
import 'babel-polyfill';

import {  routes } from './router';
// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
export default class App {
    constructor (){
        const instance = new routes[window.location.pathname]()
    }
}