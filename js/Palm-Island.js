let cardStates = [];
let cardViews = [];
let outView = document.getElementsByClassName('out-view')[0];
let buttonPanel = document.getElementsByClassName('button-panel')[0];
let infoView = document.getElementsByClassName('info')[0].getElementsByTagName('pre')[0];
let ZOOM = 0.2;
let LEFT = 360 * ZOOM;
let RESOURCES_HEIGHT = 160 * ZOOM;

let unexecuted2 = 1;
let storeCount = 0;
let deskSeed = [];

buttonPanel.style.marginTop = 956 * 2 * ZOOM + 36 + 'px';

// 创建view列表
for (let i = 0; i < 16; i++) {
    let temp = new CardElement('image/a.jpg', 660 * ZOOM, 956 * ZOOM, 660 * ZOOM * (i % 5), 956 * ZOOM * ~~(i / 5), 3300 * ZOOM, 3824 * ZOOM);
    temp.setBack(new Card('image/b.jpg', 660 * ZOOM, 956 * ZOOM, 660 * ZOOM * (i % 5), 956 * ZOOM * ~~(i / 5), 3300 * ZOOM, 3824 * ZOOM));
    temp.box.style.top = 0;
    temp.box.style.left = LEFT + 'px';
    temp.id = i;

    // 设置重置函数
    temp.box.reset = function() {
        if (!(this.card.rotateAngle % 180)) return;
        this.card.rotateAngle -= 90;
        this.style.transform = '';
        redress(15);
    }
    temp.box.onclick = temp.box.reset;
    temp.insert(outView);
    cardViews.push(temp);
}

// 洗牌并记录卡组种子
randomSort(cardViews);
for (let i = 16; i--;) deskSeed.push(cardViews[i].id + 1);
infoView.innerText = '当前得分：0    轮次：1/8\n开局卡组顺序：\n' + deskSeed.join('-') + '-17';

// 插入轮次卡到牌堆底
let round = 1;
let roundCard = new CardElement('image/a.jpg', 660 * ZOOM, 956 * ZOOM, 660 * ZOOM, 956 * ZOOM * 3, 3300 * ZOOM, 3824 * ZOOM);
roundCard.setBack(new Card('image/b.jpg', 660 * ZOOM, 956 * ZOOM, 660 * ZOOM, 956 * ZOOM * 3, 3300 * ZOOM, 3824 * ZOOM));
roundCard.box.style.top = 0;
roundCard.box.style.left = LEFT + 'px';
roundCard.id = 16;
roundCard.insert(outView);
cardViews.unshift(roundCard);

// 错位纠正
function redress(index) {
    storeCount = 0;
    while (index--)
        if (cardViews[index].rotateAngle % 180) {
            cardViews[index].box.style.transformOrigin = (660 * ZOOM + RESOURCES_HEIGHT * storeCount) / 2 + 'px ' +
                (1252 * ZOOM + RESOURCES_HEIGHT * storeCount) / 2 + 'px';
            storeCount++;
        }
}

setTimeout(() => { paint() }, 200);

function paint() {
    // 资源卡归位
    if (cardViews[0].rotateAngle % 180) redress(16);
    for (let i = 0; i < 15; i++) {
        cardViews[i].box.style.top = i + 'px';
        cardViews[i].box.style.left = LEFT - i + 'px';
        cardViews[i].box.style.zIndex = 10 + i;
    }
    if (!cardViews[15]) return;
    cardViews[15].box.style.top = 956 * ZOOM + 16 + 'px';
    cardViews[15].box.style.left = LEFT + 660 * ZOOM + 'px';
    cardViews[15].box.style.zIndex = 25;
    if (!cardViews[16]) return;
    cardViews[16].box.style.top = 956 * ZOOM + 16 + 'px';
    cardViews[16].box.style.left = LEFT - 330 * ZOOM + 'px';
    cardViews[16].box.style.zIndex = 26;
}

// 横置时，横置托盘
function store(index) {
    let e = cardViews[index];
    // 已横置/存储到达上限/轮次卡，不能横置
    if (!((e.rotateAngle + 90) % 180) || storeCount == 4 || e.id == 16) return;
    cardViews[index].rotateAngle += 90;
    e.box.style.transformOrigin = 330 * ZOOM + 'px ' + 626 * ZOOM + 'px';
    e.box.style.transform = 'rotate(' + e.rotateAngle + 'deg)';
    storeCount++;
    if (index == 15) unexecuted2 = 0;
}

// 旋转时，旋转画面
function rotate(index) {
    let e = cardViews[index];
    if (!((e.rotateAngle + 90) % 180)) return;
    cardViews[index].innerRotateAngle = cardViews[index].innerRotateAngle == 180 ? 0 : 180;
    e.view.style.transformOrigin = 'center';
    e.view.style.transform = 'rotate(' + cardViews[index].innerRotateAngle + 'deg)';
    if (index == 15) unexecuted2 = 0;
}

function flip(index) {
    let e = cardViews[index];
    if (!((e.rotateAngle + 90) % 180)) return;
    e.flip();
    if (index == 15) unexecuted2 = 0;
}

// 推动卡组
function pushDeck(pushTow) {
    if (pushTow) {
        if (unexecuted2) return;
        unexecuted2 = 1;
        let top = cardViews.pop();
        cardViews.unshift(cardViews.pop());
        cardViews.push(top);
    } else cardViews.unshift(cardViews.pop());
    paint();
    // 资源外推
    if (cardViews[0].rotateAngle % 180)
        cardViews[0].box.style.transformOrigin = (660 * ZOOM + RESOURCES_HEIGHT * (storeCount - 1)) / 2 + 'px ' +
        (1252 * ZOOM + RESOURCES_HEIGHT * (storeCount - 1)) / 2 + 'px';
    // 检查顶牌是否已存储
    if (cardViews[16].rotateAngle % 180) setTimeout(() => {
        cardViews[16].box.onclick();
        pushDeck();
    }, 200);
    // 检查顶牌是否为轮次卡
    if (cardViews[16].id == 16) setTimeout(() => {
        if (round == 8) return gameOver();
        if (round & 1) rotate(16);
        else flip(16);
        round++;
        pushDeck();
    }, 200);
    infoView.innerText = '当前得分：' + getScore() + '    轮次：' + round + '/8';
}

function gameOver() {
    for (let i = 0; i < 16; i++) {
        let scale = 0.9;
        cardViews[i].box.style.transformOrigin = '50% 50%';
        cardViews[i].box.style.transform = 'scale(' + scale + ')';
        cardViews[i].box.style.top = 478 * scale * ~~(cardViews[i].id / 3) * ZOOM + 'px';
        cardViews[i].box.style.left = (cardViews[i].id % 3) * 700 * scale * ZOOM + 'px';
        cardViews[i].box.style.zIndex = 10 + cardViews[i].id;
    }
    cardViews[16].box.style.top = -478 * 4 * ZOOM + 'px';
    buttonPanel.style.display = 'none';
    infoView.innerText = '游戏结束！\n最终得分：' + getScore() + '    轮次：' + round + '/8\n开局卡组顺序：\n' + deskSeed.join('-') + '-17';
}

// 每4元素一张卡，反、正、旋转反、旋转正
let scoreList = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    5, 0, 2, 1,
    5, 0, 2, 1,
    5, 0, 2, 1,
    0, 0, 2, 0,
    0, 0, 2, 0,
    0, 0, 2, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 4,
    6, 0, 3, 1,
    6, 0, 3, 1,
    10, 0, 6, 3,
    10, 0, 6, 3,
    0, 0, 0, 0,
];

function getScore() {
    let score = 0;
    for (let i = 0; i < 17; i++)
        score += scoreList[(cardViews[i].id << 2 | ~~cardViews[i].isFront) | (cardViews[i].innerRotateAngle ? 2 : 0)];
    return score;
}

function showScore() {
    let score = 0;
    for (let i = 0; i < 17; i++)
        score += scoreList[(cardViews[i].id << 2 | ~~cardViews[i].isFront) | (cardViews[i].innerRotateAngle ? 2 : 0)];
    alert('当前得分  ' + score);
}