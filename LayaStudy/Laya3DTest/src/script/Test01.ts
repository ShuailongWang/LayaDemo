/**
 * Test01.ts
 * 加载场景，加载精灵，设置精灵的位置，旋转
*/

export default class Test01 extends Laya.Script {

    scene3d : Laya.Scene3D;

    constructor() {
        super();
    }

    onAwake() {
        // //加载场景
        Laya.Scene3D.load("UnityScene/LayaScene_Demo1/Conventional/Demo 1.ls", Laya.Handler.create(this, this.loadLsSucess));
    }

    //场景加载成功
    loadLsSucess(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //加载精灵
        Laya.Sprite3D.load('UnityScene/Models/SampleScene.lh', Laya.Handler.create(this, this.loadLhSucess));
    }

    //精灵加载成功
    loadLhSucess(sp3D : Laya.Sprite3D){
        console.log(sp3D);

        sp3D.transform.scale = new Laya.Vector3(2, 2, 2);
        sp3D.transform.position = new Laya.Vector3(-1,-1,14);

        //旋转幅度， 是否局部，是否弧度制
        //x轴旋转30度
        //sp3D.transform.rotate(new Laya.Vector3(30, 0, 0), true, false);
        // sp3D.transform.rotate(new Laya.Vector3(30, 0, 0), true, true);

        //sp3D.transform.rotate(new Laya.Vector3(0, 30, 0), true, false);
        //sp3D.transform.rotate(new Laya.Vector3(0, 0, 30), true, false);

        //位置移动, 右手坐标
        //sp3D.transform.translate(new Laya.Vector3(5, 0, 0), true);

        this.scene3d.addChild(sp3D);

        //循环移动，旋转
        Laya.timer.frameLoop(1, this, function(){
            sp3D.transform.translate(new Laya.Vector3(0.01, 0, 0), true);
            sp3D.transform.rotate(new Laya.Vector3(1, 0, 0), true, false);
        });
    }
}