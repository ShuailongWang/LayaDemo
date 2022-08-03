/**
 * About_Clip.js
*/
import AS_Dialog from './AS_Dialog'
export default class About_Clip extends Laya.Scene {
    constructor() {
        super();
    }

    onEnable() {
        this.clip1.index = 8;

        this.btn_dialog.on(Laya.Event.CLICK, this, function(e){
            var dialog = new AS_Dialog();
            dialog.x = 50;
            dialog.y = 150;
            dialog.popup();     //不可以点击背景
            // dialog.show();    //可以点击其它区域
        });
    }
}