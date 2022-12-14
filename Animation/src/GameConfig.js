/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import MainSceneScript from "./script/MainSceneScript"
import ActorScript from "./script/ActorScript"
import TweenScript from "./script/TweenScript"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/MainSceneScript.js",MainSceneScript);
		reg("script/ActorScript.js",ActorScript);
		reg("script/TweenScript.js",TweenScript);
    }
}
GameConfig.width = 1280;
GameConfig.height = 720;
GameConfig.scaleMode ="showall";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "Main.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
