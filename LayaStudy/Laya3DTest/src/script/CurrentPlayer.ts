/**
 * CurrentPlayer.ts
*/

export default class CurrentPlayer extends Laya.Script3D {
    
    scene3d : Laya.Scene3D;
    camera : Laya.Camera;
    role3D : Laya.Sprite3D;
    mouseX : number;
    mouseY : number;
    ray : Laya.Ray;//射线
    hitRes : Laya.HitResult;    //射线检测或形状扫描的结果。
    rigidbody : Laya.Rigidbody3D;
    selectObj : any;

    constructor() {
        super();
    }

    Init(scene3d, camera){
        this.scene3d = scene3d;
        this.camera = camera;
    }

    onAwake() {
        this.role3D = this.owner as Laya.Sprite3D;
        this.ray = new Laya.Ray(new Laya.Vector3(), new Laya.Vector3());
        this.hitRes = new Laya.HitResult();
    }

    onUpdate() {
        // this.role3D.transform.localRotationEulerX = 0;
        // this.role3D.transform.localRotationEulerZ = 0;
    }

    onMouseDown() {
        this.mouseX = Laya.stage.mouseX;
        this.mouseY = Laya.stage.mouseY;

        //发射射线
        this.camera.viewportPointToRay(new Laya.Vector2(this.mouseX, this.mouseY), this.ray);
        var res = this.scene3d.physicsSimulation.rayCast(this.ray, this.hitRes);
        if (res) {
            //发生碰撞的碰撞组件
            this.selectObj = this.hitRes.collider.owner;
            this.rigidbody = this.hitRes.collider.owner.getComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
        }
    }

    onMouseDrag() {
        if (this.selectObj) {
            var delX = Laya.stage.mouseX - this.mouseX;
            var delZ = Laya.stage.mouseY - this.mouseY;

            //线性运动速度
            var rigid = this.selectObj.getComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
            rigid.linearVelocity = new Laya.Vector3(-delX, 0, -delZ);
        }

        this.mouseX = Laya.stage.mouseX;
        this.mouseY = Laya.stage.mouseY;
    }

    onMouseUp() {
        this.over();
    }

    onMouseOut() {
        this.over();
    }

    over() {
        //线性运动速度设置为0
        if (this.rigidbody) {
            this.rigidbody.linearVelocity = new Laya.Vector3();
        }
        
        this.selectObj = null;
    }
}