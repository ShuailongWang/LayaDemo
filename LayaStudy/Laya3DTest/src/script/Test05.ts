/**
 * Test05.ts
*/

import CurrentAniState from './CurrentAniState'
import CudeTest from './CudeTest'

export default class Test05 extends Laya.Script {

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
        Laya.Scene3D.load("UnityScene/LayaScene_Demo1/Conventional/Demo 1.ls", Laya.Handler.create(this, this.loadLsSucess));
    }

    //场景加载成功
    loadLsSucess(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;
   

        var directionLight = this.scene3d.getChildByName('DefDirectionallight') as Laya.DirectionLight;
        console.log(directionLight);

        // /**不产生阴影。*/
        // None = 0,
        // /**硬阴影，对性能要求较低。*/
        // Hard = 1,
        // /**低强度软阴影，对性能要求一般。*/
        // SoftLow = 2,
        // /**高强度软阴影,对性能要求较高。*/
        // SoftHigh = 3
        directionLight.shadowMode = 2;  //阴影模式
        // 可见阴影距离
        directionLight.shadowDistance = 30;
        // 生成阴影贴图尺寸
        directionLight.shadowResolution = 2048;
        // 设置阴影级联模式。
        directionLight.shadowCascadesMode = Laya.ShadowCascadesMode.NoCascades;
        // 模糊等级，越大越高，更消耗性能
        directionLight.shadowNormalBias = 4;

        var role = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
        console.log(role);
        var skiSp3D = role.getChildAt(1) as Laya.SkinnedMeshSprite3D;
        skiSp3D.skinnedMeshRenderer.castShadow = true;  //是否产生阴影

        var environment = this.scene3d.getChildByName('Environment').getChildAt(0) as Laya.MeshSprite3D;
        console.log(environment);
        environment.meshRenderer.castShadow = true; //是否产生阴影
    }

}