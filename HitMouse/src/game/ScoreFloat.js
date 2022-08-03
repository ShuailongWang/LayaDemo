export default class ScoreFloat extends Laya.Script {

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
        })
    }
}