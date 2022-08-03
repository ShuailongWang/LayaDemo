export default class Hammer extends Laya.Script {

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