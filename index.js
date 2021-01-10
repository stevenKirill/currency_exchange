import Router from './src/router/index';
import './src/styles/index.css';

const router = new Router();

router
.addRoute(/^rates$/, 'rates')
.addRoute(/^exchange$/, 'exchange')
.listen();