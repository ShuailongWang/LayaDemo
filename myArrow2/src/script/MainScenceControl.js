/**MainScenceControl.js*/
import BowScript from "./BowScript";

export default class MainScenceControl extends Laya.Script {
   constructor() {
        super();
    }

    //
    onEnable() {
        //根据名字，获取对象
        this.myBow = this.owner.getChildByName('myBow');
        this.ground = this.owner.getChildByName('ground');
    }

    //屏幕的点击事件
    onStageClick(e) {
        e.stopPropagation();

        var bowJs = this.myBow.getComponent(BowScript);
        bowJs.fire();
    }
}