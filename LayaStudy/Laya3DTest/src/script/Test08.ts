/**
 * Test08.ts
*/

import CurrentAniState from './CurrentAniState'
import CudeTest from './CudeTest'
import CurrentTool from './CurrentTool'
import CurrentPlayer from './CurrentPlayer'
import CurrentTrigger from './CurrentTrigger'

export default class Test08 extends Laya.Script {

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

        this.hitResult = new Laya.HitResult();
    }

    onAwake() {
        // //加载场景
        Laya.Scene3D.load("UnityScene/LayaScene_Demo1/Conventional/Demo 1.ls", Laya.Handler.create(this, this.loadLsSucess7));
    }

    //场景加载成功
    loadLsSucess(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;
   
        this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
        console.log(this.role3D);
        //this.role3D.addComponent(CurrentPlayer);
    }

    // onUpdate() {
    //     //防止人物倒地, 这里处理不太好
    //     // if (this.role3D) {
    //     //     this.role3D.transform.localRotationEulerX = 0;
    //     //     this.role3D.transform.localRotationEulerZ = 0;
    //     // }
    // }


    //场景加载成功
    loadLsSucess1(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;

        //胶囊体Collider
        var capCilluder = new Laya.CapsuleColliderShape(0.35,1.14,1);
        capCilluder.localOffset = new Laya.Vector3(0, 0.53, 0);

        //添加刚体碰撞器
        var rigidBoy = this.role3D.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
        rigidBoy.colliderShape = capCilluder;

        console.log(this.role3D);
    }


    //场景加载成功
    loadLsSucess2(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //平面添加物理碰撞体组件
        var environment = this.scene3d.getChildByName('Environment') as Laya.Sprite3D;
        var env1 = environment.getChildByName('Environment_1')as Laya.MeshSprite3D;
        var envPhy = env1.addComponent(Laya.PhysicsCollider);
        console.log(env1);
        console.log(envPhy);

        //创建形状碰撞器
        var meshColer = new Laya.MeshColliderShape();
        meshColer.mesh = env1.meshFilter.sharedMesh;//网格

        //物理碰撞体设置形状
        envPhy.colliderShape = meshColer;
        //物理碰撞体设置摩擦力
        envPhy.friction = 2;
        //物理碰撞体设置弹力
        envPhy.restitution = 0.3;
    }

    //场景加载成功
    loadLsSucess3(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        this.camera = this.scene3d.getChildByName('Camera') as Laya.Camera;

        this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
        console.log(this.role3D);

        var curPlayer = this.role3D.addComponent(CurrentPlayer) as CurrentPlayer;
        curPlayer.Init(scene3d, this.camera);

    }


    //场景加载成功
    loadLsSucess4(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
        console.log(this.role3D);
        var roleRigidBody = this.role3D.getComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
        //可产生碰撞的碰撞组， 人物会穿过地面
        //roleRigidBody.canCollideWith = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1; 
        // roleRigidBody.canCollideWith = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER6; //第一层或者第6层
        // roleRigidBody.canCollideWith = Laya.Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER^Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1;//除了第一层
        roleRigidBody.canCollideWith = Laya.Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER^Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1^Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2;//除了第一层和第二层

        //获取人物底下白色底面
        var planebottom = this.scene3d.getChildByName('Planebottom') as Laya.MeshSprite3D;
        var planPhysic = planebottom.getComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        //所属碰撞组， 人物停在白色上面，地面会穿过
        planPhysic.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER6;
        
    }


    //场景加载成功, 角色碰撞器
    loadLsSucess5(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //获取石头
        var rock3D = this.scene3d.getChildByName('Rocks') as Laya.Sprite3D;
        console.log(rock3D);
        var rockOne3D = rock3D.getChildByName('RocK_3 (2)') as Laya.MeshSprite3D;
        console.log('rock1:'+rockOne3D);
        rockOne3D.addComponent(CurrentTrigger);

        var rockSix3D = rock3D.getChildByName('Rock_3') as Laya.MeshSprite3D;
        console.log('rock2:'+rockSix3D);
        //因为没有rigidboyd3d，所以获取physicscollider
        var fockFourPhy = rockSix3D.getComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        if (fockFourPhy) {
            fockFourPhy.isTrigger = true;//代码设置trigger
        }
        
        //人物
        this.role3D = this.scene3d.getChildByName('free_male_1') as Laya.Sprite3D;
        console.log(this.role3D);

        //人物监听onTrigger
        this.role3D.addComponent(CurrentTrigger);
        
        //为精灵添加角色控制器
        this.character = this.role3D.addComponent(Laya.CharacterController) as Laya.CharacterController;

        //小于90坡度的，都可以走上去
        this.character.maxSlope = 90;

        //创建胶囊碰撞器
        var collider = new Laya.CapsuleColliderShape(0.25, 1.14, 1);

        //设置角色控制器的碰撞形状
        this.character.colliderShape = collider;
        //现在人物不会倒

        //每1秒检测按键
        Laya.timer.frameLoop(1, this, this.moveRole);
        Laya.timer.frameLoop(1, this, this.jumpRole);
    }

    moveRole() {
        if (Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.A)) {
            this.character.move(new Laya.Vector3(this.speed, 0, 0));
            return;
        } else if (Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.D)) {
            this.character.move(new Laya.Vector3(-this.speed, 0, 0));
            return;
        } else if (Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.S)) {
            this.character.move(new Laya.Vector3(0, 0, -this.speed));
            return;
        } else if (Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.W)) {
            this.character.move(new Laya.Vector3(0, 0, this.speed));
            return;
        }
        this.character.move(new Laya.Vector3(0, 0, 0));

        //是否在地表上
        //console.log(this.character.isGrounded);
    }

    jumpRole() {
        //只有在地面才可以跳跃，防止连跳
        if (Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.SPACE) && this.character.isGrounded) {
            //this.character.fallSpeed = 1;//降落速度
            //this.character.gravity = new Laya.Vector3(0, -50, 0);//重力

            //this.character.jump(new Laya.Vector3(0, this.jumpsp, 0));
            this.character.jump();//不穿入，使用默认jumpspeed:10, move类似
            return;
        }
    }


    //场景加载成功
    loadLsSucess6(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //获取球
        this.sphere3D = this.scene3d.getChildByName('Sphere') as Laya.MeshSprite3D;
        console.log(this.sphere3D);
        
        //rigidboy碰撞
        Laya.timer.frameLoop(1, this, this.clickKeyDown);
    }

    
    clickKeyDown() {
        //W
        Laya.KeyBoardManager.hasKeyDown(87) && this.sphere3D.transform.translate(new Laya.Vector3(0, 0, 0.2));

        //S
        Laya.KeyBoardManager.hasKeyDown(83) && this.sphere3D.transform.translate(new Laya.Vector3(0, 0, -0.2));

        //A
        Laya.KeyBoardManager.hasKeyDown(65) && this.sphere3D.transform.translate(new Laya.Vector3(0.2, 0, 0));

        //D
        Laya.KeyBoardManager.hasKeyDown(68) && this.sphere3D.transform.translate(new Laya.Vector3(-0.2, 0, 0));

        //Q
        Laya.KeyBoardManager.hasKeyDown(81) && this.sphere3D.transform.translate(new Laya.Vector3(0, 0.2, 0));

        //E
        Laya.KeyBoardManager.hasKeyDown(69) && this.sphere3D.transform.translate(new Laya.Vector3(0, -0.2, 0));
    }



    //场景加载成功
    loadLsSucess7(scene3d: Laya.Scene3D) {
        this.scene3d = scene3d;
        Laya.stage.addChild(this.scene3d);
        console.log(this.scene3d);

        //获取球
        this.sphere3D = this.scene3d.getChildByName('Sphere') as Laya.MeshSprite3D;
        console.log(this.sphere3D);


        //线精灵
        this.line3D = this.scene3d.addChild(new Laya.PixelLineSprite3D(1)) as Laya.PixelLineSprite3D;

        //rigidboy碰撞
        Laya.timer.frameLoop(1, this, this.clickKeyTwoDown);
    }
    
    clickKeyTwoDown() {
        //W
        Laya.KeyBoardManager.hasKeyDown(87) && this.sphere3D.transform.translate(new Laya.Vector3(0, 0, 0.2));

        //S
        Laya.KeyBoardManager.hasKeyDown(83) && this.sphere3D.transform.translate(new Laya.Vector3(0, 0, -0.2));

        //A
        Laya.KeyBoardManager.hasKeyDown(65) && this.sphere3D.transform.translate(new Laya.Vector3(0.2, 0, 0));

        //D
        Laya.KeyBoardManager.hasKeyDown(68) && this.sphere3D.transform.translate(new Laya.Vector3(-0.2, 0, 0));

        //Q
        Laya.KeyBoardManager.hasKeyDown(81) && this.sphere3D.transform.translate(new Laya.Vector3(0, 0.2, 0));

        //E
        Laya.KeyBoardManager.hasKeyDown(69) && this.sphere3D.transform.translate(new Laya.Vector3(0, -0.2, 0));


        //物理模拟器。
        this.physicsSimulation = this.scene3d.physicsSimulation as Laya.PhysicsSimulation;

        //发射射线，起点球，终点球Z+10
        var startPos = this.sphere3D.transform.position;
        var toPos = new Laya.Vector3(startPos.x, startPos.y, startPos.z + 10);
        
        //绘制发射线
        //var line3d = this.scene3d.addChild(new Laya.PixelLineSprite3D(1)) as Laya.PixelLineSprite3D;
        this.line3D.clear();//清除所有线
        //this.line3D.addLine(startPos, toPos, Laya.Color.RED, Laya.Color.GREEN);


        //实例，生成随机10个小球
        if (this.qiuLists.length > 0) {//销毁已有的
            for (var i = 0; i < this.qiuLists.length; i++) {
                var qiuObj = this.qiuLists[i];
                qiuObj.destroy();
            }
            this.qiuLists = [];
        }
        console.log('qiuList1:'+this.qiuLists);

        for (var i = 0; i < 10; i++) {
            //创建球
            var obj = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.2));
            console.log('qiu:'+obj);

            //结果
            var resPot = new Laya.Vector3();

            /*
                差值算法
                起始值，结束值，差值比例，输入计算出的值
            */
            Laya.Vector3.lerp(startPos, toPos, i/10, resPot);

            obj.transform.position = resPot;
            this.scene3d.addChild(obj);
            
            //添加到数组
            if (obj) {
                this.qiuLists.push(obj);
            }
        }


        // //碰撞检测, 检测第一个
        // var res = this.physicsSimulation.raycastFromTo(startPos, toPos, this.hitResult);
        // if (res) {
        //     console.log('chenggong:' + this.hitResult.collider.owner.name);
        // }

        //碰撞检测, 返回穿透的列表
        // var hitArrm = [];
        // var res = this.physicsSimulation.raycastAllFromTo(startPos, toPos, hitArrm);
        // if (res) {
        //     for (var i = 0; i< hitArrm.length; i++) {
        //         var temp = hitArrm[i];
        //         console.log('chenggong:' + temp.collider.owner.name);
        //         //穿透变红色
        //         temp.collider.owner.meshRenderer.material.albedoColor = new Laya.Vector4(1,0,0,1);
        //     }
        // }


        // //物理形状检测, 发射样式为box形状，不是线了，返回列表
        // var hitOutArrm = [];
        // var colliderShap = new Laya.BoxColliderShape(1,1,1);
        // var res = this.physicsSimulation.shapeCastAll(colliderShap, startPos, toPos, hitOutArrm)
        // if (res) {
        //     for (var i = 0; i< hitOutArrm.length; i++) {
        //         var temp = hitOutArrm[i];
        //         console.log('chenggong:' + temp.collider.owner.name);
        //         //穿透变红色， 如果使用sharedMaterial，那么所有共享的都会变色，使用material
        //         temp.collider.owner.meshRenderer.material.albedoColor = new Laya.Vector4(1,0,0,1);
        //     }
        // }

        //物理形状检测, 发射样式为球形状，不是线了，返回列表
        var hitOutArrm = [];
        var colliderShap = new Laya.SphereColliderShape(0.2);
        var res = this.physicsSimulation.shapeCastAll(colliderShap, startPos, toPos, hitOutArrm)
        if (res) {
            for (var i = 0; i< hitOutArrm.length; i++) {
                var temp = hitOutArrm[i];
                console.log('chenggong:' + temp + 'Name:' + temp.collider.owner.name);
                //穿透变红色， 如果使用sharedMaterial，那么所有共享的都会变色，使用material
                temp.collider.owner.meshRenderer.material.albedoColor = new Laya.Vector4(1,0,0,1);
            }
        }

        // //物理形状检测, 发射样式为box形状，不是线了, 返回一个
        // var hitOutArrm = [];
        // var colliderShap = new Laya.BoxColliderShape(1,1,1);
        // var res = this.physicsSimulation.shapeCast(colliderShap, startPos, toPos, this.hitResult);
        // if (res) {
        //     console.log('chenggong:' + this.hitResult.collider.owner.name);
        // }

    }
}