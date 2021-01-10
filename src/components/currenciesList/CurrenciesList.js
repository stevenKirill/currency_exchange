import {fetchData, fetchDataWithBase} from '../../api/fetchFunctions';
import {primaryCurrencies} from './primaryCurrencies';
import {KEY} from '../../api/key.js';

export default class CurrenciesList {
    constructor() {
        this.data = null;
        this.element = null;
        this.primaryCurrencies = primaryCurrencies;
        this.openCurrenciesList = this.toggleCurrenciesList.bind(this);
        this.fetchChosenCurrencyRates = this.fetchChosenCurrencyRates.bind(this);

    }

    async render() {
        this.element = document.createElement('div');
        this.data = await this.loadData();
        const template = this.template;
        this.element.innerHTML = template;
        this.initEventListeners();
    }

    get template() {
        return `<div class="currencies_data__container">
                    <div class="current_date">
                    <span style="color:red">Дата последнего обновления:</span>
                    ${this.data.date.slice(0,-6) || 'Не могу получить время'}
                    </div>
                    <div class="base_currency">
                        <img src="./assets/flags/us.png" alt="${this.data.base}"/>
                        <span 
                        class="base_currency_item" 
                        data-currency=${this.data.base}>
                        ${this.data.base || 'USD'}
                        </span>
                        <img src="./assets/arrow.png" alt="arrow"/>
                    </div>
                    <div class="choose_base_currency_list hidden">
                        ${this.renderCurrencies()}
                    </div>
                    <ul class="currencies_rates_container">
                        ${this.renderRows(this.data)}
                    </ul>
                </div>`
    }

    async loadData() {
        try {
            const data = await fetchData(KEY);
            return data;
        } catch (error) {
            console.error(error)
            return `Проблемы с запросом`
        }
    }

    renderRows(data) {
        if(!data) {
            return `<div>Нет данных</div>`
        }
        let result = '';
        Object.entries(data.rates).map(rate => {
            const [currnecyName, currencyRate] = rate;
            const rounded = Number(currencyRate).toFixed(2);
            result += `<li class="currency_rate">
            <span>1${data.base}</span>
            <img src="./assets/repeat.png" alt="arrow" width="40px" height="40px"/>
            <span class="currency_rate_title">${rounded}</span>
            <span class="currency_rate_number">${currnecyName}</span>
            </li>`
        });
        return result;
    }

    renderCurrencies() {
        let result = '';
        this.primaryCurrencies.map(currency => {
            result += `<div class="currency_list_item">
                <img src="./assets/flags/${currency.imgName}.png" alt="${currency.imgName}"/>
                <span data-code="${currency.fetchName}">${currency.fetchName}</span>
            </div>`
        });
        return result;
    }

    toggleCurrenciesList() {
        const currenciesList = document.querySelector('.choose_base_currency_list');
        currenciesList.classList.toggle('hidden');
    }

    async fetchChosenCurrencyRates(event) {
        // запрос курсов для выбранной валюты
        if (event.target.classList.contains('currency_list_item')) {
            const baseCurrency = event.target.children[1].dataset.code;
            const newRates = await fetchDataWithBase(KEY,baseCurrency,this.primaryCurrencies);
            this.updateRows(newRates);
        }
    }

    updateRows(newRates) {
        const currenciesContainer = document.querySelector('.currencies_rates_container');
        const baseCurrency = document.querySelector('.base_currency_item');
        console.log('updating')
        baseCurrency.innerHTML = newRates.base;
        currenciesContainer.innerHTML = '';
        const newTemplate = this.renderRows(newRates);
        currenciesContainer.innerHTML += newTemplate;
        this.toggleCurrenciesList();
    }

    initEventListeners() {
        const baseCurrencyBlock = document.querySelector('.base_currency');
        const otherCurrencies = document.querySelector('.choose_base_currency_list');
        baseCurrencyBlock.addEventListener('click',this.toggleCurrenciesList);
        otherCurrencies.addEventListener('click',this.fetchChosenCurrencyRates);
    }

    removeEventListeners() {
        const baseCurrencyBlock = document.querySelector('.base_currency');
        const otherCurrencies = document.querySelector('.choose_base_currency_list');
        baseCurrencyBlock.removeEventListener('click',this.toggleCurrenciesList);
        otherCurrencies.removeEventListener('click',this.fetchChosenCurrencyRates);
    }

    destroy() {
        this.removeEventListeners();
        this.element.remove();
    }
}