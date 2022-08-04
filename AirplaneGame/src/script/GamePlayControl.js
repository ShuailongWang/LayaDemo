/**
 * GamePlayControl.js
 */
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

        this.gameInit();
    }

    //初始化
    gameInit() {
        console.log('gameInit');
        this.pause_mask.visible = false;
        this.pause_box.visible = false;

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

        //游戏碰撞逻辑
        this.collisionDetection();

        //每80桢生成一次
        if (Laya.timer.currFrame % 80 === 0) {
            this.creatEnemy(0, this.hps[0], this.speeds[0], this.nums[0]);
        }

        //每160桢生成一次
        if (Laya.timer.currFrame % 160 === 0) {
            this.creatEnemy(1, this.hps[1], this.speeds[1], this.nums[1]);
        }

        //每1000桢生成一次
        if (Laya.timer.currFrame % 1000 === 0) {
            this.creatEnemy(2, this.hps[2], this.speeds[2], this.nums[2]);
        }

    }

    //游戏结束
    gameOver() {
        //移除所有舞台事件，鼠标操控
        Laya.stage.offAll();

        //清空角色层子对象
        this.roleLayer.removeChildren(0, roleLayer.numChildren - 1);
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
                        //相互掉血
                        role.roleLostHp(1);
                        role1.roleLostHp(1);
                    }
                }
            }
        }
    }
}