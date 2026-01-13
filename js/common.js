// 乱序排序
function randomSort(list) {
    for (let i = list.length; i > 1;) {
        let r = ~~(Math.random() * i);
        let tmp = list[r];
        list[r] = list[--i];
        list[i] = tmp;
    }
    return list;
}