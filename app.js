const getRandomValue=(min,max) => {
    return Math.floor(Math.random()*(max-min))+min;

};

const app=Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            playerMaxHealth: 100,
            monsterMaxHealth: 100,
            specialAttackRoundCount: 3,
            winner: null,
            logMessages: []
        };
    },
    watch: {
        playerHealth(value)
        {
            if (value <=0 && this.monsterHealth<=0)
            {
                //ничья
                this.winner="draw";
            }
            else if (value<=0)
            {
                //игрок проиграл
                this.winner="monster";
            }
        },
        monsterHealth(value)
        {
            if (value<=0 && this.playerHealth<=0)
            {
                //ничья
                this.winner="draw";
            }
            else if (value<=0)
            {
                //монстр проиграл
                this.winner="player";
            }
        }
    },
    computed: {
        playerHealthPercentage()
        {
            return Math.round((this.playerHealth/this.playerMaxHealth)*100);
        },
        monsterHealthPercentage()
        {
            return Math.round((this.monsterHealth/this.monsterMaxHealth)*100);
        },
        monsterBarStyles()
        {
            if (this.monsterHealth<0)
                return {width: "0%"};
            return {width: this.monsterHealthPercentage+'%'};
        },
        playerBarStyles()
        {
            if (this.playerHealth<0)
                return {width: "0%"};
            return {width: this.playerHealthPercentage+'%'};
        },
        mayUseSpecialAttack()
        {
            return this.specialAttackRoundCount>=3;
        }
    },
    methods: {
        attackMonster()
        {
            this.specialAttackRoundCount++;
            const attackValue=getRandomValue(5,12);
            this.monsterHealth-=attackValue;
            this.addLogMessage("player", "attack", attackValue);
            this.attackPlayer();
        },
        attackPlayer()
        {
            const attackValue=getRandomValue(8,15);
            this.playerHealth-=attackValue;
            this.addLogMessage("monster", "attack", attackValue);
        },
        specialAttackMonster()
        {
            if (this.specialAttackRoundCount>=3)
            {
                this.specialAttackRoundCount=1;
                const attackValue=getRandomValue(10,25);
                this.monsterHealth-=attackValue;
                this.addLogMessage("player", "special-attack", attackValue);
                this.attackPlayer();
            }
        },
        healPlayer()
        {
            this.specialAttackRoundCount++;
            const healValue=getRandomValue(8,20);
            if (this.playerHealth+healValue>this.playerMaxHealth)
                this.playerHealth=this.playerMaxHealth;
            else
                this.playerHealth+=healValue;
            this.addLogMessage("player", "heal", healValue);
            this.attackPlayer();
        },
        startGame()
        {
            this.monsterHealth=this.monsterMaxHealth;
            this.playerHealth=this.playerMaxHealth;
            this.specialAttackRoundCount=3;
            this.winner=null;
            this.logMessages=[];
        },
        surrender()
        {
            this.winner="monster";
        },
        addLogMessage(who, what, value)
        {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    }
});

app.mount("#game");