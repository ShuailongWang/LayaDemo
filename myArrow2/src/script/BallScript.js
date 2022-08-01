/**
 * BallScript.js
*/

import GameManager from "./GameManager"

export default class BallScript extends Laya.Script {
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