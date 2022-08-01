/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import UniteScript from "./script/UniteScript"
import TigerScript from "./script/TigerScript"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/UniteScript.js",UniteScript);
		reg("script/TigerScript.js",TigerScript);
    }
}
GameConfig.width = 720;
GameConfig.height = 1280;
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