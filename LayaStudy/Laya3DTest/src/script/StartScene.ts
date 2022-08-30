/**
 * StartScene.ts
*/

import CurrentAniState from './CurrentAniState'
import CudeTest from './CudeTest'
import CurrentTool from './CurrentTool'
import CurrentPlayer from './CurrentPlayer'
import CurrentTrigger from './CurrentTrigger'
import CurrentMouse from './CurrentMouse'

export default class StartScene extends Laya.Script {

    scene3d : Laya.Scene3D;
    camera : Laya.Camera;
    role3D : Laya.Sprite3D;

    ray : Laya.Ray;
    hitResult :Laya.HitResult;
    isAnimation : Boolean;

    character : Laya.CharacterController;
    speed : number = 0.05;
    jumpsp : number = 5;

    sphere3D: Laya.MeshSprite3D;
    physicsSimulation : Laya.PhysicsSimulation; //物理模拟器。
    line3D : Laya.PixelLineSprite3D;
    qiuLists : Laya.MeshSprite3D[] = [];

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
        console.log(this.role3D);
        
        this.role3D.addComponent(CurrentMouse);
    }

    // onUpdate() {
    //     //多点触碰,手机才能看
    //     if (this.scene3d) {
    //         //有几个手指触摸
    //         var toucCount = this.scene3d.input.touchCount();
    //         console.log(toucCount);

    //         //触摸的点
    //         if (toucCount == 1) {
    //             var touchInput = this.scene3d.input.getTouch(0);
    //             var point = touchInput.position;
    //             console.log(point.x + ',' + point.y);
    //             console.log('identifier'+touchInput.identifier);//根据手指放到屏幕的数量来决定，如果3个手指，则是0，1，2
    //         }
    //     }
    // }


    //场景加载成功
    loadLsSucess1(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;
   
        //单个资源销毁
        // Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
        //     this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
        //     console.log(this.role3D);

        //     //再销毁mesh, 应该线销毁mesh，再
        //     var mesh = this.role3D.getChildAt(1).meshFilter.sharedMesh as Laya.Resource;
        //     console.log(mesh);

        //     //材质数组 (skinnedMeshRenderer 蒙皮渲染器)
        //     var mat = this.role3D.getChildAt(1).skinnedMeshRenderer.materials;

        //     //销毁，是否销毁子物体
        //     this.role3D.destroy(true);

        //     //销毁mesh, this.role3D销毁后没有了，需要先记录mesh
        //     if (mesh) {
        //         mesh.destroy();
        //     }

        //     //材质销毁
        //     for (var i = 0; i < mat.length; i++) {
        //         var mater = mat[i] as Laya.Material;
        //         console.log('mater' + mater);
        //         mater.destroy();
        //     }
        // });

        // //批量销毁
        // Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
        //     this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
        //     console.log(this.role3D);
    
        //     Laya.Resource.destroyUnusedResources();
        // });


        //场景销毁
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            (scene3d as Laya.Sprite).destroy(true);
            //Laya.Resource.destroyUnusedResources();
        });
    }


    //场景加载成功
    loadLsSucess2(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;
        
        //单资源上锁
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
            console.log(this.role3D);

            //再销毁mesh, 应该线销毁mesh，再
            var mesh = this.role3D.getChildAt(1).meshFilter.sharedMesh as Laya.Resource;
            mesh.lock = true;//资源上锁
            console.log(mesh);
    
            //
            Laya.Resource.destroyUnusedResources();
        });

        //批量上锁，加载完资源后，单个获取加锁，Laya.load.getres///
        //texture资源上锁，是使用的bitmap.lock = true
    }
}