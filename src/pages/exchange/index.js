import SelectCurrency from '../../components/SelectCurrency/SelectCurrency.js';

export default class Page {

    constructor() {
        this.components = {};
        this.element = null;
        this.initComponents();
    }

    async render() {
        this.element = document.createElement('div');
        this.element.classList.add('exchange_page');
        const subElements = await this.renderComponents();
        
        for(const subElement of subElements) {
            this.element.append(subElement)
        }
        
        return this.element;
    }

    initComponents() {
        const selectCurrency = new SelectCurrency('USD', 'RUB');
        this.components.selectCurrency = selectCurrency;
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