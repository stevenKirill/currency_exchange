export default async function(path, match) {

    const { default: Page } = await import(
        /*webpackChunkName: page */`../pages/${path}/index.js`
    );

    const pageInstance = new Page();

    const element = await pageInstance.render();

    const content = document.getElementById('page-content');

    content.innerHTML = '';
    content.append(element);

    return pageInstance;
}