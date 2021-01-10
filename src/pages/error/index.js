export default class Page {

    render() {
        this.element = document.createElement('div');
        this.element.classList.add('currencies_page_parent');
        this.element.append(this.template)
        return this.element;
    }

    get template() {
        return `
        <div class="error-404">
          <h1 class="page-title">Страница не найдена</h1>
          <p>Извините, страница не существует</p>
        </div>
      `
    }

    destroy() {
        this.element.innerHTML = '';
    }
}