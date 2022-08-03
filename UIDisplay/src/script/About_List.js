/**
 * About_List.js
*/

export default class About_List extends Laya.Scene {
    constructor() {
        super();
    }

    onEnable() {
        this.dataArray = [
            {
                nickName:'定海神珠',                    //跟boxItem中变量名一致
                headImg:'img/headImage/head1.jpg',
                praise:1
            },
            {
                nickName:'SS',
                headImg:'img/headImage/head2.jpg',
                praise:1
            },
            {
                nickName:'蓝色眼泪',
                headImg:'img/headImage/head3.jpg',
                praise:1
            },
            {
                nickName:'睡觉家住',
                headImg:'img/headImage/head4.jpg',
                praise:1
            },
            {
                nickName:'背包妻子',
                headImg:'img/headImage/head5.jpg',
                praise:1
            },
            {
                nickName:'Alison_fan',
                headImg:'img/headImage/head6.jpg',
                praise:1
            },
            {
                nickName:'善良的大黑',
                headImg:'img/headImage/head7.jpg',
                praise:1
            }
        ];
        this.list1.array = this.dataArray;
    }
}


About_List.prototype.onRender = function(cell, index) {
    var data = this.dataArray[index];
    var headImg = cell.getChildByName('headImg');
    headImg.skin = data.headImg;
    var nickName = cell.getChildByName('nickName');
    nickName.text = data.nickName;
    var praise = cell.getChildByName('praise');
    praise.text = data.praise;
}