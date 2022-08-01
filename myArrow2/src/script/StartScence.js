/**
    StartScence.js
    runtime使用
*/

import GameManager from "./GameManager"

export default class StartScence extends Laya.Scene {
    constructor() {
        super();
    }

    onEnable() {
        //获取本地数据
        getLocalStorage();

        //初始化数据
        GameManager.getInstance().hitpoint = 3;
        GameManager.getInstance().hitBall = 0;

        this.text_hp.text = 'x' + GameManager.getInstance().hitpoint;
        this.text_ball.text = 'x' + GameManager.getInstance().hitBall;
        this.text_gold.text = 'x' + GameManager.getInstance().gold;

        // var startBtn = this.getChildByName('start_btn');
        // startBtn.on(Laya.Event.CLICK, this, function(e){
        //     e.stopPropagation();//防止冒泡
        //     Laya.Scene.open('mainScence.scene');
        // });

        //按钮的点击事件
        this.btn_start.on(Laya.Event.CLICK, this, function(e) {
            e.stopPropagation(); //防止冒泡
            //加载场景
            Laya.Scene.open('mainScence.scene');
        });
    }
}

//获取本地存储
function getLocalStorage() {
    var gold = Laya.LocalStorage.getItem('gold');
    if (gold) {
        GameManager.getInstance().gold = parseInt(gold);
    } else {
        Laya.LocalStorage.setItem('gold', 0);
    }
}