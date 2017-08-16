/// <reference path="./config.es6" />

{
    const container = document.querySelector('#pendant');
    config.pendants.forEach((data) => { // eslint-disable-line no-undef
        const img = document.createElement('img');
        container.appendChild(img);

        img.src = data.image;
        img.alt = data.name;
        for (const key in data.style) {
            img.style[key] = data.style[key];
        }
    });
}