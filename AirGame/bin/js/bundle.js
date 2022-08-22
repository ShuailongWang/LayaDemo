(function () {
    'use strict';

    /**
     * GameManager.js
    */

    class GameManager extends Laya.Script {
        constructor() {
            super();

            this.roleHP = 10;
            this.roleLevel = 1;
            this.roleScore = 0;
            this.isEndGameBol = false;
            this.isGamePauseBol = false;    //是否暂停


        }

        static shared() {
            if (!this.manager) {
                this.manager = new GameManager();
            }
            return this.manager;
        }
    }

    /**
     * GameAlert.js
    */

    class GameAlert extends Laya.Scene {
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

    /**
     * GameRole.js
    */

    class GameRole extends Laya.Sprite {
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

            console.log('11' + this.type);

            //如果是子弹
            if (this.isBullet === true) {
                this.visible = false;
                return;
            }
            console.log('22' + this.type);

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

    /**
     * GamePlay.js
    */

    class GamePlay extends Laya.Script {
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
                this.creatEnemy(0, this.hps[0], this.speeds[0], this.radius[0], this.nums[0] + this.numUp);
            }

            //160桢中飞机生成
            if (Laya.timer.currFrame % (160 - this.creatTime) === 0) {
                this.creatEnemy(1, this.hps[1], this.speeds[1], this.radius[1], this.nums[1] + this.numUp);
            }

            //1000桢大飞机生成
            if (Laya.timer.currFrame % (1000 - this.creatTime) === 0) {
                this.creatEnemy(2, this.hps[2], this.speeds[2], this.radius[2], this.nums[2]);
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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/GameAlert.js",GameAlert);
    		reg("script/GamePlay.js",GamePlay);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "center";
    GameConfig.startScene = "GameAlert.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError(true);

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
