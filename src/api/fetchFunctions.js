/**
 * Функция для запроса курсов при стартовой загрузке страницы курсов (доллар США)
 * @param {string} key api key 
 */
export async function fetchData(key) {
    try {
        const rawData = await fetch(`https://api.currencyfreaks.com/latest?apikey=${key}`);
        const data = await rawData.json();
        return data;
    } catch (error) {
        console.error(error)
        return 
    }
};

/**
 * Функция запроса курсов при кастомном выборе валюты для которой запрашиваются курсы
 * @param {string} key api key
 * @param {*string} base базовая текущая валюта
 * @param {*array} primaryCurrencies основыне валюты которые идут в запрос
 */
export async function fetchDataWithBase(key,base,primaryCurrencies) {
    const mappedPrimaryCurrencies = primaryCurrencies.reduce((res,currency) => {
        const {fetchName} = currency;
        return  res += `${fetchName !== base ? fetchName + ',' : ''}`
    },'');
    try {
        const rawData = await fetch(`https://api.currencyfreaks.com/latest?apikey=${key}&symbols=${mappedPrimaryCurrencies.slice(0,-1)}&base=${base}`);
        const data = await rawData.json();
        return data;
    } catch (error) {
        console.error(error)
        return;
    }
};

/**
 * 
 * @param {object} options объект с полями для урла.
 */
export async function fetchExchangeRates(options) {
    try {
        const {key, from, to, amount} = options;
        const rawData = await fetch(`https://api.currencyfreaks.com/latest/convert?apikey=${key}&from=${from}&to=${to}&amount=${amount}`);
        const data = await rawData.json();
        return data;   
    } catch (error) {
        console.error(error);
        return;
    };
}