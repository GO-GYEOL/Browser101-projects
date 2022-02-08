import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

export const Reason = Object.freeze({
    win: 'win',
    lose: 'lose',
    cancel: 'cancel'
});

// Builder Pattern
export default class GameBuilder {
    withGameDuration(duration){
        this.gameDuration = duration;
        return this;
    }

    withCarrotCount(num){
        this.carrotCount = num;
        return this;
    }

    withBugCount(num){
        this.bugCount = num;
        return this;
    }

    build(){
        return new Game(
            this.gameDuration,
            this.carrotCount,
            this.bugCount
        )
    }
}




class Game {
    constructor(gameDuration, carrotCount, bugCount){
        this.gameDuration = gameDuration;
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;
    
        this.gameTimer = document.querySelector('.game__timer');
        this.gameScore = document.querySelector('.game__score');
        this.gameBtn = document.querySelector('.game__button');
        this.gameBtn.addEventListener('click', ()=>{
            if(this.started){
                this.stop(Reason.cancel);
            } else {
                this.start();
            };
        });



        this.gameField = new Field(carrotCount, bugCount);
        this.gameField.setClickListener(this.onItemClick);

        this.started = false;
        this.score = 0;
        this.timer = undefined;
    }

    setGameStopListener(onGameStop){
        this.onGameStop = onGameStop;
    }

    start(){
        this.started = true;
        this.initGame();
        this.showStopButton();
        this.showTimerAndScore();
        this.startGameTimer();
        sound.playBackground();
    }
    stop(reason){
        this.started = false;
        this.stopGameTimer();
        this.hideGameButton();
        sound.stopBackground();
        // this.gameFinishBanner.showWithText('REPLAY?');
        this.onGameStop && this.onGameStop(reason);
    }

    onItemClick = (item) => {
        if(!this.started) {
            return;
        }
        if(item === ItemType.carrot){
            this.score++;
            this.updateScoreBoard();
            if(this.score === this.carrotCount){
                this.stop(Reason.win);
            }
        } else if(item === ItemType.bug){
            this.stop(Reason.lose);
        }
    }

    showStopButton(){
        const icon = this.gameBtn.querySelector('.fas');
        icon.classList.add('fa-stop');
        icon.classList.remove('fa-play');
        // 아이콘을 이렇게 불러올 수 있네...? 근데 이게 왜되지? 아 icon이 fas와 fa-play 두개의 클래스를 가지는 거였구나?
        this.gameBtn.style.visibility = 'visible';
    }

    hideGameButton(){
        this.gameBtn.style.visibility = 'hidden';
    }

    showTimerAndScore(){
        this.gameTimer.style.visibility='visible';
        this.gameScore.style.visibility='visible';
    }

    startGameTimer(){
        // timer = setInterval(count, 1000); 이렇게 count라는 함수 하나 더 만들지 말고 arrow function으로 끝내자.
        let remainingTimesec =this.gameDuration;
        this.updateTimerText(remainingTimesec);
        this.timer = setInterval(()=>{
            if(remainingTimesec <= 0){
                clearInterval(this.timer);
                this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
                // 굳이 이렇게? 그냥 false로 넣으면 더 보기 편할거같은데
                return;
            }
            this.updateTimerText(--remainingTimesec)
        }, 1000);
        // setInterval 첫 시작이 1000ms 뒤네.
    }
    
    stopGameTimer(){
        clearInterval(this.timer);
    }
    
    updateTimerText(time){
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.gameTimer.innerText = `${minutes}:${seconds}`;
    }
    
    
    initGame() {
        this.score = 0;
        this.gameScore.innerText = this.carrotCount;
        this.gameField.init();
    }

    updateScoreBoard(){
        this.gameScore.innerText = this.carrotCount - this.score;
    }
}