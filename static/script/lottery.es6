/// <reference path="./config.es6" />

const lottery = {
    /** @param {Dataset} users */
    replace: (...users) => { throw new Error('"gallery.replace" has not initialed.', users); },
};
window.lottery = lottery;

{
    const container = document.querySelector('#lottery');
    container.appendChild(((ele) => {
        ele.textContent = config.lottery.title; // eslint-disable-line no-undef
        ele.classList.add('title');
        return ele;
    })(document.createElement('h1')));

    container.appendChild(((ele) => {
        ['load', 'hashchange'].forEach(key => addEventListener(key, () => {
            const data = config.turns[Number.parseInt(location.hash.slice(1)) || 0]; // eslint-disable-line no-undef
            ele.textContent = `${data.name} ${data.quota}名`;
        }));

        ele.classList.add('describe');
        return ele;
    })(document.createElement('p')));

    container.appendChild(((ele) => {
        ['load', 'hashchange'].forEach(key => addEventListener(key, () => {
            ele.textContent = '';
        }));
        ele.classList.add('gallery');

        /** @param {Dataset} users */
        const replace = (...users) => {
            ele.innerHTML = '';
            users.forEach((data) => {
                const p = document.createElement('p');
                ele.appendChild(p);
                p.textContent = `${data.name} [${data.code}]`;
            });
        };
        lottery.__defineSetter__('replace', (v) => { throw new Error(`"lottery.replace" could not be change: ${v}`); });
        lottery.__defineGetter__('replace', () => replace);
        return ele;
    })(document.createElement('div')));
}
