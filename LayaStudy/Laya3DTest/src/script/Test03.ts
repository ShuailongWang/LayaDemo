/**
 * Test03.ts
*/

import CurrentAniState from './CurrentAniState'
import CudeTest from './CudeTest'

export default class Test03 extends Laya.Script {

    scene3d : Laya.Scene3D;
    camera : Laya.Camera;
    role3D : Laya.Sprite3D;
    playerAni : Laya.Animator;

    constructor() {
        super();
    }

    onAwake() {
        // //加载场景
        Laya.Scene3D.load("UnityScene/LayaScene_Demo1/Conventional/Demo 1.ls", Laya.Handler.create(this, this.loadLsSucess3));
    }

    //场景加载成功
    loadLsSucess(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //添加点击事件，切换动画
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            //获取人物
            this.role3D = this.scene3d.getChildByName('free_male_1');
            //获取动画组件
            this.playerAni = this.role3D.getComponent(Laya.Animator);

            //获取当前的播放状态。(层索引。)
            var aniState = this.playerAni.getCurrentAnimatorPlayState(0).animatorState;
            console.log(aniState);
            console.log(aniState.name);
            console.log(aniState.clip.duration());

            //获取默认状态
            var defaultState = this.playerAni.getDefaultState(0);
            console.log(defaultState);
            console.log(defaultState.name);

            //动画名称，层索引，起始时间
            //this.playerAni.play('walk', 0, 0);
            //动画过渡融合, 动画名称，过度时间，层索引，起始时间
            this.playerAni.crossFade('walk', 0.8, 0, 0);
            
        });
        
    }

    //切割动画
    loadLsSucess1(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //添加点击事件，切换动画
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            //获取人物
            this.role3D = this.scene3d.getChildByName('free_male_1');
            //获取动画组件
            this.playerAni = this.role3D.getComponent(Laya.Animator);

            //创建新的动画
            var newAniState = new Laya.AnimatorState();
            newAniState.clipEnd = 0/145;    //开始时间
            newAniState.clipEnd = 80/145;   //结束时间
            newAniState.name = "idel";      //名字

            newAniState.clip = this.playerAni.getDefaultState().clip;//动作
            newAniState.clip.islooping = true;  //循环
            
            this.playerAni.addState(newAniState);   //添加动画状态
            this.playerAni.play('idel');            //播放
        });
    }

    //动画脚本
    loadLsSucess2(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //获取人物
        this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
        //获取动画组件
        this.playerAni = this.role3D.getComponent(Laya.Animator);

        //创建新的动画
        var newAniState = new Laya.AnimatorState();
        newAniState.clipEnd = 0/145;    //开始时间
        newAniState.clipEnd = 80/145;   //结束时间
        newAniState.name = "idel";      //名字
        newAniState.addScript(CurrentAniState);//脚本

        newAniState.clip = this.playerAni.getDefaultState().clip;//动作
        newAniState.clip.islooping = false;  //循环
        
        this.playerAni.addState(newAniState);   //添加动画状态

        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            this.playerAni.crossFade('idel', 0.8, 0, 0); 
        });
    }

    //动画脚本
    loadLsSucess3(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //获取Cude
        var cude = this.scene3d.getChildByName("Cube");
        var script = cude.addComponent(CudeTest);//添加组件
        console.log(cude);

        // //方法
        // script.showMsgFunc = function() {
        //     console.log('nihao');
        // };

        var label = new Laya.Label();
        label.text = "test";
        label.width = 100;
        label.height = 100;
        label.fontSize = 40;
        label.pos(200, 200);
        Laya.stage.addChild(label);

        // script.showMsgFunc = function() {
        //     label.color = "red";
        //     label.text = 'showMsg';
        // }

        //绑定label
        // script.showMsgFunc = function() {
        //     this.color = "red";
        //     this.text = 'showMsg';
        // }.bind(label);

        script.showMsgFunc = function(value) {
            this.color = "red";
            this.text = 'showMsg';
            console.log(value);
        }.bind(label, 666);
    }

}