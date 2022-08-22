/**
 * GameManager.js
*/

export default class GameManager extends Laya.Script {
    constructor() {
        super();

        this.roleHP = 10;
        this.roleLevel = 1;
        this.roleScore = 0;
        this.isEndGameBol = false;
        this.isGamePauseBol = false;    //是否暂停


    }

    static shared() {
        if (!this.manager) {
            this.manager = new GameManager();
        }
        return this.manager;
    }
}