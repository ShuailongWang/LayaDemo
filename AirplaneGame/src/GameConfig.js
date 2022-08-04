/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GameOverScene from "./script/GameOverScene"
import GamePlayControl from "./script/GamePlayControl"
import GameStartScene from "./script/GameStartScene"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/GameOverScene.js",GameOverScene);
		reg("script/GamePlayControl.js",GamePlayControl);
		reg("script/GameStartScene.js",GameStartScene);
    }
}
GameConfig.width = 720;
GameConfig.height = 1280;
GameConfig.scaleMode ="showall";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "center";
GameConfig.startScene = "GameStart.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
