/**
 * AS_Dialog.js
*/
export default class AS_Dialog extends Laya.Dialog {
    constructor() {
        super();

        this.width = 320;
        this.height = 240;
        //不在屏幕上显示
        this.isPopupCenter = false;
        //拖动区域
        this.dragArea = '0,0' + this.width + ',' + this.height;
        //加载场景
        this.loadScene('AS_Dialog');
    }

    onEnable() {
        this.btn_close.on(Laya.Event.CLICK, this, function(e){
            this.close();
        })
    }
}