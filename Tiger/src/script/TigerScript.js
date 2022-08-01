/**
 * TigerScript.js
*/

import UniteScript from './UniteScript';

export default class TigerScript extends Laya.Script {
    constructor() {
        super();
    }

    onEnable() {
        var btn_run = this.owner.getChildByName('btn_run');
        var unite1 = this.owner.getChildByName('unite1');
        var unite2 = this.owner.getChildByName('unite2');
        var unite3 = this.owner.getChildByName('unite3');
        var unite4 = this.owner.getChildByName('unite4');
        var unite5 = this.owner.getChildByName('unite5');


        btn_run.on(Laya.Event.CLICK, this, function() {
            var value1 = Math.floor(Math.random() * 10);
            var value2 = Math.floor(Math.random() * 10);
            var value3 = Math.floor(Math.random() * 10);
            var value4 = Math.floor(Math.random() * 10);
            var value5 = Math.floor(Math.random() * 10);

            var uniteJS1 = unite1.getComponent(UniteScript);
            var uniteJS2 = unite1.getComponent(UniteScript);
            var uniteJS3 = unite1.getComponent(UniteScript);
            var uniteJS4 = unite1.getComponent(UniteScript);
            var uniteJS5 = unite1.getComponent(UniteScript);



            uniteJS1.run(value1);
            Laya.timer.once(2, this, function() {
                uniteJS2.run(value2);
            });
            Laya.timer.once(4, this, function() {
                uniteJS3.run(value3);
            });
            Laya.timer.once(6, this, function() {
                uniteJS4.run(value4);
            });
            Laya.timer.once(8, this, function() {
                uniteJS5.run(value5);
            });
        })
    }
}