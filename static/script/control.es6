/// <reference path="./config.es6" />

const control = {
    onStart: (turn) => { throw new Error(`missing control handler for "start" event, turn: ${turn}`); },
    onStop: (turn) => { throw new Error(`missing control handler for "stop" event, turn: ${turn}`); },
    onSave: () => { throw new Error('missing control handler for "save" event'); },
};
window.control = control;

{
    const container = document.querySelector('#control');

    const last = container.querySelector('#last');
    const next = container.querySelector('#next');

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
    start.addEventListener('click', () => {
        control.onStart(turn);
        start.classList.add('hide');
        stop.classList.remove('hide');
    });
    stop.addEventListener('click', () => {
        control.onStop(turn);
        stop.classList.add('hide');
        start.classList.remove('hide');
    });

    const save = container.querySelector('#save');
    save.addEventListener('click', () => control.onSave());
}
