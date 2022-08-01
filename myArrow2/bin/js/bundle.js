(function () {
    'use strict';

    /**
     * GameManager.js
    */
    class GameManager {
        constructor() {
            this.hitpoint = 3;  //玩家的生命
            this.hitBall = 0;   //每句游戏中击破气球的数量
            this.gold = 0;      //击破1个气球获取10金币，
        }

        static getInstance() {
            if (!this.instance) {
                this.instance = new GameManager();
            }
            return this.instance;
        }

    }

    /**
     * MainScene.js
    */

    class MainScene extends Laya.Scene {
        constructor() {
            super();
        }

        onEnable() {
            this.onballUpdate();

            //接受气球破裂消息
            Laya.stage.on(Laya.Event.MESSAGE, this, function(data){
                if (data === 'ballbreak') {
                    this.onballUpdate();
                }
            });
        }

        onballUpdate() {
            console.log('onballUpdate');
            this.text_hp.text = 'x' + GameManager.getInstance().hitpoint;
            this.text_ball.text = 'x' + GameManager.getInstance().hitBall;
            this.text_gold.text = 'x' + GameManager.getInstance().gold;

            if (GameManager.getInstance().hitpoint === 0) {
                console.log('onballUpdate');
                GameManager.getInstance().hitpoint = 3;
                setLocalStorage();
                Laya.Scene.open('startScence.scene');
            }
        }
    }

    function setLocalStorage() {
        //储存单个数据
        Laya.LocalStorage.setItem('gold', GameManager.getInstance().gold);

        //储存JSOn对象
        var sorceInfo = {};
        sorceInfo.gold = GameManager.getInstance().gold;
        sorceInfo.hightScore = GameManager.getInstance().hitBall;
        Laya.LocalStorage.setJSON('sorceInfo', sorceInfo);
    }

    /**BowScript.js*/
    class BowScript extends Laya.Script {
        /** @prop {name:arrow, tips:"箭预制体对象", type:Prefab} */

        constructor() {
            super();

            this.arrow = null;
        }

        onEnable() {
            var xOffset = 30;

            //画一条直线
            this.sp_fired = this.owner.getChildByName('sp_fired');
            this.sp_fired.graphics.drawLine(20 + xOffset, -145, 20 + xOffset, 154, '#ffffff', 1);

            //画两个斜线
            this.sp_ready = this.owner.getChildByName('sp_ready');
            this.sp_ready.graphics.drawLine(20 + xOffset, -145, -16 + xOffset, 0, '#ffffff', 1);
            this.sp_ready.graphics.drawLine(20 + xOffset, 145, -16 + xOffset, 0, '#ffffff', 1);

            //获取箭头
            this.sp_arrow = this.owner.getChildByName('sp_arrow');

            this.init();
        }
    }

    //初始化
    BowScript.prototype.init = function () {
        this.sp_arrow.alpha = 1;
        this.sp_fired.alpha = 0;
        this.sp_ready.alpha = 1;
        this.isReady = true;
    };

    //发射
    BowScript.prototype.fire = function() {
        if (this.isReady == false) {
            return;
        }
        this.isReady = false;

        this.sp_arrow.alpha = 0;
        this.sp_fired.alpha = 1;
        this.sp_ready.alpha = 0;

        //每0.1秒执行一次， 重置弓箭的状态
        Laya.timer.once(100, this, this.init);

        /**
         * 从对象池添加箭头
         * 设置箭头的坐标
         * 添加箭头到页面上
        */
        //发射实际上是在arrow的js中执行

        //修改箭头的方向
        var rotation = getAngle(this.owner.x, this.owner.y, Laya.stage.mouseX, Laya.stage.mouseY);
        this.owner.rotation = rotation;

        var ground = this.owner.parent.getChildByName('ground');

        //通过对象池添加对象，
        //getItemByCreateFun三个参数，通过@prop预制
        var flyer = Laya.Pool.getItemByCreateFun('arrow', this.arrow.create, this.arrow);

        //localToGlobal: 将子对象a在父对象b的位置转换成全局的位置
        var arrow_globalPos = this.owner.localToGlobal(new Laya.Point(this.sp_arrow.x, this.sp_arrow.y));

        //设置箭头的坐标
        flyer.pos(arrow_globalPos.x, arrow_globalPos.y);
        flyer.rotation = rotation;
        
        //添加箭头
        ground.addChild(flyer);
    };

    //旋转角度
    function getAngle(x1, y1, x2, y2) {
        var x = x2 - x1;
        var y = y2 - y1;
        var angle = Math.round(Math.atan(y / x) / Math.PI * 180);

        if (x >= 0 && y >= 0) {//第一象限
            return angle;
        } else if (x < 0 && y >= 0) {//第二象限
            return (180 + angle);
        } else if (x < 0 && y < 0) {//第三象限
            return (180 + angle);
        } else {//第四象限
            return (360 + angle);
        }
    }

    /**
     * BallScript.js
    */

    class BallScript extends Laya.Script {
        constructor() {
            super();
        }

        onEnable() {
            this.img_ball = this.owner.getChildByName('img_ball');
            if (this.boom == true) {
                this.img_ball.texture = 'img/ball_red.png';
                this.img_ball.alpha = 1;
                this.owner.graphics.clear();
            }

            this.y_speed = 0;
            //每秒加速10像素
            this.Acceleration = 0.001;
            this.boom = false;
            this.radio = 30;
            this.radioRaise = 2;
        }

        onUpdate() {
            if (this.boom == true) {
                //播放音效
                Laya.SoundManager.playSound('res/audio/papa.ogg', 1);

                //
                this.owner.graphics.clear();
                this.radioRaise *= 2;

                var radio = this.radio + this.radioRaise;
                this.owner.graphics.drawCircle(0, 0, radio, null, '#9cdb5a', 1);

                if (radio >= 80) {
                    this.owner.removeSelf();
                }
            } else {
                this.y_speed += this.Acceleration * Laya.timer.delta;
                this.owner.y += this.y_speed;
                
                //判断是否到达屏幕的底端
                if (this.owner.y > 1250) {
                    console.log('111 ==> over');
                    //生命值
                    GameManager.getInstance().hitpoint--;
                    if (GameManager.getInstance().hitpoint < 0) {
                        GameManager.getInstance().hitpoint = 0;
                    }

                    //
                    this.boom = true;
                    this.img_ball.alpha = 0;
                    this.radio = 30;
                    this.radioRaise = 2;
                }
            }
        }

        onDisable() {
            //发送消息
            Laya.stage.event(Laya.Event.MESSAGE, 'ballbreak');
            console.log('111 ==> over1');

            Laya.Pool.recover('ball', this.owner);
        }
    }

    /**MainScenceControl.js*/

    class MainScenceControl extends Laya.Script {
       constructor() {
            super();
        }

        //
        onEnable() {
            console.log('MainScenceControl load');

            //根据名字，获取对象
            this.myBow = this.owner.getChildByName('myBow');
            this.ground = this.owner.getChildByName('ground');
            console.log('this.ground => ', this.ground);

            //异步加载气球
            this.ballPrefaReady = false;
            Laya.loader.load('prefab/ball.prefab', Laya.Handler.create(this, function(prefab){
                console.log('ball.prefab => ', prefab);

                this.ballPrefaReady = true;
                this.ballPrefab = prefab;
            }));

            //延时统计
            this.deltaCount = 1000;
        }

        //添加气球
        creatBall() {
            if (this.ballPrefaReady == false) {
                return;
            }

            //气球
            var ball = Laya.Pool.getItemByCreateFun('ball', this.ballPrefab.create, this.ballPrefab);
            console.log('this.ball => ', ball);
            
            //1～60随机数
            var radomX = parseInt(Math.random() * 60) + 1;
            var radomY = parseInt(Math.random() * 5);
            
            //随机在屏幕上创建气球
            ball.pos(radomX * 11, 200 + radomY * 64);
            this.ground.addChild(ball);
        }

        onUpdate() {
            //1秒创建一个气球
            this.deltaCount -= Laya.timer.delta;
            if (this.deltaCount <= 0) {
                this.deltaCount = 1000;
                this.creatBall();
            }

            //碰撞检测
            this.collide();
        }

        //屏幕的点击事件
        onStageClick(e) {
            e.stopPropagation();

            var bowJs = this.myBow.getComponent(BowScript);
            bowJs.fire();
        }

        //碰撞检测
        collide() {
            //遍历，查找箭头跟气球之间的间距
            for (var i = 0; i < this.ground.numChildren; i++) {
                if (this.ground.getChildAt(i).name === 'arrow') {
                    var arrow = this.ground.getChildAt(i);
                    var point = new Laya.Point(arrow.x, arrow.y);

                    for (var j = 0; j < this.ground.numChildren; j++) {
                        //获取自身的碰撞
                        if (i === j) {
                            continue;
                        }

                        var target = this.ground.getChildAt(j);
                        if (target.name === 'arrow') {
                            continue;
                        }
                        if (target.boom === true) {
                            continue;
                        }

                        var distance = point.distance(target.x, target.y);
                        if (distance <= 35) {
                            if (target.name === 'ball') {
                                var ballJS = target.getComponent(BallScript);
                                if (ballJS && ballJS.boom === false) {
                                    ballJS.boom = true;

                                    //
                                    GameManager.getInstance().hitBall += 1;
                                    GameManager.getInstance().gold += 10;
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
        StartScence.js
        runtime使用
    */

    class StartScence extends Laya.Scene {
        constructor() {
            super();
        }

        onEnable() {
            //获取本地数据
            getLocalStorage();

            //初始化数据
            GameManager.getInstance().hitpoint = 3;
            GameManager.getInstance().hitBall = 0;

            this.text_hp.text = 'x' + GameManager.getInstance().hitpoint;
            this.text_ball.text = 'x' + GameManager.getInstance().hitBall;
            this.text_gold.text = 'x' + GameManager.getInstance().gold;

            // var startBtn = this.getChildByName('start_btn');
            // startBtn.on(Laya.Event.CLICK, this, function(e){
            //     e.stopPropagation();//防止冒泡
            //     Laya.Scene.open('mainScence.scene');
            // });

            //按钮的点击事件
            this.btn_start.on(Laya.Event.CLICK, this, function(e) {
                e.stopPropagation(); //防止冒泡
                //加载场景
                Laya.Scene.open('mainScence.scene');
            });
        }
    }

    //获取本地存储
    function getLocalStorage() {
        var gold = Laya.LocalStorage.getItem('gold');
        if (gold) {
            GameManager.getInstance().gold = parseInt(gold);
        } else {
            Laya.LocalStorage.setItem('gold', 0);
        }
    }

    /**
     * ArrowSprite 和 ArrowScript 功能一样，只是添加的方式不一样
     * ArrowSprite  runtime
     * ArrowScript  addCode
    */
    class ArrowScript extends Laya.Script {
        constructor() {
            super();
        }

        onEnable() {
            this.speed = 2;
            this.startPoint = new Laya.Point(this.owner.x, this.owner.y);
            this.x_speed = this.speed * Math.cos(this.owner.rotation * Math.PI / 180);
            this.y_speed = this.speed * Math.sin(this.owner.rotation * Math.PI / 180);
            this.alpha = 0;
        }

        onUpdate() {
            this.owner.x += this.x_speed * Laya.timer.delta;
            this.owner.y += this.y_speed * Laya.timer.delta;

            var distance = this.startPoint.distance(this.owner.x, this.owner.y);
            if (distance > 100) {
                this.alpha = 1;
            }
            if (distance > 2000) {
                this.owner.removeSelf();
            }
        }

        onDisable() {
            //当箭头被移除时，回收箭头到对象池，从而方便复用，减少创建对象的开销
            Laya.Pool.recover('arrow', this.owner);
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/MainScene.js",MainScene);
    		reg("script/BowScript.js",BowScript);
    		reg("script/MainScenceControl.js",MainScenceControl);
    		reg("script/StartScence.js",StartScence);
    		reg("script/ArrowScript.js",ArrowScript);
    		reg("script/BallScript.js",BallScript);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "center";
    GameConfig.startScene = "startScence.scene";
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
