/**
 * CurrentTrigger.ts
*/

export default class CurrentTrigger extends Laya.Script3D {
    constructor() {
        super();
    }

    /**
     * 开始触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerEnter(other){
        console.log('onTriggerEnter' + other.owner.name);
    }

    /**
     * 持续触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerStay(other){
        //console.log('onTriggerStay' + other.owner.name);
    }

    /**
     * 结束触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerExit(other){
        console.log('onTriggerExit' + other.owner.name);
    }

    /**
     * 开始碰撞时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onCollisionEnter(collision) {
        console.log('onCollisionEnter' + collision.other.owner.name);
    }

    /**
     * 持续碰撞时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onCollisionStay(collision) {
        //console.log('onCollisionStay' + collision.other.owner.name);
    }

    /**
     * 结束碰撞时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onCollisionExit(collision) {
        console.log('onCollisionExit' + collision.other.owner.name);
    }
}