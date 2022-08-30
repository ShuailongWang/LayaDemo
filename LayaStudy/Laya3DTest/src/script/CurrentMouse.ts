/**
 * CurrentMouse.ts 
*/

export default class CurrentMouse extends Laya.Script3D {
    constructor() {
        super();
    }

    /**
     * 鼠标按下时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseDown() {
        console.log('onMouseDown');
    }

    /**
     * 鼠标拖拽时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseDrag() {
        console.log('onMouseDrag');
    }

    /**
     * 鼠标点击时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseClick() {
        console.log('onMouseClick');
    }

    /**
     * 鼠标弹起时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseUp() {
        console.log('onMouseUp');
    }

    /**
     * 鼠标进入时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseEnter() {
        console.log('onMouseEnter');
    }

    /**
     * 鼠标经过时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseOver() {
        console.log('onMouseOver');
    }

    /**
     * 鼠标离开时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseOut() {
        console.log('onMouseOut');
    }
}