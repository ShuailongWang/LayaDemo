(function () {
    'use strict';

    /**
     * ActorScript.js
    */
    class ActorScript extends Laya.Script {
        constructor() {
            super();
        }

        onEnable() {
            //创建动画模版
            // Laya.Animation.createFrames(this.aniUrls('die', 6), 'die');
            // Laya.Animation.createFrames(this.aniUrls('shot', 2), 'shot');
            // Laya.Animation.createFrames(this.aniUrls('stand', 4), 'stand');

            

            //
            this.animation = this.owner.getChildByName('animation');

            //
            this.BoxCollider = this.owner.getComponent(Laya.BoxCollider);
            this.RigidBody = this.owner.getComponent(Laya.RigidBody);

            this.shotOver = true;       //结束
            this.isMoving = false;      //移动
            this.faceLeft = true;       //方向  
            this.speed = 0.08;          //速度
            this.stand();               //

            Laya.timer.frameLoop(1, this, function(){
                if (this.isMoving === true && this.shotOver === true) {
                    var one = 1;

                    //向左移动，减小x坐标的值
                    if (this.faceLeft === true) {
                        one = -1;
                    }
                    this.owner.x += one * this.speed *Laya.timer.delta;
                }
            });
        }
        
        //创建一组动画的url数组
        aniUrls(aniName, length) {
            var urls = [];
            for (var i = 0; i < length; i++) {
                urls.push("x13/" + aniName + i + ".png");
            }
            return urls;
        }

        //左移动
        moveLeft() {
            if (this.isMoving === true) {
                return;
            }

            this.faceLeft = true;
            this.isMoving = true;
            this.animation.scaleX = 1;
            this.animation.play(0, true, "walk");//动画
        }

        //右移动
        moveRight() {
            if (this.isMoving === true) {
                return;
            }

            this.faceLeft = false;
            this.isMoving = true;
            this.animation.scaleX = -1;
            this.animation.play(0, true, "walk");//动画
        }

        //行走
        walk() {
            console.log('walk');
            this.animation.play(0, true, "walk");
        }

        //站立
        stand() {
            console.log('stand');
            this.animation.play(0, true, "stand");
            this.isMoving = false;
        }

        //跳
        shot() {
            if (this.shotOver === false) {
                return;
            }
            console.log('shot');

            this.shotOver = false;
            this.animation.play(0, false, "shot");
            Laya.timer.once(500, this, function(){
                this.shotOver = true;
            });

            //桢标签监听事件
            this.animation.once(Laya.Event.LABEL, this, function(e){
                console.log('Label:', e);
            });

            //
            this.animation.once(Laya.Event.COMPLETE, this, function(){
                console.log('Animation Index:',  this.animation.index);
                if (this.isMoving === true) {
                    this.animation.play(0, true, "walk");
                } else {
                    this.animation.play(0, false, "stand");
                }
            });
        }

        die() {
            this.animation.play(0, false, 'die');
            this.animation.once(Laya.Event.COMPLETE, this, function(){
                console.log('ok, good bye');
            });
        }

        up() {
            this.BoxCollider.isSensor = true;//不触发碰撞
            this.RigidBody.setVelocity({x:0, y:-10});
            Laya.timer.once(500, this, function(){
                this.BoxCollider.isSensor = false;
            });
        }

        down() {
            this.BoxCollider.isSensor = true;//不触发碰撞
            Laya.timer.once(500, this, function(){
                this.BoxCollider.isSensor = false;
            });
        }
    }

    /**
     * MainSceneScript.js
    */

    class MainSceneScript extends Laya.Script {
        constructor() {
            super();
        }

        onEnable() {
            var ground = this.owner.getChildByName('ground');
            var mainActor = ground.getChildByName('mainActor');
            var mainActorJS = mainActor.getComponent(ActorScript);

            Laya.stage.on(Laya.Event.KEY_DOWN, this, function(e){
                switch(e.keyCode) {
                    case Laya.Keyboard.A:{
                        mainActorJS.moveLeft();
                    } break;
                    case Laya.Keyboard.D:{
                        mainActorJS.moveRight();
                    } break;
                    case Laya.Keyboard.W:{
                        mainActorJS.up();
                    } break;
                    case Laya.Keyboard.S:{
                        mainActorJS.down();
                    } break;
                    case Laya.Keyboard.SPACE:{
                        mainActorJS.shot();
                    } break;
                }
            });
            Laya.stage.on(Laya.Event.KEY_UP, this, function(e){
                mainActorJS.stand();
            });
        }

        // onKeyDown(e) {
            
        // }
    }

    /**
     * TweenScript.js
    */
    class TweenScript extends Laya.Scene {
        constructor() {
            super();
        }

        onEnable() {
            var w = 800;

            var offsetX = Laya.stage.width - w >> 1;

            var demoString = "LayaBox";
            var len = demoString.length;
            var letterText;
            for (var i = 0; i < len; i++) {
                letterText = this.createLetter(demoString.charAt(i));
                letterText.x = w / len * i + offsetX;
                
                letterText.y = 100;
                /**
                 * 对象
                 * 属性变化，用{}包括
                 * 时长
                 * 效果
                 * 完成后处理
                 * 延时
                */
                //Laya.Tween.to(letterText, {y:300}, 300, Laya.Ease.bounceIn, Laya.Handler.create(this, this.changeColor, [letterText]), i * 1000);
                Laya.Tween.to(
                    letterText,
                    {
                        y: 300,
                        updte: new Laya.Handler(this, this.updateColor, [letterText])
                    },
                    100,
                    Laya.Ease.bounceIn,
                    Laya.Handler.create(this, this.changeColor, [letterText]),
                    i * 1000
                );

                /**
                 * 执行域
                 * 回调方法
                 * 携带的参数
                 * 是否只执行1次，默认是
                */
                //Laya.Handler.create
            }
        }

        createLetter(char){
            var letter = new Laya.Text();
            letter.text = char;
            letter.color = "#ffffff";
            letter.fontSize = 180;
            this.addChild(letter);
            return letter;
        }

        changeColor(txt) {
            txt.color = "#ooffff";
        }

        updateColor(txt){
            var c = Math.floor(Math.random() * 3);

            switch(c) {
                case 0: txt.color = "#eee000"; break;
                case 1: txt.color = "#ffffff"; break;
                case 2: txt.color = "#ff0000"; break;
                default: txt.color = "#eee000"; break;
            }
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/MainSceneScript.js",MainSceneScript);
    		reg("script/ActorScript.js",ActorScript);
    		reg("script/TweenScript.js",TweenScript);
        }
    }
    GameConfig.width = 1280;
    GameConfig.height = 720;
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

    		Laya.stage.bgColor = "#aabbcc";
    	}
    }
    //激活启动类
    new Main();

}());
