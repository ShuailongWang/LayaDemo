/**
 * GamePlayControl.js
 */
import GameManager from './GameManager';
import Role from './Role'

export default class GamePlayControl extends Laya.Script {
    /** @prop {name:pause_mask, tip:"暂停遮罩", type:Node} */
    /** @prop {name:pause_box, tip:"暂停提示", type:Node} */

    constructor() {
        super();

        this.pause_mask = null;
        this.pause_box = null;
    }

    onEnable() {
        this.moveX = 0;
        this.moveY = 0;

        this.hps = [1, 6, 15]; //血量
        this.nums = [2, 1, 1]; //
        this.speeds = [3, 2, 1]; //
        this.radius = [20, 35, 80]; //

        this.createTime = 0;    //敌人刷新加速
        this.speedUp = 0;       //敌人速度提升
        this.hpUp = 0;          //敌人血量提升
        this.numUp = 0;         //敌人数量提升
        this.levelUpScore = 0;  //升级等级所需的成绩数量*


        this.gameInit();
    }

    //初始化
    gameInit() {
        console.log('gameInit');
        this.pause_mask.visible = false;
        this.pause_box.visible = false;

        GameManager.getInstance().level = 1;
        GameManager.getInstance().score = 0;
        this.levelUpScore = 10;

        //角色容器
        this.roleLayer = new Laya.Sprite();
        Laya.stage.addChild(this.roleLayer);

        //初始化玩家角色类型、血量，速度0，半径30，阵营为0
        this.hero = new Role();
        this.hero.init('hero', 10, 0, 30, 0);
        this.hero.pos(360, 800);
        this.roleLayer.addChild(this.hero);

        //暂停按钮事件
        this.top_bar = this.owner.getChildByName('top_bar');
        this.btn_pause = this.top_bar.getChildByName('btn_pause');
        this.btn_pause.on(Laya.Event.CLICK, this, this.gamePause);

        //监听鼠标事件
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);

        Laya.stage.frameLoop(1, this, this.loop);
    }

    loop() {
        //角色刷新
        this.hero.upateRole();

        if (this.hero.hp <= 0) {
            this.gameOver();
            return;
        } else {
            //射击
            this.hero.shoot();
            //游戏升级计算
            this.levelUp();
        }

        //游戏碰撞逻辑
        this.collisionDetection();

        //每80桢生成一次
        if (Laya.timer.currFrame % (80 - this.createTime) === 0) {
            this.creatEnemy(0, this.hps[0], this.speeds[0] + this.speedUp, this.nums[0] + this.numUp);
        }

        //每160桢生成一次
        if (Laya.timer.currFrame % (160 - this.createTime * 2) === 0) {
            this.creatEnemy(1, this.hps[1], this.speeds[1] + this.speedUp, this.nums[1] + this.numUp);
        }

        //每1000桢生成一次
        if (Laya.timer.currFrame % (1000 - this.createTime * 3) === 0) {
            this.creatEnemy(2, this.hps[2], this.speeds[2], this.nums[2]);
        }

    }

    //游戏结束
    gameOver() {
        //移除所有舞台事件，鼠标操控
        Laya.stage.offAll();

        //清空角色层子对象
        this.roleLayer.removeChildren(0, this.roleLayer.numChildren - 1);
        this.roleLayer.removeSelf();

        //去除游戏主循环
        Laya.timer.clear(this, this.loop);

        //加载场景
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

    //鼠标按下
    onMouseDown() {
        console.log('鼠标按下');
        this.moveX = Laya.stage.mouseX;
        this.moveY = Laya.stage.mouseY;

        //开始移动监听
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    }

    //鼠标移动
    onMouseMove() {
        //角色的位置
        this.hero.x -= (this.moveX - Laya.stage.mouseX);
        this.hero.y -= (this.moveY - Laya.stage.mouseY);
        //console.log('角色移动X:' + this.hero.x + ', Y:'+ this.hero.y);

        //当前位置
        this.moveX = Laya.stage.mouseX;
        this.moveY = Laya.stage.mouseY;
    }

    //鼠标抬起
    onMouseUp() {
        console.log('鼠标抬起');
        //移除移动监听
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    }


    //创建敌机, 编号、血量、速度、数量
    creatEnemy(index, hp, speed, num) {
        for (var i = 0; i < num; i++) {
            var enempy = Laya.Pool.getItemByClass('role', Role)
            enempy.init('enemy' + (index + 1), hp, speed, this.radius[index], 1);
            enempy.visible = true;
            enempy.pos(Math.random() * (720 - 80) + 50, Math.random() * 100);
            this.roleLayer.addChild(enempy);
        }
    }

    //碰撞检测
    collisionDetection() {
        //遍历所有飞机，更改飞机状态
        for (var i = 0; i < this.roleLayer.numChildren; i++) {
            //获取飞机并更新
            var role = this.roleLayer.getChildAt(i);
            role.update();

            //死亡不处理
            if (role.hp <= 0) {
                continue;
            }

            for (var j = i - 1; j > -1; j--) {
                var role1 = this.roleLayer.getChildAt(j);

                //如果role1未死亡且不同阵营
                if (role1.hp > 0 && role1.camp != role.camp) {
                    var hitRadius = role.hitRadius + role1.hitRadius;
                    if (Math.abs(role.x - role1.x) < hitRadius && Math.abs(role.y - role1.y) < hitRadius) {
                        //如果某一个碰撞体是道具，则吃道具，否则掉血
                        if (role.propType !== 0 || role1.propType !== 0) {
                            role.eatProp(role1);
                            role1.eatProp(role);
                        } else {
                            //相互掉血
                            role.roleLostHp(1);
                            role1.roleLostHp(1);
                        }
                    }
                }
            }
        }
    }

    //等级升级
    levelUp() {
        if (GameManager.getInstance().score < this.levelUpScore) {
            return;
        }

        GameManager.getInstance().level++;
        var level = GameManager.getInstance().level;

        //角色血量
        this.hero.hp = Math.min(this.hero.hp + level * 1, 30)

        //飞行速度
        this.speedUp = Math.floor(level / 6);
        //关卡越高，创建敌机间隔越短
        this.createTime = level < 30 ? level * 2 : 60;
        //敌机血量
        this.hpUp = Math.floor(level / 8);
        //敌机数量
        this.numUp = Math.floor(level / 10);
        //提高下一级的升级分数
        this.levelUpScore += level * 10;
    }

}
