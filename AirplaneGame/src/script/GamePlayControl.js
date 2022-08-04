/**
 * GamePlayControl.js
*/
export default class GamePlayControl extends Laya.Script{
    /** @prop {name:pause_mask, tip:"暂停遮罩", type:Node} */
    /** @prop {name:pause_box, tip:"暂停提示", type:Node} */

    constructor() {
        super();

        this.pause_mask = null;
        this.pause_box = null;
    }

    onEnable() {
        this.gameInit();
        
    }

    //初始化
    gameInit() {
        this.pause_mask.visible = false;
        this.pause_box.visible = false;

        //暂停按钮事件
        this.top_bar = this.owner.getChildByName('top_bar');
        this.btn_pause = this.top_bar.getChildByName('btn_pause');
        this.btn_pause.on(Laya.Event.CLICK, this, this.gamePause);
    }

    //游戏结束
    gameOver() {
        Laya.Scene.open('GameOver.scene');
    }

    //游戏暂停
    gamePause() {
        this.pause_mask.visible = true;
        this.pause_box.visible = true;

        //监听鼠标点击事件
        Laya.stage.once(Laya.Event.MOUSE_DOWN, this, this.onContinue)
    }

    //继续游戏
    onContinue() {
        this.pause_mask.visible = false;
        this.pause_box.visible = false;

    }
}