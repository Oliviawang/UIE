// import `.scss` files
import './scss/styles.scss';
import 'babel-polyfill';
// import UserList class
//import { UserList as defaultExport } from './lib/user-list';
import { BrowsePage as defaultExport } from './lib/browse-page';

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
export default defaultExport;