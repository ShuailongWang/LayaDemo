export default class Mouse extends Laya.Script {

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
        })

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
        })
    }
}