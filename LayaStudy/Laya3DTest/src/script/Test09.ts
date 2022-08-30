/**
 * Test09.ts
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
        Laya.Scene3D.load("UnityScene/LayaScene_Demo1/Conventional/Demo 1.ls", Laya.Handler.create(this, this.loadLsSucess));
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

    onUpdate() {
        // //多点触碰,手机才能看
        // if (this.scene3d) {
        //     //有几个手指触摸
        //     var toucCount = this.scene3d.input.touchCount();
        //     console.log(toucCount);

        //     //触摸的点
        //     if (toucCount == 1) {
        //         var touchInput = this.scene3d.input.getTouch(0);
        //         var point = touchInput.position;
        //         console.log(point.x + ',' + point.y);
        //     }
        // }
    }
}