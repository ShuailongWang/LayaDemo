/**
 * TweenScript.js
*/
export default class TweenScript extends Laya.Scene {
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