/**
 * MainScene.js
*/

import GameManager from "./GameManager"

export default class MainScene extends Laya.Scene {
    constructor() {
        super();
    }

    onEnable() {
        this.onballUpdate();

        //接受气球破裂消息
        Laya.stage.on(Laya.Event.MESSAGE, this, function(data){
            if (data === 'ballbreak') {
                this.onballUpdate();
            }
        })
    }

    onballUpdate() {
        console.log('onballUpdate');
        this.text_hp.text = 'x' + GameManager.getInstance().hitpoint;
        this.text_ball.text = 'x' + GameManager.getInstance().hitBall;
        this.text_gold.text = 'x' + GameManager.getInstance().gold;

        if (GameManager.getInstance().hitpoint === 0) {
            console.log('onballUpdate');
            GameManager.getInstance().hitpoint = 3;
            setLocalStorage();
            Laya.Scene.open('startScence.scene');
        }
    }
}

function setLocalStorage() {
    //储存单个数据
    Laya.LocalStorage.setItem('gold', GameManager.getInstance().gold);

    //储存JSOn对象
    var sorceInfo = {};
    sorceInfo.gold = GameManager.getInstance().gold;
    sorceInfo.hightScore = GameManager.getInstance().hitBall;
    Laya.LocalStorage.setJSON('sorceInfo', sorceInfo);
}