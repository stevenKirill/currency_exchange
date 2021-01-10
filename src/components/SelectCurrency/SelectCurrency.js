import { fetchExchangeRates } from '../../api/fetchFunctions';
import {primaryCurrencies} from '../currenciesList/primaryCurrencies';
import {KEY} from '../../api/key';

export default class SelectCurrency {
    constructor(firstCurrency, secondCurrency) {
        this.element = null;
        this.firstCurrency = firstCurrency;
        this.secondCurrency = secondCurrency;
        this.amount = 1;
        this.exchangeResult = null;
        this.data = primaryCurrencies;
        // bind всех функций чтобы не потерять this
        this.toggleFirst = this.toggleFirst.bind(this);
        this.toggleSecond = this.toggleSecond.bind(this);
        this.pickFirstValue = this.pickFirstValue.bind(this);
        this.pickSecondValue = this.pickSecondValue.bind(this);
        this.changePositions = this.changePositions.bind(this);
        this.updateRates = this.updateRates.bind(this);
    }

     async render() {
        this.element = document.createElement('div');
        this.exchangeResult = await this.loadData();
        const template = this.template();
        this.element.innerHTML = template;
       this.initEventListeners();
    }

    template() {
        return `
        <div class="wrapper">
            <section class="exchange_result">
                ${this.renderExchangeResults()}
            </section>
            <section class="currency_select_container">
                <div class="currency_selector_first">
                    <img src="./assets/flags/us.png" class="currency_selector_first_flag"/>
                    <span class="currency_selector_iso currency_selector_first_value">${this.firstCurrency}</span>
                </div>
                <button class="change_arrow"><=></button>
                <div class="currency_selector_second">
                    <img src="./assets/flags/ru.png" class="currency_selector_second_flag"/>
                    <span class="currency_selector_iso currency_selector_second_value">${this.secondCurrency}</span>
                </div>
                <button class="change_button">Поменять</button>
            </section>
            <section class="choose_section">
                <div class="choose_first_currency hidden_select_first">
                ${this.renderRows()}
                </div>
                <div class="choose_second_currency hidden_select_second">
                ${this.renderRows()}
                </div>
            </section>
        </div>
        `
    }

    async loadData() {
        const options = {
            key: KEY,
            from: this.firstCurrency,
            to: this.secondCurrency,
            amount: this.amount,
        }
        try {
            const data = await fetchExchangeRates(options);
            return data;
        } catch (error) {
            console.error(error)
            return `Проблемы с запросом`
        } 
    }

    renderRows() {
        let resultTemplate = '';
        this.data.map(item => {
            resultTemplate += 
            `<div data-name=${item.fetchName} class="currency_to_select">
                <img src="./assets/flags/${item.imgName}.png"/>
                <span>${item.fetchName}</span>
            </div>`
        });
        return resultTemplate;
    }

    renderExchangeResults() {
        return `
        <div>${this.exchangeResult.date.slice(0,-6) || ''}</div>
        <div style="margin-top: 20px;">
            <span style="color: blue">
                ${this.exchangeResult.current_rates[this.firstCurrency] || ''}
                ${this.exchangeResult.query.from || ''}
            </span>
            <span style="color: yellow">=>>>></span>
            <span style="color: blue">
                ${this.exchangeResult.current_rates[this.secondCurrency] || ''}
                ${this.exchangeResult.query.to || ''}
            </span>
        </div>`
    }

    initEventListeners() {
        // обрвботчики на двух главных инпутах которые открывают селект
        const firstSelect = document.querySelector('.currency_selector_first');
        const secondSelect = document.querySelector('.currency_selector_second');
        firstSelect.addEventListener('click',this.toggleFirst);
        secondSelect.addEventListener('click',this.toggleSecond);
        // это обработчики на сами селект для сохранения в переменные для последующего 
        // запроса на обмен валют
        const firstValue = document.querySelector('.choose_first_currency');
        const secondValue = document.querySelector('.choose_second_currency');
        firstValue.addEventListener('click',this.pickFirstValue);
        secondValue.addEventListener('click',this.pickSecondValue);
        // обработчики на кнопки
        const arrowButton = document.querySelector('.change_arrow');
        const changeButton = document.querySelector('.change_button');
        arrowButton.addEventListener('click',this.changePositions);
        changeButton.addEventListener('click',this.updateRates);
    }

    toggleFirst() {
        const firstList = document.querySelector('.choose_first_currency');
        firstList.classList.toggle('hidden_select_first');
    }

    toggleSecond() {
        const secondList = document.querySelector('.choose_second_currency');
        secondList.classList.toggle('hidden_select_second');
    }

    pickFirstValue(event) {
        if (event.target.classList.contains('currency_to_select')) {
            const mainInputValue = document.querySelector('.currency_selector_first_value');
            mainInputValue.innerHTML = event.target.dataset.name;
            const flagIcon = document.querySelector('.currency_selector_first_flag');
            const chosenCurrency = this.data.find(el => el.fetchName === event.target.dataset.name);
            flagIcon.setAttribute('src',`./assets/flags/${chosenCurrency.imgName}.png`);
            this.firstCurrency = event.target.dataset.name;
            this.toggleFirst();
        }
    }

    pickSecondValue(event) {
        if (event.target.classList.contains('currency_to_select')) {
            const mainInputValue = document.querySelector('.currency_selector_second_value');
            mainInputValue.innerHTML = event.target.dataset.name;
            const flagIcon = document.querySelector('.currency_selector_second_flag');
            const chosenCurrency = this.data.find(el => el.fetchName === event.target.dataset.name);
            flagIcon.setAttribute('src',`./assets/flags/${chosenCurrency.imgName}.png`);
            this.secondCurrency = event.target.dataset.name;
            this.toggleSecond();
        }
    }

    changePositions() {
        // вся логика при смене флага и значения валюты при нажатиии на кнопку со стрелочками
        const firstValue = document.querySelector('.currency_selector_first_value');
        const secondValue = document.querySelector('.currency_selector_second_value');

        const firstFlagIcon = document.querySelector('.currency_selector_first_flag');
        const secondFlagIcon = document.querySelector('.currency_selector_second_flag');

        const findFirst = this.data.find(item => item.fetchName === firstValue.innerText);
        const findSecond = this.data.find(item => item.fetchName === secondValue.innerText);
        
        firstFlagIcon.setAttribute('src',`./assets/flags/${findSecond.imgName}.png`);
        secondFlagIcon.setAttribute('src',`./assets/flags/${findFirst.imgName}.png`);

        const prev = firstValue.innerHTML
        firstValue.innerHTML = secondValue.innerHTML;
        secondValue.innerHTML = prev;

        this.firstCurrency = firstValue.innerHTML;
        this.secondCurrency = secondValue.innerHTML;
    }

    async updateRates() {
        this.exchangeResult = await this.loadData();
        const updateBlock = document.querySelector('.exchange_result');
        updateBlock.innerHTML = '';
        updateBlock.innerHTML = this.renderExchangeResults();
    }

    removeEventListeners() {
        // УДАЛЯЕМ ВСЕ ОБРАБОТЧИКИ ЧИСТИМ ЗА СОБОЙ=)
        // обрвботчики на двух главных инпутах которые открывают селект
        const firstSelect = document.querySelector('.currency_selector_first');
        const secondSelect = document.querySelector('.currency_selector_second');
        firstSelect.removeEventListener('click',this.toggleFirst);
        secondSelect.removeEventListener('click',this.toggleSecond);
        // это обработчики на сами селект для сохранения в переменные для последующего 
        // запроса на обмен валют
        const firstValue = document.querySelector('.choose_first_currency');
        const secondValue = document.querySelector('.choose_second_currency');
        firstValue.removeEventListener('click',this.pickFirstValue);
        secondValue.removeEventListener('click',this.pickSecondValue);
        // обработчики на кнопки
        const arrowButton = document.querySelector('.change_arrow');
        const changeButton = document.querySelector('.change_button');
        arrowButton.removeEventListener('click',this.changePositions);
        changeButton.removeEventListener('click',this.updateRates);
    }

    destroy() {
        this.removeEventListeners();
        this.element.remove();
    }
}