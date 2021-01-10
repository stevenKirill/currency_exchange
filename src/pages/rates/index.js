import CurrencyList from '../../components/currenciesList/CurrenciesList.js';

export default class Page {

    constructor() {
        this.components = {};
        this.element = null;
        this.initComponents();
    }

    async render() {
        this.element = document.createElement('div');
        const subElements = await this.renderComponents();

        for(const subElement of subElements) {
            this.element.append(subElement)
        }

        return this.element;
    }

    initComponents() {
        const currenciesList = new CurrencyList();
        this.components.currenciesList = currenciesList;
    }

    async renderComponents() {
        const promises = Object.values(this.components).map(item => {
            item.render();
            return item.element;
        });
        return await Promise.all(promises);
    }

    destroy() {
        for (const component of Object.values(this.components)) {
            component.destroy();
          }
    }
}