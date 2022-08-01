/**
 * ArrowSprite 和 ArrowScript 功能一样，只是添加的方式不一样
 * ArrowSprite  runtime
 * ArrowScript  addCode
*/
export default class ArrowSprite extends Laya.Script {
    constructor() {
        super();
    }

    onEnable() {
        //速度
        this.speed = 2;

        //开始位置
        this.startPoint = new Laya.Point(this.owner.x, this.owner.y);

        //移动位置
        this.x_speed = this.speed * Math.cos(this.owner.rotation * Math.PI / 180);
        this.y_speed = this.speed * Math.sin(this.owner.rotation * Math.PI / 180);
        this.alpha = 0;

        //更新
        Laya.timer.frameLoop(1, this, this.onUpdate);
    }

    onUpdate() {
        //移动到的位置
        this.owner.x += this.x_speed * Laya.timer.delta;
        this.owner.y += this.y_speed * Laya.timer.delta;

        //距离起点位置，判断是否移除屏幕
        var distance = this.startPoint.distance(this.owner.x, this.owner.y);
        if (distance > 100) {
            this.alpha = 1;
        }
        if (distance > 2000) {
            this.owner.removeSelf();
        }
    }

    onDisable() {
        //当箭头被移除时，回收箭头到对象池，从而方便复用，减少创建对象的开销
        Laya.Pool.recover('arrow', this.owner);
    }
}