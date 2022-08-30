/**
 * CurrentAniPoint.ts
 * 骨骼挂点，查找骨骼点 （换装备、换乘骑）
*/

export default class CurrentAniPoint extends Laya.Script {
    scene3D : Laya.Scene3D;

    constructor() {
        super();
    }

    onAwake() {
        // //加载场景
        Laya.Scene3D.load("UnityScene/LayaScene_Demo1/Conventional/Demo 1.ls", 
        Laya.Handler.create(this, this.loadLsSucess4));

    }

    loadLsSucess4(scene3d) {
        Laya.stage.addChild(scene3d);

        //获取角色
        var role3d = scene3d.getChildByName('free_male_1');

        // //获取节点
        // var point = role3d.getChildByName('basic_rig').getChildByName('basic_rig Pelvis')
        // .getChildAt(2).getChildAt(0).getChildAt(2).getChildAt(0).getChildAt(0).getChildAt(0);

        // //盒子
        // var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
        // box.transform.localScale = new Laya.Vector3(0.015, 0.015, 0.015);
        // box.transform.localPosition = new Laya.Vector3();
        // box.transform.localRotationEuler = new Laya.Vector3();
        // point.addChild(box);

        //获取节点
        var point = this.findChild(role3d, 'basic_rig R Hand');
        if (point != null) {
            //把盒子绑定到骨骼节点上
            var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
            box.transform.localScale = new Laya.Vector3(0.015, 0.015, 0.015);
            box.transform.localPosition = new Laya.Vector3();
            box.transform.localRotationEuler = new Laya.Vector3();
            point.addChild(box);
        }
    }

    //查找骨骼节点
    findChild(sp, pointname) {
        //判断节点是否一致
        if (sp.name == pointname) {
            return sp;
        }
        return this._findChild(sp._children, pointname);

    }
    _findChild(childArr, pointname) {
        var arrM = [];
        for (var i = 0; i < childArr.length; i++){
            var temp = childArr[i];
            if (temp.name == pointname) {
                return temp;
            }
            //判断子节点是否还有子节点
            if (temp.numChildren > 0) {
                arrM = arrM.concat(temp._children);//追加
            }
        }

        //查找子节点中的子节点
        if (arrM.length > 0) {
            return this._findChild(arrM, pointname);
        }
        return null;
    }
}