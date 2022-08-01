/**
    StartScence.js
    runtime使用
*/
export default class StartScence extends Laya.Scene {
    constructor() {
        super();
    }

    onEnable() {
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