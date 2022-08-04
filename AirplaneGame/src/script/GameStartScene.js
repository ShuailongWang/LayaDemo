/**
 * GameStartScene.js
*/
export default class GameStartScene extends Laya.Scene {
    constructor() {
        super();
    }

    onEnable() {

        //开始按钮添加点击事件
        this.btn_start = this.getChildByName('btn_start');
        this.btn_mask = this.btn_start.getChildByName('btn_mask');
        this.btn_mask.on(Laya.Event.CLICK, this, function(e){
            e.stopPropagation();
            //加载游戏场景
            Laya.Scene.open('GamePlay.scene');
        });
    }
}