/**MainScenceControl.js*/
import BowScript from "./BowScript";
import BallScript from "./BallScript";
import GameManager from "./GameManager"

export default class MainScenceControl extends Laya.Script {
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
        }))

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