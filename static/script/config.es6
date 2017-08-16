/**
 * 配置.
 * @typedef {{ name: string, image: string, style: CSSStyleDeclaration, }[]} Pendants
 * @typedef {{ style: CSSStyleDeclaration, }} Control
 * @typedef {{ title: string, style: CSSStyleDeclaration, }} Lottery
 * @typedef {{ freq: number, style: CSSStyleDeclaration, }} Roller
 * @typedef {{ name: string, code: string, }[]} Dataset
 * @typedef {{ name: string, quota: number, }[]} Turns
 * @type {{ pendants: Pendants, control: Control, lottery: Lottery, roller: Roller, dataset: Dataset, turns: Turns}}
 */
const config = { // eslint-disable-line no-unused-vars
    // 挂件
    pendants: [
        {
            name: 'logo',
            image: './static/image/pendant/logo.png',
            style: {
                width: '300px',
                left: '20%',
                top: '12%',
            },
        },
        {
            name: 'cg',
            image: './static/image/pendant/cg.png',
            style: {
                width: '1200px',
                right: '12%',
                top: '8%',
            },
        },
        {
            name: '恭喜中奖',
            image: './static/image/pendant/恭喜中奖.png',
            style: {
                right: '3%',
                bottom: '3%',
            },
        },
    ],

    // 控制器
    control: {
        style: {
            left: '6%',
            top: '15%',
        },
    },

    // 抽奖台
    lottery: {
        title: '射雕英雄传手游庆功宴抽奖',
        style: {
            height: '60%',
            maxWidth: '60%',
            left: '10%',
            bottom: '12%',
        },
    },

    // 滚筒区域
    roller: {
        freq: 100, // ms
        style: {
            height: '80%',
            width: '50%',
            right: '10%',
            bottom: '10%',
        },
    },

    // 抽奖回合
    turns: [
        { name: '一等奖', quota: 3, },
        { name: '二等奖', quota: 10, },
        { name: '三等奖', quota: 20, },
    ],

    // 数据集
    dataset: new Array(100).fill().map((_, i) => ({ name: `Name_${i}`, code: `code_${i}`, })),
};
window.config = config;

// check.dataset
((dataset) => {
    const codes = new Set();
    const errs = [];
    dataset.forEach((data, index) => codes.has(data.code) ? errs.push(`${index}: ${data.code}`) : codes.add(data.code));
    if (errs.length > 0) {
        throw new Error(`invalid dataset, code conflict: ${JSON.stringify(errs)}`);
    }
})(config.dataset);
