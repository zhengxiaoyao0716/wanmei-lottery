/// <reference path="./config.es6" />

const control = {
    onStart: (turn) => { throw new Error(`missing control handler for "start" event, turn: ${turn}`); },
    onStop: (turn) => { throw new Error(`missing control handler for "stop" event, turn: ${turn}`); },
    onSave: () => { throw new Error('missing control handler for "save" event'); },
};
window.control = control;

{
    const container = document.querySelector('#control');
    const KeyCode = { space: 32, left: 37, right: 39, enter: 13, };
    const keyControl = {};

    const last = container.querySelector('#last');
    const next = container.querySelector('#next');
    keyControl[KeyCode.left] = () => last.click();
    keyControl[KeyCode.right] = () => next.click();

    const turns = config.turns; // eslint-disable-line no-undef
    let turn = 0;

    ['load', 'hashchange'].forEach(key => addEventListener(key, () => {
        turn = Number.parseInt(location.hash.slice(1)) || 0;

        let lastTurn = turn - 1;
        if (lastTurn < 0) {
            lastTurn = 0;
            last.setAttribute('disabled', true);
        } else {
            last.removeAttribute('disabled');
        }
        last.setAttribute('href', `#${lastTurn}`);

        let nextTurn = turn + 1;
        if (nextTurn > turns.length - 1) {
            nextTurn = Math.max(turns.length - 1, 0);
            next.setAttribute('disabled', true);
        } else {
            next.removeAttribute('disabled');
        }
        next.setAttribute('href', `#${nextTurn}`);
    }));

    const start = container.querySelector('#start');
    const stop = container.querySelector('#stop');
    keyControl[KeyCode.space] = () => start.click();
    start.addEventListener('click', () => {
        if (control.onStart(turn) === false) {
            return;
        }
        keyControl[KeyCode.space] = () => stop.click();
        start.classList.add('hide');
        stop.classList.remove('hide');
    });
    stop.addEventListener('click', () => {
        if (control.onStop(turn) === false) {
            return;
        }
        keyControl[KeyCode.space] = () => start.click();
        stop.classList.add('hide');
        start.classList.remove('hide');
    });

    const save = container.querySelector('#save');
    keyControl[KeyCode.enter] = () => save.click();
    save.addEventListener('click', () => control.onSave());

    addEventListener('keydown', (e) => {
        const handler = keyControl[e.keyCode];
        handler && handler();
    });
}
