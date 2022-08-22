/**
 * GamePlay.js
*/

import GameManager from './GameManager'
import GameRole from './GameRole'

export default class GamePlay extends Laya.Script {
    /** @prop {name:pauseView, tip:'暂停View', type:Node} */
    /** @prop {name:roleLayer, tip:'角色容器', type:Node} */

    constructor() {
        super();

        this.pauseView = null;
    }

    onEnable() {
        this.moveX = 0;
        this.moveY = 0;

        this.hps = [1, 6, 15];
        this.nums = [2, 1, 1];
        this.speeds = [3, 2, 1];
        this.radius = [20, 35, 80];

        this.creatTime = 0;         //敌机刷行时间
        this.speedUp = 0;           //敌机速度提升
        this.hpUp = 0;              //敌机血量提升
        this.numUp = 0;             //敌机数量提升
        this.levelUpScore = 10;     //升级所需的积分

        //暂停按钮
        this.topBar = this.owner.getChildByName('topBar');
        this.pauseBtn = this.topBar.getChildByName('pauseBtn');
        this.pauseBtn.on(Laya.Event.CLICK, this, this.gamePause);
        this.hpTxt = this.topBar.getChildByName('hpTxt');
        this.levelTxt = this.topBar.getChildByName('levelTxt');
        this.scoreTxt = this.topBar.getChildByName('scoreTxt');

        //暂停面板添加事件
        this.pauseView.on(Laya.Event.CLICK, this, this.gameContiuns);

        //游戏初始化
        this.gameInit();
    }

    //游戏初始化
    gameInit() {
        this.pauseView.visible = false;

        //初始化玩家
        this.role = new GameRole();
        this.role.init('hero', 10, 0, 30, 0);
        this.role.pos(360, 800);
        this.roleLayer.addChild(this.role);

        //添加鼠标点击、抬起事件
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);

        //循环
        Laya.stage.frameLoop(1, this, this.gameRunLoop);
    }

    //鼠标按下
    mouseDown() {
        console.log('鼠标按下');
        this.moveX = Laya.stage.mouseX;
        this.moveY = Laya.stage.mouseY;

        //添加鼠标移动
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
    }

    //鼠标抬起
    mouseUp() {
        console.log('鼠标抬起');
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
    }

    //鼠标移动
    mouseMove() {
        //console.log('鼠标移动');
        this.role.x -= (this.moveX - Laya.stage.mouseX);
        this.role.y -= (this.moveY - Laya.stage.mouseY);

        this.moveX = Laya.stage.mouseX;
        this.moveY = Laya.stage.mouseY;
    }

    //游戏循环
    gameRunLoop() {
        //暂停或者结束
        if (GameManager.shared().isGamePauseBol || GameManager.shared().isEndGameBol) {
            return
        }

        //
        this.hpTxt.text = 'HP:' + GameManager.shared().roleHP;
        this.levelTxt.text = 'Level:' + GameManager.shared().roleLevel;
        this.scoreTxt.text = 'Score:' + GameManager.shared().roleScore;

        //飞机更新
        this.role.updateHero();

        //判断英雄是否死亡
        if (this.role.hp <= 0) {
            this.gameOver();
            return;
        }

        //发射子弹
        this.role.fireBullet();

        //等级检测
        this.levelRoleUp();

        //角色碰撞检测
        this.collisionDetection();

        //敌机生成
        this.creatAirEnemyHero();
    }

    //暂停游戏
    gamePause() {
        GameManager.shared().isGamePauseBol = true;
        this.pauseView.visible = true;
    }

    //继续游戏
    gameContiuns() {
        GameManager.shared().isGamePauseBol = false;
        this.pauseView.visible = false;
    }

    //游戏结束
    gameOver() {
        Laya.stage.offAll();

        GameManager.shared().isEndGameBol = true;
        GameManager.shared().roleHP = 10;
        GameManager.shared().roleLevel = 1;
        GameManager.shared().roleScore = 0;

        this.roleLayer.removeChildren(0, this.roleLayer.numChildren-1);
        Laya.timer.clear(this, this.gameRunLoop);

        Laya.Scene.open('GameAlert.scene');
    }

    //敌机生成
    creatAirEnemyHero() {
        //80桢小飞机生成
        if (Laya.timer.currFrame % (80 - this.creatTime) === 0) {
            this.creatEnemy(0, this.hps[0], this.speeds[0], this.radius[0], this.nums[0] + this.numUp)
        }

        //160桢中飞机生成
        if (Laya.timer.currFrame % (160 - this.creatTime) === 0) {
            this.creatEnemy(1, this.hps[1], this.speeds[1], this.radius[1], this.nums[1] + this.numUp)
        }

        //1000桢大飞机生成
        if (Laya.timer.currFrame % (1000 - this.creatTime) === 0) {
            this.creatEnemy(2, this.hps[2], this.speeds[2], this.radius[2], this.nums[2])
        }
    }
    /**
     * 敌机，型号、血量、速度、碰撞半径、数量
    */
    creatEnemy(index, hp, speed, hitRadius, num) {
        for (var i = 0; i < num; i++) {
            var enemy = Laya.Pool.getItemByClass('role', GameRole);
            enemy.init('enemy' + (index+1), hp, speed, hitRadius, 1);
            enemy.pos(Math.random() * (720 - 80) + 50, Math.random() * 100 + 80);
            this.roleLayer.addChild(enemy);
        }
    }

    //角色碰撞检测
    collisionDetection() {
        for (var i = 0; i < this.roleLayer.numChildren; i++) {
            var role = this.roleLayer.getChildAt(i);
            role.updateHero();

            //死亡不处理
            if (role.hp <= 0) {
                continue;
            }

            for (var j = i - 1; j > -1; j--) {
                var roleNext = this.roleLayer.getChildAt(j);
                
                //阵营、血量
                if (roleNext.hp > 0 && roleNext.camp !== role.camp) {
                    var hitRadius = role.hitRadius + roleNext.hitRadius;

                    if (Math.abs(role.x - roleNext.x) < hitRadius && Math.abs(role.y - roleNext.y) < hitRadius) {
                        if (role.propType !== 0 || roleNext.propType !== 0) {
                            role.eatProp(roleNext);
                            roleNext.eatProp(role);
                        } else {
                            role.lostRoleHp(1);
                            roleNext.lostRoleHp(1);
                        }
                    }
                }
            }
        }
    }

    //等级提升
    levelRoleUp() {
        if (GameManager.shared().roleScore < this.levelUpScore) {
            return;
        }

        GameManager.shared().roleLevel++;
        var level = GameManager.shared().roleLevel;
        var hp = Math.min(30, level * 1 + this.role.hp);
        GameManager.shared().roleHP = hp;

        //等级越高，敌机创建间隔越短
        this.creatTime = level < 30 ? level * 2 : 60;
        this.hpUp = Math.floor(level/8);
        this.numUp = Math.floor(level/10);

        //下一级分数
        this.levelUpScore += level * 10;
    }
}