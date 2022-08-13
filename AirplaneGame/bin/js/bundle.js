(function () {
    'use strict';

    /**
     * GameManager.js
    */
    class GameManager extends Laya.Script {
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

    /**
     * GameOverScene.js
    */

    class GameOverScene extends Laya.Scene {
        constructor() {
            super();
        }

        onEnable() {
            //本局得分
            this.lab_score = this.getChildByName('lab_score');
            this.lab_score.text = '本局积分：' + GameManager.getInstance().score;

            //重新开始按钮添加点击事件
            this.btn_reset = this.getChildByName('btn_reset');
            this.btn_mask = this.btn_reset.getChildByName('btn_mask');
            this.btn_mask.on(Laya.Event.CLICK, this, function(e){
                e.stopPropagation();
                //加载游戏场景
                Laya.Scene.open('GamePlay.scene');
            });
        }
    }

    /**
     * Role.js
    */

    class Role extends Laya.Sprite {
        
        constructor() {
            super();
            
            //console.log('Role ==> constructor');

            this.type = "";     
            this.hp = 0;
            this.speed = 0;
            this.hitRadius = 0;
            this.camp = 0;
            this.action = "";

            this.shootInterval = 300;   //射击间隔
            this.shootTime = 300;       //下次射击时间
            this.isBullet = false;      //是否子弹
            this.propType = 0;          //道具类型 0:飞机或子弹，1:子弹箱，2:血瓶
            this.bulletLevel = 1;       //子弹等级
            this.shootNum = 1;          //子弹数量
            //子弹偏移的位置
            this.bulletPos = [
                [0], [-15, 15], [-30, 0, 30], [-45, -15, 15, 45]
            ];

            //实例动画
            this.roleAni = new Laya.Animation();
            this.roleAni.loadAnimation("GameRole.ani");
        }

        /*
        * 角色初始化
        * @param type  角色类型：“hero”:玩家飞机，“enemy1-3”：敌人飞机、“bulle:1-2”：子弹、"ufo1-2":道具
        * @param hp      血量
        * @param speed   速度
        * @param hitRadius   碰撞半径
        * @param camp    阵营
        */
        init(type, hp, speed, hitRadius, camp) {
            this.type = type;
            this.hp = hp;
            this.speed = speed;
            this.hitRadius = hitRadius;
            this.camp = camp;
            this.addChild(this.roleAni);

            this.roleAni.on(Laya.Event.COMPLETE, this, this.onComplete);
            this.playAction('fly');
        }

        //动画播放完成
        onComplete() {
            if (this.roleAni.width === 0) {
                var bounds = this.roleAni.getBounds();
                this.roleAni.size(bounds.width, bounds.height);
            }

             //如果死亡动画播放完成
             if (this.action === "die") {
                 //update()中，隐藏后进行移除回收
                 this.visible = false;

                 //是否掉落道具
                 this.lostProp();
             } else if(this.action === "hit") {
                //如果是受伤动画，下一帧播放飞行动画
                 this.playAction("fly");
             }
        }

        //播放动画
        playAction(action) {
            this.action = action;
            this.roleAni.play(0, true, this.type + '_' + action);
            //console.log(this.type + '_' + action);
        }


        //检测是否移除屏幕
        upateRole() {
            if (this.type === 'hero') {
                if (this.x < this.roleAni.width / 2) {
                    this.x = this.roleAni.width/2;
                } else if (this.x > 720 - this.roleAni.width/2) {
                    this.x = 720 - this.roleAni.width/2;
                }

                if (this.y < this.roleAni.height/2) {
                    this.y = this.roleAni.height/2;
                } else if (this.y > 1280 - this.roleAni.height/2) {
                    this.y = 1280 - this.roleAni.height/2;
                }
            }
        }

        //死亡
        die() {
            this.roleAni.stop();
            this.roleAni.offAll();
            this.removeSelf();
            Laya.Pool.recover('role', this);
        }

        //角色更新
        update() {
            //如果角色隐藏，角色消亡并回收
            if (this.visible === false) {
                //主角死亡不回收，只隐藏，以免其他对象以主角回收对象创建，发生引用修改
                if (this.type !== 'hero') {
                    this.die();
                    return;
                }
            }
            
            //角色根据速度飞行
            this.y += this.speed;

            //如果移动到显示区域以外，则隐藏
            if (this.type !== 'hero' && (this.y > 1280 + 100 || this.y < -150)) {
                this.visible = false;
            }

            //
            this.upateRole();
        }

        //角色掉血
        roleLostHp(lostHp) {
            this.hp -= lostHp;
            if (this.hp > 0) {
                //如果未死亡，则播放受击动画
                this.playAction('hit');
                return;
            }

            //如果是子弹，隐藏
            if (this.isBullet === true) {
                this.visible = false;
                return
            }

            //播放死亡动画
            this.playAction('die');

            //角色死亡音效
            if (this.type === 'hero') {
                Laya.SoundManager.playSound("res/sound/game_over.mp3");
            } else { //敌机死亡音效
                console.log('112233');
                Laya.SoundManager.playSound("res/sound/enemy1_die.mp3");
            }

            //敌机死亡
            if (this.type !== 'hero' && this.isBullet === false) {
                GameManager.getInstance().score++;
            }
        }

        //射击，生成子弹
        shoot() {
            //当前时间
            var time = Laya.Browser.now();

            //如果当前时间大于下次射击时间
            if (time < this.shootTime) {
                return;
            }

            //获得发射子弹的位置数组
            var pos = this.bulletPos[this.shootNum - 1];
            for (var i = 0; i < pos.length; i++) {
                //更新下次子弹射击的时间
                this.shootTime = time + this.shootInterval;
                
                //创建子弹
                var bullet = Laya.Pool.getItemByClass('role', Role);
                bullet.init("bullet2", 1, -10, 1, this.camp);           //子弹阵营与发射者相同
                bullet.isBullet = true;                                 //角色类型为子弹类型
                bullet.visible = true;                                  //对象池中对象死亡时会被隐藏，重新显示
                bullet.pos(this.x + pos[i], this.y - 80);
                this.parent.addChild(bullet);

                //音效
                Laya.SoundManager.playSound("res/sound/bullet.mp3");
            }
        }

        //角色死亡掉落物品
        lostProp() {
            console.log('道具出现');
            if (this.type != 'enemy3') {
                console.log('道具出现11');
                return;
            }
            console.log('道具出现22');
            var prop = Laya.Pool.getItemByClass('hero', Role);
            var r = Math.random();
            var num = (r < 0.7) ?1:2;
            prop.init('ufo'+num, 1, 2, 30, 1);
            prop.propType = num;
            prop.visible = true;
            prop.pos(this.x, this.y);
            this.parent.addChild(prop);
        }

        //吃道具
        eatProp(prop) {
            if (this.type != 'hero' || prop.propType === 0) {
                return;
            }

            //吃道具音效
            Laya.SoundManager.playSound("res/sound/achievement.mp3");

            if (prop.propType === 1) {//子弹箱
                //子弹级别增加
                this.bulletLevel++;

                //子弹每升2级，子弹数量增加1，最大数量限制在4个
                this.shootNum = Math.min(Math.floor(this.bulletLevel / 2) + 1, 4);

                //子弹级别越高，发射频率越快
                this.shootInterval = 300 - 8 * (this.bulletLevel > 8 ? 8 : this.bulletLevel);
            } else if (prop.propType === 2) {//吃血
                this.hp += 2;
            }

            //道具消失
            prop.hp = 0;
            prop.visible = false;
        }
    }

    /**
     * GamePlayControl.js
     */

    class GamePlayControl extends Laya.Script {
        /** @prop {name:pause_mask, tip:"暂停遮罩", type:Node} */
        /** @prop {name:pause_box, tip:"暂停提示", type:Node} */

        constructor() {
            super();

            this.pause_mask = null;
            this.pause_box = null;
        }

        onEnable() {
            this.moveX = 0;
            this.moveY = 0;

            this.hps = [1, 6, 15]; //血量
            this.nums = [2, 1, 1]; //
            this.speeds = [3, 2, 1]; //
            this.radius = [20, 35, 80]; //

            this.createTime = 0;    //敌人刷新加速
            this.speedUp = 0;       //敌人速度提升
            this.hpUp = 0;          //敌人血量提升
            this.numUp = 0;         //敌人数量提升
            this.levelUpScore = 0;  //升级等级所需的成绩数量*


            this.gameInit();
        }

        //初始化
        gameInit() {
            console.log('gameInit');
            this.pause_mask.visible = false;
            this.pause_box.visible = false;

            GameManager.getInstance().level = 1;
            GameManager.getInstance().score = 0;
            this.levelUpScore = 10;

            //角色容器
            this.roleLayer = new Laya.Sprite();
            Laya.stage.addChild(this.roleLayer);

            //初始化玩家角色类型、血量，速度0，半径30，阵营为0
            this.hero = new Role();
            this.hero.init('hero', 10, 0, 30, 0);
            this.hero.pos(360, 800);
            this.roleLayer.addChild(this.hero);

            //暂停按钮事件
            this.top_bar = this.owner.getChildByName('top_bar');
            this.btn_pause = this.top_bar.getChildByName('btn_pause');
            this.btn_pause.on(Laya.Event.CLICK, this, this.gamePause);

            //监听鼠标事件
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);

            Laya.stage.frameLoop(1, this, this.loop);
        }

        loop() {
            //角色刷新
            this.hero.upateRole();

            if (this.hero.hp <= 0) {
                this.gameOver();
                return;
            } else {
                //射击
                this.hero.shoot();
                //游戏升级计算
                this.levelUp();
            }

            //游戏碰撞逻辑
            this.collisionDetection();

            //每80桢生成一次
            if (Laya.timer.currFrame % (80 - this.createTime) === 0) {
                this.creatEnemy(0, this.hps[0], this.speeds[0] + this.speedUp, this.nums[0] + this.numUp);
            }

            //每160桢生成一次
            if (Laya.timer.currFrame % (160 - this.createTime * 2) === 0) {
                this.creatEnemy(1, this.hps[1], this.speeds[1] + this.speedUp, this.nums[1] + this.numUp);
            }

            //每1000桢生成一次
            if (Laya.timer.currFrame % (1000 - this.createTime * 3) === 0) {
                this.creatEnemy(2, this.hps[2], this.speeds[2], this.nums[2]);
            }

        }

        //游戏结束
        gameOver() {
            //移除所有舞台事件，鼠标操控
            Laya.stage.offAll();

            //清空角色层子对象
            this.roleLayer.removeChildren(0, this.roleLayer.numChildren - 1);
            this.roleLayer.removeSelf();

            //去除游戏主循环
            Laya.timer.clear(this, this.loop);

            //加载场景
            Laya.Scene.open('GameOver.scene');
        }

        //游戏暂停
        gamePause() {
            this.pause_mask.visible = true;
            this.pause_box.visible = true;

            //监听鼠标点击事件
            Laya.stage.once(Laya.Event.MOUSE_DOWN, this, this.onContinue);
        }

        //继续游戏
        onContinue() {
            this.pause_mask.visible = false;
            this.pause_box.visible = false;

        }

        //鼠标按下
        onMouseDown() {
            console.log('鼠标按下');
            this.moveX = Laya.stage.mouseX;
            this.moveY = Laya.stage.mouseY;

            //开始移动监听
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        }

        //鼠标移动
        onMouseMove() {
            //角色的位置
            this.hero.x -= (this.moveX - Laya.stage.mouseX);
            this.hero.y -= (this.moveY - Laya.stage.mouseY);
            //console.log('角色移动X:' + this.hero.x + ', Y:'+ this.hero.y);

            //当前位置
            this.moveX = Laya.stage.mouseX;
            this.moveY = Laya.stage.mouseY;
        }

        //鼠标抬起
        onMouseUp() {
            console.log('鼠标抬起');
            //移除移动监听
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        }


        //创建敌机, 编号、血量、速度、数量
        creatEnemy(index, hp, speed, num) {
            for (var i = 0; i < num; i++) {
                var enempy = Laya.Pool.getItemByClass('role', Role);
                enempy.init('enemy' + (index + 1), hp, speed, this.radius[index], 1);
                enempy.visible = true;
                enempy.pos(Math.random() * (720 - 80) + 50, Math.random() * 100);
                this.roleLayer.addChild(enempy);
            }
        }

        //碰撞检测
        collisionDetection() {
            //遍历所有飞机，更改飞机状态
            for (var i = 0; i < this.roleLayer.numChildren; i++) {
                //获取飞机并更新
                var role = this.roleLayer.getChildAt(i);
                role.update();

                //死亡不处理
                if (role.hp <= 0) {
                    continue;
                }

                for (var j = i - 1; j > -1; j--) {
                    var role1 = this.roleLayer.getChildAt(j);

                    //如果role1未死亡且不同阵营
                    if (role1.hp > 0 && role1.camp != role.camp) {
                        var hitRadius = role.hitRadius + role1.hitRadius;
                        if (Math.abs(role.x - role1.x) < hitRadius && Math.abs(role.y - role1.y) < hitRadius) {
                            //如果某一个碰撞体是道具，则吃道具，否则掉血
                            if (role.propType !== 0 || role1.propType !== 0) {
                                role.eatProp(role1);
                                role1.eatProp(role);
                            } else {
                                //相互掉血
                                role.roleLostHp(1);
                                role1.roleLostHp(1);
                            }
                        }
                    }
                }
            }
        }

        //等级升级
        levelUp() {
            if (GameManager.getInstance().score < this.levelUpScore) {
                return;
            }

            GameManager.getInstance().level++;
            var level = GameManager.getInstance().level;

            //角色血量
            this.hero.hp = Math.min(this.hero.hp + level * 1, 30);

            //飞行速度
            this.speedUp = Math.floor(level / 6);
            //关卡越高，创建敌机间隔越短
            this.createTime = level < 30 ? level * 2 : 60;
            //敌机血量
            this.hpUp = Math.floor(level / 8);
            //敌机数量
            this.numUp = Math.floor(level / 10);
            //提高下一级的升级分数
            this.levelUpScore += level * 10;
        }

    }

    /**
     * GameStartScene.js
    */
    class GameStartScene extends Laya.Scene {
        constructor() {
            super();
        }

        onEnable() {
            //加载图片资源
            Laya.loader.load([
                {url:"res/atlas/gameRole.atlas"},
                {url:"res/sound/achievement.mp3", type:Laya.Loader.SOUND},
                {url:"res/sound/bullet.mp3", type:Laya.Loader.SOUND},
                {url:"res/sound/game_over.mp3", type:Laya.Loader.SOUND},
                {url:"res/sound/enemy1_die.mp3", type:Laya.Loader.SOUND},
                {url:"res/sound/enemy3_out.mp3", type:Laya.Loader.SOUND},
            ], Laya.Handler.create(this, function(){
                console.log('1111');
            }));


            //开始按钮添加点击事件
            this.btn_start = this.getChildByName('btn_start');
            this.btn_mask = this.btn_start.getChildByName('btn_mask');
            this.btn_mask.on(Laya.Event.CLICK, this, function(e){
                e.stopPropagation();
                //加载游戏场景
                Laya.Scene.open('GamePlay.scene');
            });
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
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

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError(true);

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
