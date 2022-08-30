/**
 * Test04.ts
*/

import CurrentAniState from './CurrentAniState'
import CudeTest from './CudeTest'

export default class Test04 extends Laya.Script {

    scene3d : Laya.Scene3D;
    camera : Laya.Camera;
    role3D : Laya.Sprite3D;

    ray : Laya.Ray;
    hitResult :Laya.HitResult;

    constructor() {
        super();

        //创建一个射线，起点，方向（默认0，0，0）
        this.ray = new Laya.Ray(new Laya.Vector3(), new Laya.Vector3());

        //
        //this.hitResult = new Laya.HitResult();
    }

    onAwake() {
        // //加载场景
        Laya.Scene3D.load("UnityScene/LayaScene_Demo1/Conventional/Demo 1.ls", Laya.Handler.create(this, this.loadLsSucess6));
    }

    //场景加载成功
    loadLsSucess(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;
        // this.camera.orthographic = true;    //是否正交投影
        // this.camera.orthographicVerticalSize = 20;  //距离

        // this.camera.nearPlane = 10; //近距离视野
        // this.camera.farPlane = 100; //远距离视野

        // this.camera.fieldOfView = 80;   //摄像机视野
    }

    //场景加载成功
    loadLsSucess1(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;
        
        //相机看相球
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            var spr = this.scene3d.getChildByName('Sphere');
            this.camera.transform.lookAt(spr.transform.localPosition, new Laya.Vector3(0,1,0), false)
        });
    }


    //多相机
    loadLsSucess2(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //设置相机1
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            var camera1 = this.scene3d.getChildByName('Camera1') as Laya.Camera;
            var viewPort = camera1.normalizedViewport;
            viewPort.width = 0.2;
            viewPort.height = 0.5;
            camera1.normalizedViewport = viewPort;
        });
    }


    //射线
    loadLsSucess3(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        var physicsSim = this.scene3d.physicsSimulation;
        console.log(physicsSim);

        this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;

        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
            // 计算从屏幕空间生成的射线。
            // 屏幕空间的位置位置。 (鼠标点击的位置)
            // 输出射线。
            this.camera.viewportPointToRay(new Laya.Vector2(Laya.stage.mouseX, Laya.stage.mouseY), this.ray);

            //这里使用物理，发射射线
            // var physicsSim = new Laya.PhysicsSimulation();  //报错，不能存在多个
            
            if (physicsSim) {
                /**
                 * 射线检测第一个碰撞物体。
                 * @param ray 射线
                 * @param outHitInfo 与该射线发生碰撞的第一个碰撞器的碰撞信息
                 * @param distance 射线长度,默认为最大值
                 * @param collisonGroup 射线所属碰撞组。
                 * @param collisionMask 与射线可产生碰撞的组。
                 * @return 是否检测成功。
                 */
                var result = physicsSim.rayCast(this.ray, new Laya.HitResult());
                if (result) {
                    //console.log(this.hitResult.collider);
                    console.log(1111);

                    //生成box显示
                    var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1,1,1));
                    box.transform.position = this.hitResult.point;//碰撞点
                    this.scene3d.addChild(box);
                }
            }

            
        });
    }


    //场景加载成功
    loadLsSucess4(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;
        
        // 0默认都不渲染
        //-1全部
        //this.camera.cullingMask = -1;

        // this.camera.cullingMask = 1<<9; //显示第9层
        // this.camera.cullingMask = ~(1<<9); //除第9层，其它都显示
        //this.camera.cullingMask &= ~(1<<9); //在原来的基础上减掉第几层
        //this.camera.cullingMask |= (1<<9); //在原来的基础上增加第几层
        //this.camera.cullingMask = (1<<x) + (1<<y) + (1<<z); //只显示第x层，y层，z层
        //this.camera.cullingMask = (1<<8) + (1<<9) ; //渲染8、9层

    }

    //把摄像机照射到的界面，渲染到指定网格上
    loadLsSucess5(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //渲染纹理的相机
        // var renderCamera = new Laya.Camera(0, 0.3, 1000);
        // renderCamera.transform.position = new Laya.Vector3(-0.6, 4, -1);
        // renderCamera.transform.rotationEuler = new Laya.Vector3(0, -32, 0);
        // renderCamera.renderingOrder = -1;   //渲染顺序
        // this.scene3d.addChild(renderCamera);

        var renderCamera = this.scene3d.getChildByName('renderCamera') as Laya.Camera;
        
        //选择渲染目标为纹理
        renderCamera.renderTarget = new Laya.RenderTexture(1024, 1024); 

        //获取plane
        var plane = this.scene3d.getChildByName('Plane') as Laya.MeshSprite3D;
        var mat = plane.meshRenderer.material as Laya.BlinnPhongMaterial;
        mat.albedoTexture = renderCamera.renderTarget;

    }


    //像素数据, 颜色拾取
    loadLsSucess6(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        var renderCamera = this.scene3d.getChildByName('renderCamera') as Laya.Camera;
        
        //选择渲染目标为纹理
        renderCamera.renderTarget = new Laya.RenderTexture(1024, 1024); 

        //获取plane
        var plane = this.scene3d.getChildByName('Plane') as Laya.MeshSprite3D;
        var mat = plane.meshRenderer.material as Laya.BlinnPhongMaterial;
        mat.albedoTexture = renderCamera.renderTarget;

        //
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this, function(){
            var mouseX = Laya.stage.mouseX;
            var mouseY = Laya.MouseManager.instance.mouseY;
            var outArrM = new Uint8Array(4);

            renderCamera.renderTarget.getData(mouseX, mouseY, 1, 1, outArrM);
            console.log(outArrM[0] + ',' + outArrM[1] + ',' + outArrM[2] + ',' + outArrM[3])
        });

    }
}