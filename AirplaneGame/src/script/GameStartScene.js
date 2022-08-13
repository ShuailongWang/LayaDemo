/**
 * GameStartScene.js
*/
export default class GameStartScene extends Laya.Scene {
    constructor() {
        super();
    }

    onEnable() {
        //加载图片资源
        Laya.loader.load([
            {url:"res/atlas/gameRole.atlas"},
            {url:"res/sound/achievement.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/bullet.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/game_over.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/enemy1_die.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/enemy3_out.mp3", type:Laya.Loader.SOUND},
        ], Laya.Handler.create(this, function(){
            console.log('1111');
        }));


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