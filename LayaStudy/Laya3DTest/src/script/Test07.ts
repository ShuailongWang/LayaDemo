/**
 * Test07.ts
*/

import CurrentAniState from './CurrentAniState'
import CudeTest from './CudeTest'
import CurrentTool from './CurrentTool'

export default class Test07 extends Laya.Script {

    scene3d : Laya.Scene3D;
    camera : Laya.Camera;
    role3D : Laya.Sprite3D;

    ray : Laya.Ray;
    hitResult :Laya.HitResult;
    isAnimation : Boolean;

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

        //this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;
   
        //换材质
        this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
        var skiMesh = this.role3D.getChildAt(1) as Laya.SkinnedMeshSprite3D;
        var mesList = skiMesh.skinnedMeshRenderer.materials;
        console.log(mesList);

        //获取石头材质
        var stone3D = this.scene3d.getChildByName('Stones') as Laya.Sprite3D;
        var stoneMeshSp3D = stone3D.getChildByName('Stone_1 (13)') as Laya.MeshSprite3D;
        
        //人物换上石头的材质
        //skiMesh.skinnedMeshRenderer.materials = stoneMeshSp3D.meshRenderer.materials;

        var arrM = [];
        arrM.push(stoneMeshSp3D.meshRenderer.material);
        arrM.push(stoneMeshSp3D.meshRenderer.material);
        skiMesh.skinnedMeshRenderer.materials = arrM;
    }

    //场景加载成功
    loadLsSucess1(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;

        //获取粒子
        var shuuri3D = this.scene3d.getChildByName('ParticleSystem') as Laya.ShuriKenParticle3D;
        //shuuri3D.particleSystem.looping = false;
        //shuuri3D.particleSystem.duration = 5;
        console.log(shuuri3D);
        
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            this.isAnimation = !this.isAnimation;
            if (this.isAnimation) {
                shuuri3D.particleSystem.pause();    //暂停
            } else {
                shuuri3D.particleSystem.play();    //开始
            }
        });
    }

    //在unity中创建拖尾精灵，然后绑定到物体上
    loadLsSucess2(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //拖尾精灵
        var tuoweiJingling = this.scene3d.getChildByName('TuoweiJingling') as Laya.MeshSprite3D;
        tuoweiJingling.transform.localPosition = new Laya.Vector3();
        tuoweiJingling.transform.localRotationEuler = new Laya.Vector3();

        //物体
        var sphere3D = this.scene3d.getChildByName('Sphere') as Laya.MeshSprite3D;
        sphere3D.addChild(tuoweiJingling);

        Laya.timer.frameLoop(1, this, function(){
            sphere3D.transform.translate(new Laya.Vector3(0,0.1,0));
        })

    }

    //
    loadLsSucess3(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        
    }
}