/**
 * MainSceneScript.js
*/
import ActorScript from './ActorScript'

export default class MainSceneScript extends Laya.Script {
    constructor() {
        super();
    }

    onEnable() {
        var ground = this.owner.getChildByName('ground');
        var mainActor = ground.getChildByName('mainActor');
        var mainActorJS = mainActor.getComponent(ActorScript);

        Laya.stage.on(Laya.Event.KEY_DOWN, this, function(e){
            switch(e.keyCode) {
                case Laya.Keyboard.A:{
                    mainActorJS.moveLeft();
                } break;
                case Laya.Keyboard.D:{
                    mainActorJS.moveRight();
                } break;
                case Laya.Keyboard.W:{
                    mainActorJS.up();
                } break;
                case Laya.Keyboard.S:{
                    mainActorJS.down();
                } break;
                case Laya.Keyboard.SPACE:{
                    mainActorJS.shot();
                } break;
            }
        });
        Laya.stage.on(Laya.Event.KEY_UP, this, function(e){
            mainActorJS.stand();
        });
    }

    // onKeyDown(e) {
        
    // }
}