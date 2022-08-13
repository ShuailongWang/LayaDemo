/**
 * Role.js
*/
import GameManager from './GameManager'

export default class Role extends Laya.Sprite {
    
    constructor() {
        super();
        
        //console.log('Role ==> constructor');

        this.type = "";     
        this.hp = 0;
        this.speed = 0;
        this.hitRadius = 0;
        this.camp = 0;
        this.action = "";

        this.shootInterval = 300;   //射击间隔
        this.shootTime = 300;       //下次射击时间
        this.isBullet = false;      //是否子弹
        this.propType = 0;          //道具类型 0:飞机或子弹，1:子弹箱，2:血瓶
        this.bulletLevel = 1;       //子弹等级
        this.shootNum = 1;          //子弹数量
        //子弹偏移的位置
        this.bulletPos = [
            [0], [-15, 15], [-30, 0, 30], [-45, -15, 15, 45]
        ];

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
             this.visible = false;

             //是否掉落道具
             this.lostProp();
         } else if(this.action === "hit") {
            //如果是受伤动画，下一帧播放飞行动画
             this.playAction("fly");
         }
    }

    //播放动画
    playAction(action) {
        this.action = action;
        this.roleAni.play(0, true, this.type + '_' + action);
        //console.log(this.type + '_' + action);
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
            if (this.type !== 'hero') {
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
            return;
        }

        //如果是子弹，隐藏
        if (this.isBullet === true) {
            this.visible = false;
            return
        }

        //播放死亡动画
        this.playAction('die');

        //角色死亡音效
        if (this.type === 'hero') {
            Laya.SoundManager.playSound("res/sound/game_over.mp3");
        } else { //敌机死亡音效
            console.log('112233');
            Laya.SoundManager.playSound("res/sound/enemy1_die.mp3");
        }

        //敌机死亡
        if (this.type !== 'hero' && this.isBullet === false) {
            GameManager.getInstance().score++;
        }
    }

    //射击，生成子弹
    shoot() {
        //当前时间
        var time = Laya.Browser.now();

        //如果当前时间大于下次射击时间
        if (time < this.shootTime) {
            return;
        }

        //获得发射子弹的位置数组
        var pos = this.bulletPos[this.shootNum - 1];
        for (var i = 0; i < pos.length; i++) {
            //更新下次子弹射击的时间
            this.shootTime = time + this.shootInterval;
            
            //创建子弹
            var bullet = Laya.Pool.getItemByClass('role', Role);
            bullet.init("bullet2", 1, -10, 1, this.camp);           //子弹阵营与发射者相同
            bullet.isBullet = true;                                 //角色类型为子弹类型
            bullet.visible = true;                                  //对象池中对象死亡时会被隐藏，重新显示
            bullet.pos(this.x + pos[i], this.y - 80);
            this.parent.addChild(bullet);

            //音效
            Laya.SoundManager.playSound("res/sound/bullet.mp3");
        }
    }

    //角色死亡掉落物品
    lostProp() {
        console.log('道具出现');
        if (this.type != 'enemy3') {
            console.log('道具出现11');
            return;
        }
        console.log('道具出现22');
        var prop = Laya.Pool.getItemByClass('hero', Role);
        var r = Math.random();
        var num = (r < 0.7) ?1:2;
        prop.init('ufo'+num, 1, 2, 30, 1);
        prop.propType = num;
        prop.visible = true;
        prop.pos(this.x, this.y);
        this.parent.addChild(prop);
    }

    //吃道具
    eatProp(prop) {
        if (this.type != 'hero' || prop.propType === 0) {
            return;
        }

        //吃道具音效
        Laya.SoundManager.playSound("res/sound/achievement.mp3");

        if (prop.propType === 1) {//子弹箱
            //子弹级别增加
            this.bulletLevel++;

            //子弹每升2级，子弹数量增加1，最大数量限制在4个
            this.shootNum = Math.min(Math.floor(this.bulletLevel / 2) + 1, 4);

            //子弹级别越高，发射频率越快
            this.shootInterval = 300 - 8 * (this.bulletLevel > 8 ? 8 : this.bulletLevel);
        } else if (prop.propType === 2) {//吃血
            this.hp += 2;
        }

        //道具消失
        prop.hp = 0;
        prop.visible = false;
    }
}