/**
 * 配置.
 * @typedef {{ name: string, image: string, style: CSSStyleDeclaration, }[]} Pendants
 * @typedef {{ style: CSSStyleDeclaration, }} Control
 * @typedef {{ title: string, freq: number, size: [[quote, size]] style: CSSStyleDeclaration, }} Lottery
 * @typedef {{ freq: number, size: [[quote, size]], style: CSSStyleDeclaration, }} Roller
 * @typedef {{ name: string, code: string, }[]} Dataset
 * @typedef {{ name: string, quota: number, }[]} Turns
 * @typedef {{ bgi: string, bgm: string}} Body
 * @type {{ pendants: Pendants, control: Control, lottery: Lottery, roller: Roller, dataset: Dataset, turns: Turns, body: Body, }}
 */
const config = { // eslint-disable-line no-unused-vars
    // 挂件
    pendants: [
        // {
        //     name: 'logo',
        //     image: './static/image/pendant/logo.png',
        //     style: {
        //         width: '300px',
        //         left: '20%',
        //         top: '12%',
        //     },
        // },
        // {
        //     name: 'cg',
        //     image: './static/image/pendant/cg.png',
        //     style: {
        //         width: '1200px',
        //         right: '12%',
        //         top: '8%',
        //     },
        // },
        // {
        //     name: '恭喜中奖',
        //     image: './static/image/pendant/恭喜中奖.png',
        //     style: {
        //         right: '3%',
        //         bottom: '3%',
        //     },
        // },
    ],

    // 控制器
    control: {
        style: {
            left: '6%',
            bottom: '12%',
        },
    },

    // 抽奖台
    lottery: {
        title: '未配置 - xxx庆功宴抽奖',
        freq: 50, // 当实在放不下时，自动滚动频率，ms
        size: [
            [3, 2.5],
            [5, 2.0],
            [10, 1.6],
            [15, 1.3],
            [20, 1.2],
            [30, 1.0],
            [50, 0.7],
            [999, 0.7],
        ],
        style: {
            minHeight: '30%',
            maxHeight: '64%',
            maxWidth: '60%',
            left: '10%',
            top: '15%',
        },
    },

    // 滚筒区域
    roller: {
        freq: 100, // ms
        size: [
            [3, 2.5],
            [10, 2.0],
            [20, 1.8],
            [30, 1.5],
            [50, 1.0],
            [999, 1.0],
        ],
        style: {
            height: '80%',
            minWidth: '50%',
            right: '10%',
            bottom: '10%',
        },
    },

    // 抽奖回合
    get turns() {
        return [
            { name: '未配置 - 第一轮抽奖', quota: 3, },
            { name: '未配置 - 第二轮抽奖', quota: 5, },
            { name: '未配置 - 第三轮抽奖', quota: 10, },
            { name: '未配置 - 第四轮抽奖', quota: 15, },
            { name: '未配置 - 第五轮抽奖', quota: 20, },
            { name: '未配置 - 第六轮抽奖', quota: 30, },
            { name: '未配置 - 第七轮抽奖', quota: 50, },
            { name: '未配置 - 第八轮抽奖', quota: 100, },
        ];
    },

    // 数据集
    get dataset() { return new Array(160).fill().map((_, i) => ({ name: `姓名${i}`, code: `xxx${i}xxx`, })); },

    body: {
        bgi: './static/image/bgi.jpg', // 背景图片
        bgm: './static/audio/bgm.mp3', // 背景音乐
    },

    renderUser: (data) => data.name ? `${data.name} [${data.code}]` : data.code,
};
window.config = config;

{
    let _title = config.lottery.title;
    config.lottery.__defineGetter__('title', () => _title);
    // check.lottery.title
    const checkTitle = (title) => {
        const search = decodeURIComponent(location.search);
        if (search.indexOf(`config=${title}`) == -1) {
            throw new Error(`prevent to load a config because of mismatching title, title: "${title}", found: "${search}"`);
        }
        _title = title;
        console.info(title);
    };
    config.lottery.__defineSetter__('title', checkTitle);
}

{
    // check.turns
    const checkTurns = (turns) => {
        const names = new Set();
        const errs = [];
        turns.forEach((data, index) => names.has(data.name) ? errs.push(`${index}: ${data.name}`) : names.add(data.name));
        if (errs.length > 0) {
            throw new Error(`invalid turns, name conflict: ${JSON.stringify(errs)}`);
        }
    };
    config.__defineSetter__('turns', (turns) => {
        checkTurns(turns);
        config.__defineGetter__('turns', () => turns);
        console.info('共计', turns.reduce((l, r) => l + r.quota, 0), '个抽奖名额');
    });
    checkTurns(config.turns);
}

{
    // check.dataset
    const checkDataset = (dataset) => {
        const codes = new Set();
        const errs = [];
        dataset.forEach((data, index) => codes.has(data.code) ? errs.push(`${index}: ${data.code}`) : codes.add(data.code));
        if (errs.length > 0) {
            throw new Error(`invalid dataset, code conflict: ${JSON.stringify(errs)}`);
        }
    };
    config.__defineSetter__('dataset', (dataset) => {
        checkDataset(dataset);
        config.__defineGetter__('dataset', () => dataset);
        console.info('共计', dataset.length, '人参与抽奖');
    });
    checkDataset(config.dataset);
}