/**
 * Role.js
*/
export default class Role extends Laya.Sprite {
    
    constructor() {
        super();
    }

    onEnable() {
        this.type = "";     
        this.hp = 0;
        this.speed = 0;
        this.action = "";

        //实例动画
        this.roleAni = new Laya.Animation();
        this.roleAni.loadAnimation("GameRole.ani");
    }

    //角色初始化
    init(type, hp, speed) {
        this.type = type;
        this.hp = hp;
        this.speed = speed;
        this.addChild(this.roleAni);
        this.playAction('fly');
    }

    //播放动画
    playAction(action) {
        this.action = action;
        this.roleAni.play(0, true, this.type + '_' + action);
    }
}