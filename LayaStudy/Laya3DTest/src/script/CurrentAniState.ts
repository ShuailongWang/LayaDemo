/**
 * CurrentAniState.ts
 * 动画脚本
*/

export default class CurrentAniState extends Laya.AnimatorStateScript {

		/**
		 * 动画状态开始时执行。
		 */
		onStateEnter():void{
            console.log('动画状态开始时执行');
        }

		/**
		 * 动画状态更新时执行。
		 */
		onStateUpdate():void{
            //console.log('动画状态更新时执行');
        }

		/**
		 * 动画状态退出时执行。
		 */
		onStateExit():void{
            console.log('动画状态退出时执行。');
        }
}