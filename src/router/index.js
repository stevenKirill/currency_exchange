import renderPage from './render-page';

export default class Router {
    constructor() {
        this.routes = [];
        this.initEventListeners();
        this.page = null;
    }

    /**
     * Обработчик на ссылки для перехода на конкретный раздел
     */
    initEventListeners() {
        document.addEventListener('click', (event) => {
            const linkNode = event.target.closest('a');
            if(!linkNode) return

            const hrefAttr = linkNode.getAttribute('href');

            if(hrefAttr && hrefAttr.startsWith('/')) {
                event.preventDefault();
                this.navigate(hrefAttr)
            }
        })
    }

    /**
     * Переход на раздел
     * @param {string} path путь 
     */
    navigate(path) {
        history.pushState(null,null,path);
        this.route()
    }

    /**
     * роутинг
     */
    async route() {
        // очищаем путь от /\, находим путь в объекте путей и рендерим страницу
        const strippedPath = decodeURI(window.location.pathname)
        .replace(/^\/|\/$/, '');

        let match;

        for(let route of this.routes) {

            match = strippedPath.match(route.pattern);
            if (match) {
                this.page = await this.changePage(route.path, match);
                break;
            }
        }

        if (!match) {
            this.page = await this.changePage('error');
        }
    }
    
    async changePage(path, match) {
        if(this.page && this.page.destroy) {
            this.page.destroy()
        }
        return await renderPage(path, match);
    }

    listen() {
        window.addEventListener('popstate', () => this.route());
    }

    /**
     * Добавляю роуты
     * @param {string} pattern шаблон строки
     * @param {string} path путь
     */
    addRoute(pattern, path) {
        this.routes.push({pattern, path})
        return this;
    }
}