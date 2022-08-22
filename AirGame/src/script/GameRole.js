/**
 * GameRole.js
*/

import GameManager from './GameManager'

export default class GameRole extends Laya.Sprite {
    constructor() {
        super();

        this.type = "";
        this.hp = 0;
        this.speed = 0;
        this.hitRadius = 0;
        this.camp = 0;
        this.animationName = "";
        
        this.propType = 0;          //道具类型，0飞机子弹，1子弹箱子，2血瓶
        this.isBullet = false;      //是否子弹
        this.bulletLevel = 1;       //自当等级
        this.shootNum = 1;          //子弹数量
        this.shootInterval = 300;   //射击间隔
        this.shootTime = 300;       //发射间隔

        this.bulletPos = [          //等级1，2，3，4，发射多少发子弹
            [0],
            [-15, 15],
            [-30, 0 , 30],
            [-45, -15, 15, 45]
        ];

        //实例角色动画
        this.roleAni = new Laya.Animation();
        this.roleAni.loadAnimation('GameRoleAni.ani');
    }

    /**
     * 初始化
     * 类型
     * 血量
     * 速度
     * 碰撞范围
     * 阵营
    */
    init(type, hp, speed, hitRadius, camp) {
        //console.log(type + ', ' + hp + ', '  + speed + ', '  + hitRadius + ', '  + camp);

        this.type = type;
        this.hp = hp;
        this.speed = speed;
        this.hitRadius = hitRadius;
        this.camp = camp;
        this.propType = 0;
        this.isBullet = false;
        this.visible = true;
        this.addChild(this.roleAni);

        this.roleAni.on(Laya.Event.COMPLETE, this, this.animationComplete);
        this.playAnimation('fly');
    }

    //播放动画
    playAnimation(animationName) {
        this.animationName = animationName;
        this.roleAni.play(0, true, this.type + '_' + animationName);
    }

    //动画播放完成
    animationComplete() {
        //判断是否已经有大小了
        if (this.roleAni.width === 0) {
            var bounds = this.roleAni.getBounds();
            this.roleAni.size(bounds.width, bounds.height);
        }

        //判断是否死亡
        if (this.animationName === 'die' || this.animationName === 'down') {//死亡
            this.visible = false;   //消失

            this.lostProp();
        } else if (this.animationName === 'hit') {//受伤
            this.playAnimation('fly');
        }
    }

    //检测是否移除屏幕
    checkRoleForMoveScreen() {
        if (this.type !== 'hero') {
            return;
        }

        if (this.x < this.roleAni.width/2) {
            this.x = this.roleAni.width/2;
        } else if (this.x > 720 - this.roleAni.width/2) {
            this.x = 720 - this.roleAni.width/2;
        }

        if (this.y <  80 + this.roleAni.height/2) {
            this.y = 80 + this.roleAni.height/2;
        } else if (this.y > 1280 - this.roleAni.height/2) {
            this.y = 1280 - this.roleAni.height/2;
        }
    }

    //敌机动起来
    updateHero() {
        if (this.visible === false) {
            if (this.type !== 'hero') {//敌机销毁
                this.dieRole();
                return
            }
        }

        //敌机飞行
        this.y += this.speed;

        //屏幕外，不展示
        if (this.y !== 'hero' &&  (this.y > 1280 + 100 || this.y < 80)) {
            this.visible = false;
        }
        
        //检测是否移除屏幕
        this.checkRoleForMoveScreen();
    }

    //死亡
    dieRole() {
        this.roleAni.stop();
        this.roleAni.offAll();
        this.removeSelf();
        Laya.Pool.recover('role', this);
    }

    //掉血
    lostRoleHp(hp) {
        this.hp -= hp;

        if (this.hp > 0) {
            if (this.type === 'hero') {
                GameManager.shared().roleHP--;
            }
            this.playAnimation('hit');
            return;
        } 

        //如果是子弹
        if (this.isBullet === true) {
            this.visible = false;
            return;
        }

        //死亡
        if (this.type === 'hero') {
            Laya.SoundManager.playSound('res/sound/game_over.mp3');
            this.playAnimation('die');
        } else {
            GameManager.shared().roleScore++;
            Laya.SoundManager.playSound('res/sound/' + this.type + '_die.mp3');
            this.playAnimation('down');
        }
    }

    //吃道具
    eatProp(role) {
        if (this.type !== 'hero' || role.propType === 0) {
            return;
        }
        
        if (role.propType === 1) {
            //子弹等级增加
            this.bulletLevel++;

            //子弹每升级2级，子弹数量+1
            this.shootNum = Math.min(Math.floor(this.bulletLevel/2) + 1, 4);

            //发射间隔越快
            this.shootInterval = 300 - 8 * (this.bulletLevel > 8 ? 8 : this.bulletLevel);

        } else if (role.propType === 2) {
            this.hp += 2;
            GameManager.shared().roleHP+=2;
        }
        role.hp = 0;
        role.visible = false;
        Laya.SoundManager.playSound('res/sound/achievement.mp3');
    }

    //死亡掉落道具
    lostProp() {
        if (this.type !== 'enemy3') {
            return;
        }
        
        var prop = Laya.Pool.getItemByClass('hero', GameRole);
        var num = (Math.random() < 0.7) ?1:2;
        prop.init('ufo'+num, 1, 2, 30, 1);
        prop.propType = num;//子弹、雪包
        prop.pos(this.x, this.y);
        this.parent.addChild(prop);
    }

    //发射子弹
    fireBullet() {
        var time = Laya.Browser.now();

        if (time < this.shootTime) {
            return;
        }

        //创建子弹
        var pos = this.bulletPos[this.shootNum - 1];
        for (var i = 0; i < pos.length; i++) {
            this.shootTime = time + this.shootInterval;

            var bullet = Laya.Pool.getItemByClass('role', GameRole);
            bullet.init('bullet2', 1, -10, 1, this.camp);
            bullet.isBullet = true;
            bullet.pos(this.x + pos[i], this.y - 80);
            this.parent.addChild(bullet);

            Laya.SoundManager.playSound('res/sound/bullet.mp3');
        }
    }
}