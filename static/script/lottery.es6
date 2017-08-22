/// <reference path="./config.es6" />

const lottery = {
    /** @param {Dataset} users */
    replace: (...users) => { throw new Error(`"gallery.replace" has not initialed, users: ${JSON.stringify(users)}`); },
    onExchange: (index) => { throw new Error(`missing handler for "lottery.onExchange" event, index: ${index}`); },
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

    let timeout;
    container.appendChild(((ele) => {
        ['load', 'hashchange'].forEach(key => addEventListener(key, () => {
            clearTimeout(timeout);

            ele.textContent = '';
            const data = config.turns[Number.parseInt(location.hash.slice(1)) || 0]; // eslint-disable-line no-undef
            config.lottery.size.some(([quota, size]) => { // eslint-disable-line no-undef
                if (data.quota <= quota) {
                    ele.style.setProperty('--font-size', `${size}em`);
                    return true;
                }
            });
        }));
        ele.classList.add('gallery');

        /** @param {Dataset} users */
        const replace = (...users) => {
            ele.innerHTML = '';
            users.forEach((data, index) => {
                const p = document.createElement('p');
                ele.appendChild(p);
                p.textContent = config.renderUser(data); // eslint-disable-line no-undef
                p.addEventListener('click', () => {
                    // unsafe, use `prompt` instead.
                    if (!confirm(`确实要替换掉 "${data.name} [${data.code}]" 吗？`)) {
                        return null;
                    }
                    // if (prompt(`确实要替换掉 "${data.name} [${data.code}]" ？请验证：`, '输入中括号中的内容') !== data.code) {
                    //     return null;
                    // }
                    data = lottery.onExchange(index);
                    if (!data) {
                        alert('替换失败，已经没有没中奖的人了');
                        return null;
                    }
                    p.style.color = '#f00';
                    p.textContent = config.renderUser(data); // eslint-disable-line no-undef
                });
            });
            const scrollBottom = ele.scrollHeight - Math.min(ele.clientHeight, ele.offsetHeight);
            if (scrollBottom > 0) {
                let increment = 1;
                const scroll = () => {
                    ele.scrollTop += increment;
                    if (increment > 0) {
                        if (ele.scrollTop >= scrollBottom) {
                            increment = -1;
                            ele.scrollTop = scrollBottom;
                            timeout = setTimeout(scroll, 1000); // eslint-disable-line no-undef
                            return;
                        }
                    } else {
                        if (ele.scrollTop <= 0) {
                            increment = 1;
                            ele.scrollTop = 0;
                            timeout = setTimeout(scroll, 1000); // eslint-disable-line no-undef
                            return;
                        }
                    }
                    timeout = setTimeout(scroll, config.lottery.freq); // eslint-disable-line no-undef
                };
                timeout = setTimeout(scroll, 1500);
            }
            window.ele = ele;
        };
        lottery.__defineSetter__('replace', (v) => { throw new Error(`"lottery.replace" could not be change: ${v}`); });
        lottery.__defineGetter__('replace', () => replace);
        return ele;
    })(document.createElement('div')));
}
