/**
 * Role.js
*/
export default class Role extends Laya.Sprite {
    
    constructor() {
        super();
        
        console.log('Role ==> constructor');

        this.type = "";     
        this.hp = 0;
        this.speed = 0;
        this.action = "";

        //实例动画
        this.roleAni = new Laya.Animation();
        this.roleAni.loadAnimation("GameRole.ani");
    }

    //角色初始化, 类型名字、血量、速度
    init(type, hp, speed) {
        this.type = type;
        this.hp = hp;
        this.speed = speed;
        this.addChild(this.roleAni);

        this.roleAni.on(Laya.Event.COMPLETE, this, this.onComplete);
        this.playAction('fly');
    }

    onComplete() {
        if (this.roleAni.width === 0) {
            var bounds = this.roleAni.getBounds();
            this.roleAni.size(bounds.width, bounds.height);
        }
    }

    //播放动画
    playAction(action) {
        this.action = action;
        this.roleAni.play(true, 'enemy1_fly');
        console.log(this.type + '_' + action);
    }


    //检测是否移除屏幕
    upateRole() {
        if (this.type === 'hero') {
            if (this.x < this.roleAni.width / 2) {
                this.x = this.roleAni.width/2;
            } else if (this.x > 720 - this.roleAni.width/2) {
                this.x = 720 - this.roleAni.width/2;
            }

            if (this.y < this.roleAni.height/2) {
                this.y = this.roleAni.height/2;
            } else if (this.y > 1280 - this.roleAni.height/2) {
                this.y = 1280 - this.roleAni.height/2;
            }
        }
    }

    //死亡
    die() {
        this.roleAni.stop();
        this.roleAni.offAll();
        this.removeSelf();
        Laya.Pool.recover('role', this);
    }

    //角色更新
    update() {
        //如果角色隐藏，角色消亡并回收
        if (this.visible === false) {

        }
        
        //角色根据速度飞行
        this.y += this.speed;

        //如果移动到显示区域以外，则隐藏
        if (this.type !== 'hero' && (this.y > 1280 + 100 || this.y < -150)) {
            this.visible = false;
        }

        //
        this.upateRole();
    }
}