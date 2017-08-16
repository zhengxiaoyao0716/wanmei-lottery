/// <reference path="./config.es6" />
/// <reference path="./control.es6" />
/// <reference path="./lottery.es6" />
// /// <reference path="./pendant.es6" />
/// <reference path="./roller.es6" />

const unitTests = {
    dataset: config.dataset, // eslint-disable-line no-undef
    analyze: (codesList) => { console.log(codesList); },
};

{
    const mSeed = Math.seedrandom();
    const mRandom = new Math.seedrandom(mSeed);
    const record = [];
    const result = {};

    const reorder = (dataset) => {
        const seed = mRandom();
        record.push({ seed });
        const random = new Math.seedrandom(seed);

        const sorted = dataset.filter(v => v != null).map(v => [random(), v]);
        sorted.sort((l, r) => l[0] < r[0]);
        return sorted.map(v => v[1]);
    };
    unitTests.reorder = (times) => new Array(times || 20).fill().map(() => reorder(unitTests.dataset).map(v => v.code));

    const sample = (dataset, size, seed) => {
        if (size >= dataset.length) {
            return dataset;
        }
        const random = new Math.seedrandom(seed);
        const ids = new Set();
        while (ids.size < size) {
            ids.add(parseInt(random() * dataset.length));
        }
        return Array.from(ids).map(index => dataset[index]);
    };
    unitTests.sample = (times, size) => {
        const dataset = reorder(unitTests.dataset);
        return new Array(times || 20).fill().map(() => sample(dataset, size || 3, new Date().getTime()).map(v => v.name));
    };

    const timer = function (freq, run, end) {
        let timeout;
        const start = () => {
            run();
            timeout = setTimeout(start, freq);
        };
        return {
            start,
            stop: () => {
                end();
                timeout && clearTimeout(timeout);
                timeout = null;
            },
        };
    };
    unitTests.timer = (freq) => {
        let timestamp;
        timer(freq || 500, () => {
            timestamp = new Date().getTime();
            console.log('run:', timestamp);
        }, () => {
            console.log('end:', timestamp);
        });
    };

    let sorted;
    let rollerTimer;
    /* eslint-disable no-undef */
    const dataset = config.dataset.slice();
    control.onStart = (turn) => {
        const turnData = config.turns[turn];
        if (result[turnData.name]) {
            lottery.replace(...result[turnData.name]);
            if (!confirm('本轮已抽取过了，确定要重新抽取吗？')) {
                return;
            }
        }

        document.querySelector('#roller').classList.remove('hide');
        sorted = reorder(dataset);
        let timestamp;
        rollerTimer = timer(config.roller.freq, () => {
            rollerSE.play();
            timestamp = new Date().getTime();
            const users = sample(sorted, turnData.quota, timestamp);
            roller.replace(...users);
        }, () => {
            lotterySE.play();
            record[record.length - 1].timestamp = timestamp;
            const users = sample(sorted, turnData.quota, timestamp);
            result[turnData.name] = users;
            lottery.replace(...users);
            const codeSet = new Set(users.map(data => data.code));
            dataset.forEach((data, index) => data != null && codeSet.has(data.code) && (dataset[index] = null));
        });
        rollerTimer.start();
    };
    control.onStop = (turn) => { // eslint-disable-line no-unused-vars
        if (!rollerTimer) {
            return;
        }
        document.querySelector('#roller').classList.add('hide');
        rollerTimer.stop();
        rollerTimer = null;
    };
    /* eslint-enable no-undef */


    /* backup */
    let unsavedTip = '数据尚未备份';
    const save = () => {
        const a = document.createElement('a');
        
        const random = new Math.seedrandom(mSeed);
        const backup = { mSeed, check: [random(), random(), random(),], dataset: config.dataset }; // eslint-disable-line no-undef
        a.download = 'backup.js';
        a.href = URL.createObjectURL(new Blob([`
            const record = ${JSON.stringify(record)};

            const backup = ${JSON.stringify(backup)};

            // valid seed
            ((random) => backup.check.forEach(v => { if (v != random()) { throw new Error('valid seed failed'); } }))(new Math.seedrandom(backup.seed));
        `], { type: 'application/x-javascript;charset=utf-8' }));
        a.click();

        a.download = '抽奖结果.txt';
        a.href = URL.createObjectURL(new Blob([((result) => {
            const eol = '\r\n';
            let content = `抽奖结果：${eol}`;
            for (const turnName in result) {
                content += `${eol}[${turnName}]${eol}`;
                content += result[turnName].map(d => JSON.stringify(d)).join(eol);
            }
            return content;
        })(result)], { type: 'text/plain;charset=utf-8' }));
        a.click();

        unsavedTip = null;
    };
    control.onSave = save; // eslint-disable-line no-undef
    // DEBUG 正式发布时打开这个
    // window.onbeforeunload = () => unsavedTip;

    // 样式修正
    addEventListener('load', () => ['control', 'lottery', 'roller',].forEach((module) => {
        const style = config[module].style; // eslint-disable-line no-undef
        const container = document.querySelector(`#${module}`);
        for (const key in style) {
            container.style[key] = style[key];
        }
    }));
}