/**
 * Test06.ts
*/

import CurrentAniState from './CurrentAniState'
import CudeTest from './CudeTest'
import CurrentTool from './CurrentTool'

export default class Test06 extends Laya.Script {

    scene3d : Laya.Scene3D;
    camera : Laya.Camera;
    role3D : Laya.Sprite3D;

    ray : Laya.Ray;
    hitResult :Laya.HitResult;

    constructor() {
        super();
    }

    onAwake() {
        // //加载场景
        Laya.Scene3D.load("UnityScene/LayaScene_Demo1/Conventional/Demo 1.ls", Laya.Handler.create(this, this.loadLsSucess2));
    }

    //场景加载成功
    loadLsSucess(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;
   
        this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
        
        ////克隆
        // var cloneRole = this.role3D.clone() as Laya.Sprite3D;
        // cloneRole.transform.position = new Laya.Vector3(1.6, -1.6, 3.8);
        // this.scene3d.addChild(cloneRole);

        //克隆
        Laya.Sprite3D.instantiate(this.role3D, this.scene3d, false, new Laya.Vector3(1.6, -1.6, 3.8), this.role3D.transform.rotation);
    }

    //场景加载成功
    loadLsSucess1(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //创建球体
        var sphere = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.25,20,20));
        sphere.transform.position = new Laya.Vector3(1.6, 0.5, 3.8);
        this.scene3d.addChild(sphere);
        
        //
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            sphere.active = false;

            //像素线
            var lineSp = new Laya.PixelLineSprite3D(3000);
            this.scene3d.addChild(lineSp);

            //像素线精灵
            CurrentTool.linearModel(sphere, lineSp, Laya.Color.GREEN);
        });
        
    }

    //修改子对象模型网格
    loadLsSucess2(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //因为unity旋转statis-batch,所以不能修改
        var stone3D = this.scene3d.getChildByName('Stones') as Laya.Sprite3D;
        var stoneMeshSp3D = stone3D.getChildByName('Stone_1 (13)') as Laya.MeshSprite3D;
        var stoneMesh = stoneMeshSp3D.meshFilter.sharedMesh;

        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            var boxMesh = Laya.PrimitiveMesh.createBox(1,1,1);
            stoneMeshSp3D.meshFilter.sharedMesh = boxMesh;
        });

        //获取圆球
        var spheree3D = this.scene3d.getChildByName('Sphere') as Laya.MeshSprite3D;
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, function(){
            var boxMesh = Laya.PrimitiveMesh.createBox(1,1,1);
            spheree3D.meshFilter.sharedMesh = boxMesh;
        });
        
    }
}