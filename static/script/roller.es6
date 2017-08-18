/// <reference path="./config.es6" />

const roller = {
    /** @param {Dataset} users */
    replace: (...users) => { throw new Error('"roller.replace" has not initialed.', users); }
};
window.roller = roller;

{
    /** @type {HTMLDivElement} */
    const container = document.querySelector('#roller');
    const newPanel = () => {
        const panel = document.createElement('div');
        container.appendChild(panel);
        panel.classList.add('panel');
        return panel;
    };

    ['load', 'hashchange'].forEach(key => addEventListener(key, () => {
        const data = config.turns[Number.parseInt(location.hash.slice(1)) || 0]; // eslint-disable-line no-undef
        if (data == null) {
            return;
        }
        const quota = data.quota;

        document.querySelectorAll('.-roller->div.panel').forEach(div => div.remove());
        let num;
        if (quota > 39) {
            num = 4;
        } else if (quota > 30) {
            num = quota % 3 == 0 ? 3 : 2;
        } else if (quota > 9) {
            // double panel
            num = 2;
        } else if (quota < 6) {
            // signle panel
            num = 1;
        } else {
            if (quota % 2 == 0) {
                // double panel
                num = 2;
            } else {
                // signle panel
                num = 1;
            }
        }
        config.roller.size.some(([quota, size]) => { // eslint-disable-line no-undef
            if (data.quota <= quota) {
                container.style.setProperty('--font-size', `${size}em`);
                return true;
            }
        });

        /** @type {HTMLDivElement[]} */
        const panels = new Array(num).fill().map(newPanel);

        /** @param {Dataset} users */
        const replace = (...users) => {
            panels.forEach(panel => panel.innerHTML = '');
            users.forEach((data, index) => {
                const p = document.createElement('p');
                panels[index % panels.length].appendChild(p);
                p.textContent = config.renderUser(data); // eslint-disable-line no-undef
            });
        };
        roller.__defineSetter__('replace', (v) => { throw new Error(`"roller.replace" could not be change: ${v}`); });
        roller.__defineGetter__('replace', () => replace);
    }));
}
