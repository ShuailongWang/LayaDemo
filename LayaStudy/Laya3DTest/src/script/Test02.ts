/**
 * Test02.ts
 * 设置摄像机颜色
 * 加载材质，设置天空材质
 * 创建网格盒子，给盒子添加材质贴图
 * 加载网格，设置网格对象，给网格设置材质
*/

export default class Test02 extends Laya.Script {

    scene3d : Laya.Scene3D;
    camera : Laya.Camera;

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

        //雾化
        // this.scene3d.enableFog = false; //关闭雾化
        
        //相机
        this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;
        
        //对应unity中的四种
        //this.camera.clearFlag = Laya.CameraClearFlags.Sky;  //天空
        //this.camera.clearFlag = Laya.CameraClearFlags.SolidColor; //固定颜色， 
        //this.camera.clearColor = new Laya.Vector4(116/255.0, 121/255, 49/255, 1);//r,g,b,alpha


        //天空盒材质(粉色天空)
        Laya.Material.load('UnityScene/Models/Skybox1.lmat', Laya.Handler.create(this, function(material){
            console.log(this.camera.skyRenderer);
            console.log(this.scene3d.skyRenderer);

            //获取相机的天空渲染器
            var skyRenderer = this.camera.skyRenderer;
            //创建天空盒的mesh
            skyRenderer.mesh = Laya.SkyBox.instance;
            //设置天空盒材质
            skyRenderer.material = material;
            //this.camera.skyRenderer.material = material;
        }));

        // //网格，创建box盒子
        // var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(5, 6, 6));
        // box.transform.position = new Laya.Vector3(0, 1, 16);   //位置
        // box.transform.rotate(new Laya.Vector3(0, 30, 30), true, false);  //x、z旋转30度
        // this.scene3d.addChild(box);
        //
        ////加载贴图
        // Laya.Texture2D.load('UnityScene/Models/123.png',Laya.Handler.create(this, function(txture){
        //     //材质
        //     var boxMat = new Laya.UnlitMaterial();
        //     boxMat.albedoTexture = txture;

        //     //修改盒子材质
        //     box.meshRenderer.material = boxMat;
        // }));

        
        //网格加载
        Laya.Mesh.load('UnityScene/Models/Tree_3-Leaves_1.lm', Laya.Handler.create(this, function(mesh){
            var obj = new Laya.MeshSprite3D(mesh);
            obj.transform.position = new Laya.Vector3(0, 1, 16);
            this.scene3d.addChild(obj);

            //添加材质
            Laya.Material.load('UnityScene/Models/Yellow.lmat', Laya.Handler.create(this, function(material){
                //设置材质
                obj.meshRenderer.material = material;
            }));
        }));


    }

}