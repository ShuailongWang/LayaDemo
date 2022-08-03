/**
 * ActorScript.js
*/
export default class ActorScript extends Laya.Script {
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
        })
    }

    down() {
        this.BoxCollider.isSensor = true;//不触发碰撞
        Laya.timer.once(500, this, function(){
            this.BoxCollider.isSensor = false;
        })
    }
}