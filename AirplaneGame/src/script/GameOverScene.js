/**
 * GameOverScene.js
*/
import GameManager from './GameManager'

export default class GameOverScene extends Laya.Scene {
    constructor() {
        super();
    }

    onEnable() {
        //本局得分
        this.lab_score = this.getChildByName('lab_score');
        this.lab_score.text = '本局积分：' + GameManager.getInstance().score;

        //重新开始按钮添加点击事件
        this.btn_reset = this.getChildByName('btn_reset');
        this.btn_mask = this.btn_reset.getChildByName('btn_mask');
        this.btn_mask.on(Laya.Event.CLICK, this, function(e){
            e.stopPropagation();
            //加载游戏场景
            Laya.Scene.open('GamePlay.scene');
        });
    }
}