/**
 * CudeTest.ts
 * 把Unity中的脚本挂载到这里，方法
*/

export default class CudeTest extends Laya.Script3D {
    showMsgFunc :any;

    constructor() {
        super();

        this.showMsgFunc = null;
    }

    //方法名字跟unity中的方法c#中的一致
    ShowMsg() {
        console.log('ShowMsg');
    }

    //方法名字跟unity中的方法c#中的一致
    //unity不支持参数，有参数也带不过来
    ShowMsgValue(value) {
        console.log('ShowMsgValue:' + value);

        if(this.showMsgFunc) {
            this.showMsgFunc();
        }
    }
}