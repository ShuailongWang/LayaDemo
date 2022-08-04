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
        this.hitRadius = 0;
        this.camp = 0;
        this.action = "";

        //实例动画
        this.roleAni = new Laya.Animation();
        this.roleAni.loadAnimation("GameRole.ani");
    }

    /*
    * 角色初始化
    * @param type  角色类型：“hero”:玩家飞机，“enemy1-3”：敌人飞机、“bulle:1-2”：子弹、"ufo1-2":道具
    * @param hp      血量
    * @param speed   速度
    * @param hitRadius   碰撞半径
    * @param camp    阵营
    */
    init(type, hp, speed, hitRadius, camp) {
        this.type = type;
        this.hp = hp;
        this.speed = speed;
        this.hitRadius = hitRadius;
        this.camp = camp;
        this.addChild(this.roleAni);

        this.roleAni.on(Laya.Event.COMPLETE, this, this.onComplete);
        this.playAction('fly');
    }

    //动画播放完成
    onComplete() {
        if (this.roleAni.width === 0) {
            var bounds = this.roleAni.getBounds();
            this.roleAni.size(bounds.width, bounds.height);
        }

         //如果死亡动画播放完成
         if (this.action === "die") {
             //update()中，隐藏后进行移除回收
             this.visible=false;
         } else if(this.action === "hit") {
            //如果是受伤动画，下一帧播放飞行动画
             this.playAction("fly");
         }
    }

    //播放动画
    playAction(action) {
        this.action = action;
        //this.roleAni.play(0, true, 'enemy1_fly');
        this.roleAni.play(0, true, this.type + '_' + action);
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
            //主角死亡不回收，只隐藏，以免其他对象以主角回收对象创建，发生引用修改
            if (this.type === 'hero') {
                this.die();
                return;
            }
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

    //角色掉血
    roleLostHp(lostHp) {
        this.hp -= lostHp;
        if (this.hp > 0) {
            //如果未死亡，则播放受击动画
            this.playAction('hit');
        } else {
            //播放死亡动画
            this.playAction('die');
        }
    }

}