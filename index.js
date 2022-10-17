
import shapesIcons from "./shapeIcons.js";
import svg from "./svg.js";

function a() {
    const refs = {
        boardWrapper: document.getElementById('board-wrapper'),
        board: document.getElementById('board'),
        tile: document.getElementById('tile'),
    }

    let vWidth = 7, vHeight = 7;

    let tilesizepx = 40;
    let bWidth = 0;
    let bWidthpx = 0;
    let bHeight = 0;
    let bHeightpx = 0;
    let bOffsetWPx = 0;
    let bOffsetHPx = 0;
    let bsox = 0, bsoy = 0;


    let tilerange = {
        min: { x: 0, y: 0 },
        max: { x: 0, y: 0 },
    };

    function setBoardSize(width, height) {
        let cox = refs.boardWrapper.scrollLeft - bsox;
        let coy = refs.boardWrapper.scrollTop - bsoy;

        bWidth = width;
        bHeight = height;
        bWidthpx = tilesizepx * bWidth;
        bHeightpx = tilesizepx * bHeight;
        bOffsetWPx = tilesizepx * Math.floor(bWidth / 2);
        bOffsetHPx = tilesizepx * Math.floor(bHeight / 2);

        bsox = Math.floor((bHeight - vHeight) / 2) * tilesizepx;
        bsoy = Math.floor((bWidth - vWidth) / 2) * tilesizepx;

        refs.board.style.width = `${bWidthpx}px`;
        refs.board.style.height = `${bHeightpx}px`;

        refs.boardWrapper.scrollTop = bsoy + coy;
        refs.boardWrapper.scrollLeft = bsox + cox;

        console.log(Math.floor((bWidth - 7) / 2) * tilesizepx);
    }



    function setTilePos(x, y) {
        refs.tile.style.left = Math.floor((x / bWidth) * bWidthpx) + bOffsetWPx;
        refs.tile.style.top = Math.floor((y / bHeight) * bHeightpx) + bOffsetHPx;

        if (x > tilerange.max.x) tilerange.max.x = x;
        if (y > tilerange.max.y) tilerange.max.y = y;
        if (x < tilerange.min.x) tilerange.min.x = x;
        if (y < tilerange.min.y) tilerange.min.y = y;

        setBoardSize(
            Math.max(tilerange.max.x - tilerange.min.x + 4, bWidth),
            Math.max(tilerange.max.y - tilerange.min.y + 4, bHeight)
        );
        console.log(tilerange);
    }

    setBoardSize(vWidth, vHeight);
    setTilePos(0, 0);
    setTilePos(1, 0);
    setTilePos(2, 0);
    setTilePos(4, 0);

    // setTimeout(() => {
    //     setBoardSize(13, 13);
    //     setTilePos(1, 2);
    // }, 2000);    
}


function Board() {
    const spacing = 1;
    const tilesize = 40 + spacing * 2; // pixels
    let size;

    const refs = {
        boardWrapper: document.getElementById('board-wrapper'),
        board: document.getElementById('board'),
        tile: document.getElementById('tile'),
    }

    function setSize(min, max) {
        size = { x: max.x - min.x + 1, y: max.y - min.y + 1, min, max };
        // console.log(size);

        refs.board.style.width = `${size.x * tilesize + spacing * 2}px`;
        refs.board.style.height = `${size.y * tilesize + spacing * 2}px`;

        const wsize = {
            x: Number(refs.boardWrapper.style.width.slice(0, -2)),
            y: Number(refs.boardWrapper.style.height.slice(0, -2)),
        }

        console.log({
            x: wsize.x + size.min.x * tilesize,
            y: wsize.y + size.min.y * tilesize
        });
        refs.boardWrapper.scrollTop = wsize.y + size.min.y * tilesize;
        refs.boardWrapper.scrollLeft = wsize.x + size.min.x * tilesize;
    }

    function setWrapperSize(width, height) {
        refs.boardWrapper.style.width = `${width * tilesize + spacing * 2}px`;
        refs.boardWrapper.style.height = `${height * tilesize + spacing * 2}px`;
    }

    function addTile(x, y) {
        const ref = document.createElement('div');
        ref.id = `tile_${x}_${y}`;
        ref.innerText = `${x} ${y}`;
        ref.classList.add('tile');
        updateTile(ref, x, y);
        refs.board.appendChild(ref);

        let update = false;
        const offset = 0;
        if (x + offset > size.max.x) size.max.x = x + offset; update = true;
        if (y + offset > size.max.y) size.max.y = y + offset; update = true;
        if (x - offset < size.min.x) size.min.x = x - offset; update = true;
        if (y - offset < size.min.y) size.min.y = y - offset; update = true;

        if (update) {
            setSize(size.min, size.max);
            updateTiles();
        }
    }

    function updateTile(ref, x, y) {
        ref.style.left = (x - size.min.x) * tilesize + spacing * 2;
        ref.style.top = (y - size.min.y) * tilesize + spacing * 2;
    }

    function updateTiles() {
        const tiles = refs.board.getElementsByClassName('tile');
        for (let ref of tiles) {
            const [, x, y] = ref.id.split('_');
            updateTile(ref, x, y);
        }
    }

    return { setSize, addTile, updateTiles, setWrapperSize };
}

// const board = Board();

// board.setWrapperSize(7, 7);
// board.setSize({ x: -3, y: -3 }, { x: 3, y: 3 });

// const delay = (delayInms) => {
//     return new Promise(resolve => setTimeout(resolve, delayInms));
// }

// (async () => {
//     for (let i = -5; i <= 5; ++i) {
//         board.addTile(i, 0);
//         await delay(500);
//     }
// })();

function fhsla(h, s, l, a) {
    return `hsla(${h},${s}%,${l}%, ${a})`;
}

function getColor(colorId) {
    const hues = [0, 30, 50, 120, 200, 270];
    // const hues = Array(6).fill(0).map((_, i) => 360 / 6 * i);
    const color = [
        hues[colorId],
        100,
        50
    ];
    return color;
}



function game() {
    const refs = {
        boardWrapper: document.getElementById('board-wrapper'),
        board: document.getElementById('board'),
        tile: document.getElementById('tile'),
    }

    let tilesize = 80; // pixels
    const spacing = 2; // pixels, must be even

    const ss = 20;
    const min = { x: -ss, y: -ss };
    const max = { x: ss, y: ss };

    const calcOffset = ({ x, y }) => {
        return {
            x: (spacing + tilesize) * (x - min.x) + spacing,
            y: (spacing + tilesize) * (y - min.y) + spacing,
        };
    };

    const reverseOffset = ({ x, y }) => {
        return {
            x: (x - spacing) / (spacing + tilesize) + min.x,
            y: (y - spacing) / (spacing + tilesize) + min.y,
        };
    }

    const setBoardSize = ({ x, y }) => {
        refs.board.style.width = `${x}px`;
        refs.board.style.height = `${y}px`;
    }

    const setBoardWrapperSize = ({ x, y }) => {
        const height = (spacing + tilesize) * y + spacing;
        const width = (spacing + tilesize) * x + spacing;
        refs.boardWrapper.style.width = `${width}px`;
        refs.boardWrapper.style.height = `${height}px`;
    }

    function updateTile(ref, xt, yt) {
        const { x, y } = calcOffset({ x: xt, y: yt });
        ref.style.left = x + 'px';
        ref.style.top = y + 'px';
    }

    function setScroll({ x, y }) {
        refs.boardWrapper.scrollTop = y;
        refs.boardWrapper.scrollLeft = x;
    }

    function addTile(x, y) {
        const ref = document.createElement('div');
        ref.id = `tile_${x}_${y}`;
        // ref.innerText = `${x} ${y}`;
        ref.classList.add('tile', 'empty');
        ref.style.width = tilesize + 'px';
        ref.style.height = tilesize + 'px';
        ref.style.fontSize = Math.floor(tilesize * 0.3) + 'px';
        if ((x + y) % 2 == 0) ref.classList.add('odd');
        updateTile(ref, x, y);

        refs.board.appendChild(ref);

        // let update = false;
        // const offset = 0;
        // if (x + offset > size.max.x) size.max.x = x + offset; update = true;
        // if (y + offset > size.max.y) size.max.y = y + offset; update = true;
        // if (x - offset < size.min.x) size.min.x = x - offset; update = true;
        // if (y - offset < size.min.y) size.min.y = y - offset; update = true;

        // if (update) {
        //     setSize(size.min, size.max);
        //     updateTiles();
        // }
    }

    function updateTiles() {
        const tiles = refs.board.getElementsByClassName('tile');
        for (let ref of tiles) {
            const [, x, y] = ref.id.split('_');
            updateTile(ref, x, y);
            ref.style.width = tilesize + 'px';
            ref.style.height = tilesize + 'px';
        }
    }

    function updateBoardSize() {
        setBoardSize(calcOffset({ x: max.x + 1, y: max.y + 1 }));
    }

    // {

    //     function checkScroll() {
    //         const d = { x: refs.boardWrapper.scrollLeft, y: refs.boardWrapper.scrollTop };
    //         const offset = 50;
    //         let update = false;
    //         if (d.y > scrollOffset.y + offset) refs.boardWrapper.scrollTop = d.y - 0.1 * (d.y - (scrollOffset.y + offset)); update = true;
    //         if (d.y < scrollOffset.y - offset) refs.boardWrapper.scrollTop = d.y - 0.1 * (d.y - (scrollOffset.y - offset)); update = true;

    //         if (d.x > scrollOffset.x + offset) refs.boardWrapper.scrollLeft = d.x - 0.1 * (d.x - (scrollOffset.x + offset)); update = true;
    //         if (d.x < scrollOffset.x - offset) refs.boardWrapper.scrollLeft = d.x - 0.1 * (d.x - (scrollOffset.x - offset)); update = true;
    //         return update;
    //     }
    //     refs.boardWrapper.onscroll = (e) => {
    //         checkScroll();
    //         // if (checkScroll()) {
    //         //     let timeout;
    //         //     timeout = setInterval(() => {
    //         //         checkScroll();
    //         //         if (!checkScroll()) clearInterval(timeout);
    //         //     }, 10);
    //         // }
    //     }
    // }

    updateBoardSize();
    // const zz = Math.floor(window.innerWidth / (tilesize + spacing));
    // setBoardWrapperSize({ x: zz, y: zz });
    const zz = Math.min(document.body.offsetWidth, document.body.offsetHeight);
    refs.boardWrapper.style.width = `${zz}px`;
    refs.boardWrapper.style.height = `${zz}px`;

    let tileLock = false;

    {
        const ref = document.getElementById('lock');

        const lockIcons = [
            () => svg("white", "M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z", "0 0 448 512"),
            () => svg("white", "M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32V144C576 64.5 511.5 0 432 0S288 64.5 288 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H352V144z", "0 0 576 512"),
        ]

        ref.onclick = () => {
            if (tileLock) {
                ref.replaceChild(lockIcons[1](), ref.firstChild);
            } else {
                ref.replaceChild(lockIcons[0](), ref.firstChild);
            }
            tileLock = !tileLock;
        }
        ref.appendChild(lockIcons[tileLock ? 0 : 1]());
    }

    {
        const ref = document.getElementById('zoom-in');
        ref.onclick = () => {
            tilesize += 10;
            tilesize = Math.min(Math.floor(refs.boardWrapper.offsetWidth / 5), tilesize);
            updateBoardSize();
            updateTiles();
            updateScroll();

        }

        tilesize = Math.min(Math.floor(refs.boardWrapper.offsetWidth / 5), tilesize);
    }

    {
        const ref = document.getElementById('zoom-out');
        ref.onclick = () => {
            tilesize -= 10;
            tilesize = Math.max(20, tilesize);
            updateBoardSize();
            updateTiles();
            updateScroll();
        }
    }



    function updateScroll() {
        let zeroOffset = calcOffset({ x: 0, y: 0 });
        let scrollOffset = {
            x: zeroOffset.x + (tilesize - refs.boardWrapper.offsetWidth) / 2,
            y: zeroOffset.y + (tilesize - refs.boardWrapper.offsetHeight) / 2,
        };

        // console.log(scrollOffset);
        setScroll(scrollOffset);
    }

    updateScroll();

    for (let y = min.y; y <= max.y; y++) {
        for (let x = min.x; x <= max.x; x++) {
            addTile(x, y);
        }
    }


    function activeTile(x, y, firstActive) {
        const ref = document.getElementById(`tile_${x}_${y}`);
        ref.classList.remove('empty');
        const rr = () => Math.floor(Math.random() * 6);
        console.log(x, y, firstActive)
        if (firstActive) ref.appendChild(shapesIcons[rr()](fhsla(...getColor(rr()), 1)));



        ref.onpointerdown = (e) => {
            if (tileLock) return;

            e = e || window.event;
            e.preventDefault();

            const offset = calcOffset({ x, y });

            const setPos = (dx, dy) => {
                // console.log(offset, dx, dy);
                ref.style.left = (offset.x + dx) + 'px';
                ref.style.top = (offset.y + dy) + 'px';
            }

            let x0 = 0, y0 = 0;
            let x1 = 0, y1 = 0;

            // console.log('pointer down', e);
            x0 = e.clientX - refs.board.offsetWidth;
            y0 = e.clientY - refs.board.offsetHeight;
            ref.classList.add('moving');
            ref.id = 'moving_tile';

            addTile(x, y);

            document.onpointerup = (e) => {
                // console.log('pointer up', e);
                document.onpointerup = null;
                document.onpointermove = null;

                x1 = e.clientX - refs.board.offsetWidth;
                y1 = e.clientY - refs.board.offsetHeight;
                const dx = x1 - x0, dy = y1 - y0;

                const roff = reverseOffset({ x: offset.x + dx, y: offset.y + dy });
                const roff2 = {
                    x: Math.floor(roff.x + 0.5),
                    y: Math.floor(roff.y + 0.5),
                }

                updateTile(ref, roff2.x, roff2.y);

                // const rroff = calcOffset(roff2);

                ref.onpointerdown = null;
                ref.classList.remove('moving');

                const id = `tile_${roff2.x}_${roff2.y}`;

                console.log('id', id);
                {
                    const ref2 = document.getElementById(id);
                    console.log(ref2);
                    refs.board.removeChild(ref2);
                }

                ref.id = id;

                activeTile(roff2.x, roff2.y);

            };

            document.onpointermove = (e) => {
                e = e || window.event;
                e.preventDefault();
                // console.log('pointer move');

                x1 = e.clientX - refs.board.offsetWidth;
                y1 = e.clientY - refs.board.offsetHeight;

                setPos(x1 - x0, y1 - y0);
            };

        }

        ref.ontouchmove = (e) => {
            if (tileLock) return;
            e = e || window.event;
            e.preventDefault();
        }
    }

    const rr = () => Math.floor(Math.random() * 7 - 3);
    for (let i = 0; i < 30; i++) {
        const c = { x: rr(), y: rr() };

        const ref = document.getElementById(`tile_${c.x}_${c.y}`);
        if (ref.classList.contains('empty')) {
            activeTile(c.x, c.y, true);
        }
    }



}

game();