/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GameAlert from "./script/GameAlert"
import GamePlay from "./script/GamePlay"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/GameAlert.js",GameAlert);
		reg("script/GamePlay.js",GamePlay);
    }
}
GameConfig.width = 720;
GameConfig.height = 1280;
GameConfig.scaleMode ="showall";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "center";
GameConfig.startScene = "GameAlert.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();