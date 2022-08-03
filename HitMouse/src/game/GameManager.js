import GameConfig from "./GameConfig";
import Mouse from "./Mouse";
import Hammer from "./Hammer";
import ScoreFloat from "./ScoreFloat";

var keyScoreHightes = "keyScoreHightes";

export default class GameManager extends Laya.Script {
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
        super()

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
        })
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
        Laya.timer.loop(1000, this, this.onOneSecond)
        //生成老鼠
        Laya.timer.once(1000, this, this.generateMouse, [this.getRandomInt(1, this.arrMouse.length)])
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

        window.localStorage[keyScoreHightes] = nScoreHightest;
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
        Laya.timer.once(3000, this, this.generateMouse, [this.getRandomInt(1, this.arrMouse.length)])
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