/**
 * ItemCell.js
*/
export default class ItemCell extends Laya.Box {
    constructor() {
        super();
    }

    onEnable() {
        var praise = this.getChildByName('praise');
        var btn_praise = this.getChildByName('btn_praise');

        btn_praise.on(Laya.Event.CLICK, this, function(e) {
            e.stopPropagation();
            this.dataSource.praise++;
            praise.text = this.dataSource.praise;
        })
    }
}