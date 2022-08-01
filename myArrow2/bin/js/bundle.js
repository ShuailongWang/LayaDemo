(function () {
    'use strict';

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

        //每0.1秒执行一次
        Laya.timer.once(100, this, this.init);

        /**
         * 从对象池添加箭头
         * 设置箭头的坐标
         * 添加箭头到页面上
        */
        //发射实际上是在arrow的js中执行
        
        //修改箭头的方向：垂直向上
        var rotation = -90;
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

    /**MainScenceControl.js*/

    class MainScenceControl extends Laya.Script {
       constructor() {
            super();
        }

        //
        onEnable() {
            //根据名字，获取对象
            this.myBow = this.owner.getChildByName('myBow');
            this.ground = this.owner.getChildByName('ground');
        }

        //屏幕的点击事件
        onStageClick(e) {
            e.stopPropagation();

            var bowJs = this.myBow.getComponent(BowScript);
            bowJs.fire();
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
    		reg("script/BowScript.js",BowScript);
    		reg("script/MainScenceControl.js",MainScenceControl);
    		reg("script/StartScence.js",StartScence);
    		reg("script/ArrowScript.js",ArrowScript);
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
