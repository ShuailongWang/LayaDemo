/**
 * GameManager.js
*/
export default class GameManager extends Laya.Script {
    constructor() {
        super();

        this.roleHP = 3;    //玩家的生命
        this.level = 1;     //等级
        this.score = 0;     //积分
    }

    static getInstance() {
        if (!this.manager) {
            this.manager = new GameManager();
        }
        return this.manager;
    }
}
