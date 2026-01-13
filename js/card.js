class Card {

    imageUrl;
    width;
    height;
    x;
    y;
    imageWidth;
    imageHeight;

    constructor(imageUrl, width, height, x, y, imageWidth, imageHeight) {
        this.imageUrl = imageUrl;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
    }
}

class CardElement {

    box;
    view;
    isFront;
    /** @type{Card} 正面。 */
    front;
    /** @type{Card} 背面。 */
    back;

    lock;
    rotateAngle = 0;
    innerRotateAngle = 0;
    rotateYAngle = 0;

    constructor(url, width, height, x, y, imageWidth, imageHeight) {
        if (!x) x = 0;
        if (!y) y = 0;
        this.front = new Card(url, width, height, x, y, imageWidth, imageHeight);
        this.view = document.createElement('card');
        this.view.card = this;
        this.view.style.display = 'block';
        this.view.style.cursor = 'pointer';
        // 卡片边框
        this.view.style.borderStyle = 'solid';
        this.view.style.borderWidth = '2px';
        this.view.style.borderColor = 'rgb(' + (~~(Math.random() * 16) | 48) + ',' + (~~(Math.random() * 16) | 48) + ',' + (~~(Math.random() * 16) | 48) + ')';
        this.view.style.backgroundOrigin = 'border-box';
        // this.view.style.boxShadow = '0 0 0 4px #333 inset';

        this.view.style.width = width + 'px';
        this.view.style.height = height + 'px';
        // 前提是正反面素材文件尺寸完全一致
        if (imageWidth && imageHeight) this.view.style.backgroundSize = imageWidth + 'px ' + imageHeight + 'px';

        this.view.style.transformOrigin = '50% 50%';
        this.isFront = 1;

        this.box = document.createElement('div');
        this.box.card = this;
        this.box.className = 'card';
        this.box.style.width = width + 'px';
        this.box.style.height = height + 'px';
        this.box.style.perspective = '800px';

        this.box.append(this.view);
        // 绘制
        this.paint(this.front);
    }

    setBack(back) {
        this.back = back;
    }

    paint(card) {
        this.view.style.backgroundImage = 'url(' + card.imageUrl + ')';
        this.view.style.backgroundPosition = -card.x + 'px ' + -card.y + 'px';
    }

    /**
     * 插入到容器元素中。
     * 
     * @param {Element} box 父级元素
     */
    insert(box) {
        box.append(this.box);
    }

    // rotate(angle, reverse) {
    //     if (this.lock) return 'lock';
    //     this.lock = 1;
    //     let target, timer;
    //     if (reverse) {
    //         target = this.rotateAngle - angle;
    //         timer = setInterval(() => {
    //             this.view.style.transform = 'rotate(' + --this.rotateAngle + 'deg)' + ' rotateY(' + this.rotateYAngle + 'deg)';
    //             if (this.rotateAngle == target) {
    //                 clearInterval(timer);
    //                 this.lock = 0;
    //             }
    //         }, 1);
    //     } else {
    //         target = this.rotateAngle + angle;
    //         timer = setInterval(() => {
    //             this.view.style.transform = 'rotate(' + ++this.rotateAngle + 'deg)' + ' rotateY(' + this.rotateYAngle + 'deg)';
    //             if (this.rotateAngle == target) {
    //                 clearInterval(timer);
    //                 this.lock = 0;
    //             }
    //         }, 1);
    //     }
    // }

    flip() {
        if (this.lock) return 'lock';
        this.lock = 1;
        this.view.style.transition = '0s';
        let timer = setInterval(() => {
            this.view.style.transform = 'rotate(' + this.innerRotateAngle + 'deg)' + ' rotateY(' + ++this.rotateYAngle + 'deg)';
            if (this.rotateYAngle == 90) {
                if (this.isFront) {
                    this.paint(this.back);
                    this.isFront = 0;
                } else {
                    this.paint(this.front);
                    this.isFront = 1;
                }
                this.rotateYAngle = -90;
            }
            if (!this.rotateYAngle) {
                clearInterval(timer);
                this.view.style.transition = 'all .5s';
                this.lock = 0;
            }
        }, 1);
    }

    // flip() {
    //     if (this.lock) return 'lock';
    //     this.lock = 1;
    //     this.view.style.transition = 'transform .3s';
    //     this.view.style.transform = 'rotate(' + this.rotateAngle + 'deg)' + ' rotateY(90deg)';
    //     setTimeout(() => {
    //         if (this.isFront) {
    //             this.paint(this.back);
    //             this.isFront = 0;
    //         } else {
    //             this.paint(this.front);
    //             this.isFront = 1;
    //         }
    //         this.view.style.transition = 'all .1s';
    //         this.view.style.transform = 'rotate(' + this.rotateAngle + 'deg)' + ' rotateY(-90deg)';
    //         // this.view.style.transition = 'all .3s';
    //         this.view.style.transition = 'all .5s';
    //         this.view.style.transform = 'rotate(' + this.rotateAngle + 'deg)' + ' rotateY(0)';
    //         // this.view.style.transition = 'all .5s';
    //         this.lock = 0;
    //     }, 300);
    // }
}