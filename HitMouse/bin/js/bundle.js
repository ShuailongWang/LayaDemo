(function () {
    'use strict';

    class Hammer extends Laya.Script {

        constructor() {
            super();
        }

        onAwake() {
            this.timeLine = null;
        }

        onStart() {

        }

        onDisable() {

        }

        onUpdate() {
            
        }

        show() {
            this.owner.alpha = 1;
            this.owner.rotation = 0;

            if (this.timeLine) {
                this.timeLine.destroy();
                this.timeLine = null;
            }
            this.timeLine = Laya.TimeLine.to(this.owner, {rotation:10}, 90)
            .to(this.owner, {rotation:-10}, 90 * 2)
            .to(this.owner, {alpha:0}, 100, null, 150);
            this.timeLine.play(0, false);
        }
    }

    var GameConfig = {
        arrMousePoint : [
            {x:-245, y:0},   {x:-0, y:0},   {x:245, y:0},
            {x:-245, y:126}, {x:-0, y:126}, {x:245, y:126},
            {x:-245, y:268}, {x:-0, y:268}, {x:245, y:268},
        ],
    };

    class Mouse extends Laya.Script {

        constructor() {
            super();
        }

        onAwake() {
            this.timeLine = null;
            this.gameManager = null;
            this.typeMouse = 0;
            this.indexPath = -1;
            this.isHited = false;
        }

        onStart() {

        }

        onDisable() {

        }

        onUpdate() {
            
        }

        //点击
        onClick(e) {
            if (this.isHited) {
                return;
            }
            this.isHited = true;
            console.log(this.indexPath);

            this.owner.skin = "res/mouse_hited_" + this.typeMouse + ".png";

            if (this.timeLine) {
                this.timeLine.destroy();
                this.timeLine = null;
            }

            this.timeLine = Laya.TimeLine.to(this.owner, {scaleX:0, scaleY:0}, 300, null, 1000);
            this.timeLine.play(0, false);

            this.timeLine.on(Laya.Event.COMPLETE, this, function(){
                this.owner.removeSelf();
                this.gameManager.arrMouse[this.indexPath] = null;
            });

            this.gameManager.onMouseHited(this.indexPath, this.typeMouse);
        }

        //显示、消失动画
        show(gameManager, indexPath, typeMouse) {
            this.gameManager = gameManager;
            this.indexPath = indexPath;
            this.typeMouse = typeMouse;
            this.owner.skin = "res/mouse_normal_" + this.typeMouse + ".png";

            this.owner.scaleX = 0;
            this.owner.scaleY = 0;

            this.timeLine = Laya.TimeLine.to(this.owner, {scaleX:1, scaleY:1}, 300)
            .to(this.owner, {scaleX:0, scaleY:0}, 300, null, 2000);
            this.timeLine.play(0, false);

            this.timeLine.on(Laya.Event.COMPLETE, this, function(){
                this.owner.removeSelf();
                this.gameManager.arrMouse[this.indexPath] = null;
            });
        }
    }

    class ScoreFloat extends Laya.Script {

        constructor() {
            super();
        }

        onAwake() {
            this.timeLine = null;
        }

        onStart() {

        }

        onDisable() {

        }

        onUpdate() {
            
        }

        show(isPlus) {
            this.owner.skin = isPlus ? "res/score_100_2.png":"res/score_100_1.png";

            if (this.timeLine) {
                this.timeLine.destroy();
                this.timeLine = null;
            }
            this.timeLine = Laya.TimeLine.to(this.owner, {y:this.owner.y- 150}, 300, Laya.Ease.backOut)
            .to(this.owner, {alpha:0}, 150, null, 1000);
            this.timeLine.play(0, false);

            this.timeLine.on(Laya.Event.COMPLETE, this, function(){
                this.owner.removeSelf();
            });
        }
    }

    var keyScoreHightes = "keyScoreHightes";

    class GameManager extends Laya.Script {
        /** @prop {name:lblCountDownValue, tip:"倒计时", type:Node, default:null} */
        /** @prop {name:lblScoreValue, tip:"得分", type:Node, default:null} */
        /** @prop {name:dialogGameOver, tip:"游戏结束", type:Node, default:null} */
        /** @prop {name:libScoreCountValue, tip:"当前成绩", type:Node, default:null} */
        /** @prop {name:libScoreHistoryValue, tip:"历史最高", type:Node, default:null} */
        /** @prop {name:prefabMouse, tip:"老鼠", type:Prefab, default:null} */
        /** @prop {name:containerMouse, tip:"老鼠容器", type:Node, default:null} */
        /** @prop {name:hammer, tip:"锤子", type:Node, default:null} */
        /** @prop {name:containerScoreFloat, tip:"漂浮分数容器", type:Node, default:null} */
        /** @prop {name:preScoreFloat, tip:"漂浮分数", type:Prefab, default:null} */
        

        //上面这一坨定义完成后，自动在layaide中生成相关联
        //右侧工具栏，底部-添加组建-Code，选择当前的类名, 添加

        constructor() {
            super();

            this.lblCountDownValue = null;
            this.lblScoreValue = null;
            this.dialogGameOver = null;
            this.libScoreCountValue = null;
            this.libScoreHistoryValue = null;

            this.prefabMouse = null;
            this.containerMouse = null;
            this.hammer = null;
            this.preScoreFloat = null;
            this.containerScoreFloat = null;
        }

        //
        onAwake() {
            console.log("GameManager onAwake");

            this.isPlayBol = false;
            this.btnPlayAgain = null;

            this.arrMouse = [];
            this.isPlus = false;
        }

        //
        onStart() {
            console.log("GameManager onStart");

            //获取再来一次按钮, 从父节点中找到子节点（名字）
            this.btnPlayAgain = this.dialogGameOver.getChildByName("btnPlayAgain");
            this.btnPlayAgain.on(Laya.Event.MOUSE_DOWN, this, function(){
                this.gameSatrt();
            });
            this.gameSatrt();
        }

        //
        onDisable() {
            console.log("GameManager onDisable");
        }

        //
        onUpdate() {
            console.log("GameManager onUpdate");
        }

        //结束定时器
        onOneSecond() {
            this.nCountDown--;
            this.lblCountDownValue.text = "" + this.nCountDown;
            if (this.nCountDown <= 0) {
                this.gameOver();
                return;
            }
        }

        //开始游戏
        gameSatrt() {
            this.isPlayBol = true;
            this.nCountDown = 15;
            this.nScore = 0;

            this.arrMouse.length = 0;//清空数组
            for (var i = 0; i < 9; i++) {
                this.arrMouse.push(null);
            }

            this.dialogGameOver.visible = false;
            this.lblCountDownValue.text = "" + this.nCountDown;
            this.lblScoreValue.text = "" + this.nScore;

            //记分倒计时
            Laya.timer.loop(1000, this, this.onOneSecond);
            //生成老鼠
            Laya.timer.once(1000, this, this.generateMouse, [this.getRandomInt(1, this.arrMouse.length)]);
        }

        gameOver() {
            this.isPlayBol = false;
            this.dialogGameOver.visible = true;

            var nScoreHightest = 0;
            if (window.localStorage[keyScoreHightes]) {
                if (window.localStorage[keyScoreHightes] > this.nScore) {
                    nScoreHightest =  window.localStorage[keyScoreHightes];
                } else {
                    nScoreHightest = this.nScore;
                }
            } else {
                nScoreHightest = this.nScore;
            }
            this.libScoreHistoryValue.text = "" + nScoreHightest;
            this.libScoreCountValue.text = "" + this.nScore;

            Laya.timer.clear(this, this.onOneSecond);
        }

        //生成老鼠
        generateMouse(numMouse) {
            if (!this.isPlayBol) {
                return
            }

            for (var i = 0; i < numMouse; i++) {
                var indexPath = this.getRandomInt(0, this.arrMouse.length - 1);
                if (this.arrMouse[indexPath]) {
                    continue;
                }
                var mouse = this.prefabMouse.create();
                var posMouse = GameConfig.arrMousePoint[indexPath];
                mouse.pos(posMouse.x, posMouse.y);

                this.containerMouse.addChild(mouse);
                this.arrMouse[indexPath] = mouse;

                //动画
                var compMouse = mouse.getComponent(Mouse);
                var typeMouse = this.getRandomInt(1, 2);
                compMouse.show(this, indexPath, typeMouse);
            }
            Laya.timer.once(3000, this, this.generateMouse, [this.getRandomInt(1, this.arrMouse.length)]);
        }

        //锤子
        onMouseHited(indexPath, typeMouse) {
            if (!this.isPlayBol) {
                return;
            }

            var posMouse = GameConfig.arrMousePoint[indexPath];
            this.hammer.pos(posMouse.x + 60, posMouse.y - 60);

            //获取锤子
            var compHammer = this.hammer.getComponent(Hammer);
            compHammer.show();

            //漂浮分数
            var scoreFloat = this.preScoreFloat.create();
            scoreFloat.pos(posMouse.x-60, posMouse.y-60);
            this.containerScoreFloat.addChild(scoreFloat);
            
            this.isPlus = typeMouse == 2 ? true : false;
            var compScoreFloat = scoreFloat.getComponent(ScoreFloat);
            compScoreFloat.show(this.isPlus);

            //得分
            if (this.isPlus) {
                this.nScore += 100;
            } else {
                this.nScore -= 100;
                if (this.nScore < 0) {
                    this.nScore = 0;
                }
            }
            this.lblScoreValue.text = "" + this.nScore;
        }

        //生成指定区间的函数， 如【1， 5】
        getRandomInt(lsection, rsection) {
            if (lsection > rsection) {
                console.error('can not lsecion');
                return -1;
            } 
            return Math.floor(Math.random() * (rsection - lsection + 1)) + lsection;
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig$1 {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("game/Hammer.js",Hammer);
    		reg("game/GameManager.js",GameManager);
    		reg("game/Mouse.js",Mouse);
    		reg("game/ScoreFloat.js",ScoreFloat);
        }
    }
    GameConfig$1.width = 960;
    GameConfig$1.height = 640;
    GameConfig$1.scaleMode ="fixedheight";
    GameConfig$1.screenMode = "horizontal";
    GameConfig$1.alignV = "middle";
    GameConfig$1.alignH = "center";
    GameConfig$1.startScene = "GameScene.scene";
    GameConfig$1.sceneRoot = "";
    GameConfig$1.debug = false;
    GameConfig$1.stat = false;
    GameConfig$1.physicsDebug = false;
    GameConfig$1.exportSceneToJson = true;

    GameConfig$1.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig$1.width, GameConfig$1.height);
    		else Laya.init(GameConfig$1.width, GameConfig$1.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig$1.scaleMode;
    		Laya.stage.screenMode = GameConfig$1.screenMode;
    		Laya.stage.alignV = GameConfig$1.alignV;
    		Laya.stage.alignH = GameConfig$1.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig$1.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig$1.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig$1.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig$1.stat) Laya.Stat.show();
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
    		GameConfig$1.startScene && Laya.Scene.open(GameConfig$1.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
