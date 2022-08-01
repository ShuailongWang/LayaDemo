(function () {
    'use strict';

    /**
     * UniteScript.js
    */

    class UniteScript extends Laya.Script {
        constructor() {
            super();
        }

        onEnable() {
            var sprite = this.owner.getChildByName('sprite');
            //
            this.clip0 = sprite.getChildByName('clip0');
            this.clip1 = sprite.getChildByName('clip1');
            this.clip2 = sprite.getChildByName('clip2');
            this.clip3 = sprite.getChildByName('clip3');
            this.clip4 = sprite.getChildByName('clip4');
            this.clip5 = sprite.getChildByName('clip5');
            this.clip6 = sprite.getChildByName('clip6');
            this.clip7 = sprite.getChildByName('clip7');
            this.clip8 = sprite.getChildByName('clip8');
            this.clip9 = sprite.getChildByName('clip9');

            //飞轮运行
            this.owner.on(Laya.Event.CLICK, this, function() {
                this.run(8);
            });
        }

    }

    //运行飞轮在指定位置停止
    UniteScript.prototype.run = function(select) {
        this.select = select;
        this.minSpeed = 0.2;
        this.maxSpeed = 0.5;
        this.speed = 0;
        this.acceleration = 0.0002;
        this.addSpeed = true;
        this.delay = 2000;
        this.mayStop = false;

        Laya.timer.frameLoop(1, this, this.onFrameLoop);
    };

    //
    UniteScript.prototype.onFrameLoop = function() {
        if (this.addSpeed == true) {
            if (this.speed <= this.maxSpeed) {
                this.speed += Laya.timer.delta * this.acceleration;
            } else {
                this.speed = this.maxSpeed;
                this.addSpeed = false;
            }
        } else {
            if (this.delay > 0) {
                this.delay -= Laya.timer.delta;
            } else {
                if (this.speed > this.minSpeed) {
                    this.speed -= Laya.timer.delta;
                } else {
                    this.mayStop = true;
                }
            }
        }

        this.clip0.y -= this.speed * Laya.timer.delta;

        if (this.clip0.y < -900) {
            this.clip0.y = 100;
        }

        if (this.clip0.y < -700) {
            this.clip9.y = this.clip0.y + 900;
        } else {
            this.clip9.y = this.clip0.y - 100;
        }

        this.clip1.y = this.clip0.y + 100;
        this.clip2.y = this.clip0.y + 200;
        this.clip3.y = this.clip0.y + 300;
        this.clip4.y = this.clip0.y + 400;
        this.clip5.y = this.clip0.y + 500;
        this.clip6.y = this.clip0.y + 600;
        this.clip7.y = this.clip0.y + 700;
        this.clip8.y = this.clip0.y + 800;
        
        //根据判断飞轮的停止位置
        if (this.mayStop === true) {
            switch(this.select) {
                case 0: {
                    if (Math.abs(this.clip0.y) < 2) {
                        this.speed = 0;
                    }
                }
                case 1: {
                    if (Math.abs(this.clip1.y) < 2) {
                        this.speed = 0;
                    }
                }
                case 2: {
                    if (Math.abs(this.clip2.y) < 2) {
                        this.speed = 0;
                    }
                }
                case 3: {
                    if (Math.abs(this.clip3.y) < 2) {
                        this.speed = 0;
                    }
                }
                case 4: {
                    if (Math.abs(this.clip4.y) < 2) {
                        this.speed = 0;
                    }
                }
                case 5: {
                    if (Math.abs(this.clip5.y) < 2) {
                        this.speed = 0;
                    }
                }
                case 6: {
                    if (Math.abs(this.clip6.y) < 2) {
                        this.speed = 0;
                    }
                }
                case 7: {
                    if (Math.abs(this.clip7.y) < 2) {
                        this.speed = 0;
                    }
                }
                case 8: {
                    if (Math.abs(this.clip8.y) < 2) {
                        this.speed = 0;
                    }
                }
                case 9: {
                    if (Math.abs(this.clip9.y) < 2) {
                        this.speed = 0;
                    }
                }
            }
        }

    };

    /**
     * TigerScript.js
    */

    class TigerScript extends Laya.Script {
        constructor() {
            super();
        }

        onEnable() {
            var btn_run = this.owner.getChildByName('btn_run');
            var unite1 = this.owner.getChildByName('unite1');
            var unite2 = this.owner.getChildByName('unite2');
            var unite3 = this.owner.getChildByName('unite3');
            var unite4 = this.owner.getChildByName('unite4');
            var unite5 = this.owner.getChildByName('unite5');


            btn_run.on(Laya.Event.CLICK, this, function() {
                var value1 = Math.floor(Math.random() * 10);
                var value2 = Math.floor(Math.random() * 10);
                var value3 = Math.floor(Math.random() * 10);
                var value4 = Math.floor(Math.random() * 10);
                var value5 = Math.floor(Math.random() * 10);

                var uniteJS1 = unite1.getComponent(UniteScript);
                var uniteJS2 = unite1.getComponent(UniteScript);
                var uniteJS3 = unite1.getComponent(UniteScript);
                var uniteJS4 = unite1.getComponent(UniteScript);
                var uniteJS5 = unite1.getComponent(UniteScript);



                uniteJS1.run(value1);
                Laya.timer.once(2, this, function() {
                    uniteJS2.run(value2);
                });
                Laya.timer.once(4, this, function() {
                    uniteJS3.run(value3);
                });
                Laya.timer.once(6, this, function() {
                    uniteJS4.run(value4);
                });
                Laya.timer.once(8, this, function() {
                    uniteJS5.run(value5);
                });
            });
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/UniteScript.js",UniteScript);
    		reg("script/TigerScript.js",TigerScript);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Main.scene";
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
