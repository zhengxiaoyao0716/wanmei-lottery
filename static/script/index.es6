/// <reference path="./config.es6" />
/// <reference path="./control.es6" />
/// <reference path="./lottery.es6" />
// /// <reference path="./pendant.es6" />
/// <reference path="./roller.es6" />

const unitTests = {
    dataset: config.dataset, // eslint-disable-line no-undef
    analyze: (codesList) => {
        const analyze = {
            codeTimes: {},
            indexCodes: {},
        };
        for (const codes of codesList) {
            codes.forEach((code, index) => {
                if (analyze.codeTimes[code] == null) {
                    analyze.codeTimes[code] = 0;
                }
                analyze.codeTimes[code]++;

                if (analyze.indexCodes[index] == null) {
                    analyze.indexCodes[index] = [];
                }
                analyze.indexCodes[index].push(code);
            });
        }
        return analyze;
    },
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
        sorted.sort((l, r) => l[0] - r[0]); // (l < r) => (l < r ? true : false) => (l < r ? 1 : 0)
        return sorted.map(v => v[1]);
    };
    unitTests.reorder = (times) => new Array(times || 10000).fill().map(() => reorder(unitTests.dataset).map(v => v.code));

    const sample = (dataset, size, seed) => {
        const random = new Math.seedrandom(seed);
        if (size >= dataset.length) {
            const sorted = dataset.map(v => [random(), v]);
            sorted.sort((l, r) => l[0] - r[0]); // (l < r) => (l < r ? true : false) => (l < r ? 1 : 0)
            return sorted.map(v => v[1]);
        }
        const ids = new Set();
        while (ids.size < size) {
            ids.add(parseInt(random() * dataset.length));
        }
        return Array.from(ids).map(index => dataset[index]);
    };
    unitTests.sample = (times, size) => {
        const dataset = reorder(unitTests.dataset);
        const timestamp = new Date().getTime();
        return new Array(times || 10000).fill().map((_, index) => sample(dataset, size || 3, timestamp + index).map(v => v.code));
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
        return timer(freq || 500, () => {
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
            // unsafe, use `prompt` instead.
            if (!confirm('本轮已抽取过了，确定要重新抽取吗？')) {
                return false;
            }
            // if (prompt('本轮已抽取过了，如果要重新抽取，请验证：', '输入本轮中奖名额') !== String(turnData.quota)) {
            //     return false;
            // }
            result[turnData.name].forEach(d => dataset.push(d));
        }
        document.querySelector('#lottery').classList.add('hide');
        document.querySelector('#roller').classList.remove('hide');
        sorted = reorder(dataset);
        record[record.length - 1].name = turnData.name;
        let timestamp;
        rollerTimer = timer(config.roller.freq, () => {
            rollerSE.play();
            timestamp = new Date().getTime();
            const users = sample(sorted, turnData.quota, timestamp);
            roller.replace(...users);
        }, () => {
            lotterySE.play();
            // sample.
            record[record.length - 1].timestamp = timestamp;
            const users = sample(sorted, turnData.quota, timestamp);
            result[turnData.name] = users;

            // substrate repeat.
            const codeSet = new Set(users.map(data => data.code));
            const substrate = () => {
                dataset.forEach((data, index) => data != null && codeSet.has(data.code) && (dataset[index] = null));
                sorted.forEach((data, index) => data != null && codeSet.has(data.code) && (sorted[index] = null));
                sorted = sorted.filter((data) => data != null);
            };
            substrate();

            lottery.onExchange = (index) => {
                if (!sorted.length) {
                    return false;
                }
                // exchange
                const timestamp = new Date().getTime();
                const user = sample(sorted, 1, timestamp)[0];
                record[record.length - 1][`exchange_${result[turnData.name][index].code}_${index}`] = { timestamp };
                result[`${turnData.name}_exchange`] = result[`${turnData.name}_exchange`] || [];
                result[`${turnData.name}_exchange`].push(user);
                users[index] = user;

                // substrate repeat.
                codeSet.add(user.code);
                substrate();

                return user;
            };
            lottery.replace(...users);
        });
        rollerTimer.start();
    };
    control.onStop = (turn) => { // eslint-disable-line no-unused-vars
        if (!rollerTimer) {
            return false;
        }
        document.querySelector('#lottery').classList.remove('hide');
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
            ((random) => backup.check.forEach(v => { if (v != random()) { throw new Error('valid seed failed'); } }))(new Math.seedrandom(backup.mSeed));
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
    window.onbeforeunload = () => unsavedTip;

    // 样式修正
    addEventListener('load', () => ['control', 'lottery', 'roller',].forEach((module) => {
        const style = config[module].style; // eslint-disable-line no-undef
        const container = document.querySelector(`#${module}`);
        for (const key in style) {
            container.style[key] = style[key];
        }
    }));
    document.head.appendChild(((style) => {
        style.innerHTML = `body::before { background-image: url(${config.body.bgi}); }`; // eslint-disable-line no-undef
        return style;
    })(document.createElement('style')));
    bgm.src = config.body.bgm; // eslint-disable-line no-undef
}
