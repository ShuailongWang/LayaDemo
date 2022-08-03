/**
 * About_Text.js
*/

export default class About_Text extends Laya.Scene {
    constructor() {
        super();
    }

    onEnable() {
        var string1 = "\n鹅、鹅、鹅\n取向先天个\n白毛浮绿水\红掌拨拼搏";
        var string2 = "\n鹅\n鹅\n鹅\n取向\n先天个\n白毛\n浮绿水\红掌\n拨拼搏";

        //如果在面板中，设置var的名字为var_part,那么在代码中可以使用this.var_part,
        this.Label_1.text += string1;
        this.Text_1.text += string1;
        this.TextInput_1.text += string1;
        this.TextArea_1.text += string2;
        this.TextArea_1.editable = false;
    }
}