(function () {
    'use strict';

    /**
     * GameManager.js
    */
    class GameManager extends Laya.Script {
        constructor() {
            super();

            this.roleHP = 3;    //玩家的生命
            this.level = 1;     //等级
            this.score = 0;     //积分
        }

        static getInstance() {
            if (!this.manager) {
                this.manager = new GameManager();
            }
            return this.manager;
        }
    }

    /**
     * GameOverScene.js
    */

    class GameOverScene extends Laya.Scene {
        constructor() {
            super();
        }

        onEnable() {
            //本局得分
            this.lab_score = this.getChildByName('lab_score');
            this.lab_score.text = '本局积分：' + GameManager.getInstance().score;

            //重新开始按钮添加点击事件
            this.btn_reset = this.getChildByName('btn_reset');
            this.btn_mask = this.btn_reset.getChildByName('btn_mask');
            this.btn_mask.on(Laya.Event.CLICK, this, function(e){
                e.stopPropagation();
                //加载游戏场景
                Laya.Scene.open('GamePlay.scene');
            });
        }
    }

    /**
     * Role.js
    */
    class Role extends Laya.Sprite {
        
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

    /**
     * GamePlayControl.js
    */

    class GamePlayControl extends Laya.Script{
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
            this.hps = [1, 6, 15];
            this.nums = [2, 1, 1];
            this.speeds = [3, 2, 1];

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

            //玩家
            this.hero = new Role();
            this.hero.init('hero', 10, 0);
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

        loop(){
            //角色刷新
            this.hero.upateRole();

            //敌机刷新
            for (var i = 0; i < this.roleLayer.numChildren; i ++) {
                var role = this.roleLayer.getChildAt(i);
                role.update();
            }

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
            Laya.timer.clear(this, this.loop);
            Laya.Scene.open('GameOver.scene');
        }

        //游戏暂停
        gamePause() {
            this.pause_mask.visible = true;
            this.pause_box.visible = true;

            //监听鼠标点击事件
            Laya.stage.once(Laya.Event.MOUSE_DOWN, this, this.onContinue);
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
            console.log('角色移动X:' + this.hero.x + ', Y:'+ this.hero.y);

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
                var enempy = Laya.Pool.getItemByClass('role', Role);
                enempy.init('enemy' + (index+1), hp, speed);
                enempy.visible = true;
                enempy.pos(Math.random() * (720 - 80) + 50, Math.random() * 100);
                this.roleLayer.addChild(enempy);
            }
        }
    }

    /**
     * GameStartScene.js
    */
    class GameStartScene extends Laya.Scene {
        constructor() {
            super();
        }

        onEnable() {
            //加载图片资源
            Laya.loader.load("res/atlas/gameRole.atlas", Laya.Handler.create(this, function(){
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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/GameOverScene.js",GameOverScene);
    		reg("script/GamePlayControl.js",GamePlayControl);
    		reg("script/GameStartScene.js",GameStartScene);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "center";
    GameConfig.startScene = "GameStart.scene";
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
