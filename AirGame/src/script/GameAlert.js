/**
 * GameAlert.js
*/

import GameManager from './GameManager'

export default class GameAlert extends Laya.Scene {
    constructor() {
        super();
    }

    onEnable() {
        //加载资源
        Laya.loader.load([
            {url:'res/atlas/gameRole.atlas'},
            {url:'res/atlas/gameUI.atlas'},
            {url:'res/sound/achievement.mp3', type:Laya.Loader.SOUND},
            {url:'res/sound/bullet.mp3', type:Laya.Loader.SOUND},
            {url:'res/sound/game_over.mp3', type:Laya.Loader.SOUND},
            {url:'res/sound/enemy1_die.mp3', type:Laya.Loader.SOUND},
            {url:'res/sound/enemy2_die.mp3', type:Laya.Loader.SOUND},
            {url:'res/sound/enemy3_die.mp3', type:Laya.Loader.SOUND},
            {url:'res/sound/enemy3_out.mp3', type:Laya.Loader.SOUND},
        ], Laya.Handler.create(this, function(){
            console.log('资源加载成功');
            this.setup();
        }));
    }

    setup() {
        //开始游戏按钮点击事件
        this.btnView = this.getChildByName('btnView');
        this.btnImg = this.btnView.getChildByName('btnImg');
        
        this.btnMask = this.btnView.getChildByName('btnMask');
        this.btnMask.on(Laya.Event.CLICK, this, function(e){
            GameManager.shared().isEndGameBol = false;
            Laya.Scene.open('GamePlay.scene');
        });
    }
}