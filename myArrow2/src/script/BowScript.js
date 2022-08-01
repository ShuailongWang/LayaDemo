/**BowScript.js*/
export default class BowScript extends Laya.Script {
    /** @prop {name:arrow, tips:"箭预制体对象", type:Prefab} */

    constructor() {
        super();

        this.arrow = null;
    }

    onEnable() {
        var xOffset = 30;

        //画一条直线
        this.sp_fired = this.owner.getChildByName('sp_fired');
        this.sp_fired.graphics.drawLine(20 + xOffset, -145, 20 + xOffset, 154, '#ffffff', 1);

        //画两个斜线
        this.sp_ready = this.owner.getChildByName('sp_ready');
        this.sp_ready.graphics.drawLine(20 + xOffset, -145, -16 + xOffset, 0, '#ffffff', 1);
        this.sp_ready.graphics.drawLine(20 + xOffset, 145, -16 + xOffset, 0, '#ffffff', 1);

        //获取箭头
        this.sp_arrow = this.owner.getChildByName('sp_arrow');

        this.init();
    }
}

//初始化
BowScript.prototype.init = function () {
    this.sp_arrow.alpha = 1;
    this.sp_fired.alpha = 0;
    this.sp_ready.alpha = 1;
    this.isReady = true;
}

//发射
BowScript.prototype.fire = function() {
    if (this.isReady == false) {
        return;
    }
    this.isReady = false;

    this.sp_arrow.alpha = 0;
    this.sp_fired.alpha = 1;
    this.sp_ready.alpha = 0;

    //每0.1秒执行一次， 重置弓箭的状态
    Laya.timer.once(100, this, this.init);

    /**
     * 从对象池添加箭头
     * 设置箭头的坐标
     * 添加箭头到页面上
    */
    //发射实际上是在arrow的js中执行

    //修改箭头的方向
    var rotation = getAngle(this.owner.x, this.owner.y, Laya.stage.mouseX, Laya.stage.mouseY);
    this.owner.rotation = rotation;

    var ground = this.owner.parent.getChildByName('ground');

    //通过对象池添加对象，
    //getItemByCreateFun三个参数，通过@prop预制
    var flyer = Laya.Pool.getItemByCreateFun('arrow', this.arrow.create, this.arrow);

    //localToGlobal: 将子对象a在父对象b的位置转换成全局的位置
    var arrow_globalPos = this.owner.localToGlobal(new Laya.Point(this.sp_arrow.x, this.sp_arrow.y));

    //设置箭头的坐标
    flyer.pos(arrow_globalPos.x, arrow_globalPos.y);
    flyer.rotation = rotation;
    
    //添加箭头
    ground.addChild(flyer);
}

//旋转角度
function getAngle(x1, y1, x2, y2) {
    var x = x2 - x1;
    var y = y2 - y1;
    var angle = Math.round(Math.atan(y / x) / Math.PI * 180);

    if (x >= 0 && y >= 0) {//第一象限
        return angle;
    } else if (x < 0 && y >= 0) {//第二象限
        return (180 + angle);
    } else if (x < 0 && y < 0) {//第三象限
        return (180 + angle);
    } else {//第四象限
        return (360 + angle);
    }
}