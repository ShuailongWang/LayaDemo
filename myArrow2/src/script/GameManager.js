/**
 * GameManager.js
*/
export default class GameManager {
    constructor() {
        this.hitpoint = 3;  //玩家的生命
        this.hitBall = 0;   //每句游戏中击破气球的数量
        this.gold = 0;      //击破1个气球获取10金币，
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new GameManager();
        }
        return this.instance;
    }

}
