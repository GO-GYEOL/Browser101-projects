'use strict'
const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
// 와 ㅆㅂ개꿀이네 이렇게하면 되는걸... 막상 해보니 생각보다 별 쓸모없네
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3')
const alertSound = new Audio('./sound/alert.wav')
const bgSound = new Audio('./sound/bg.mp3')
const bugSound = new Audio('./sound/bug_pull.mp3')
const winSound = new Audio('./sound/game_win.mp3')

// 오디오 플레이하는 방법 처음 나왔다.
let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldClick)
gameBtn.addEventListener('click', ()=>{
    if(started){
        stopGame();
    } else {
        startGame();
    };
})

popUpRefresh.addEventListener('click', ()=>{
    startGame();
    hidePopUp();
})

function startGame(){
    started = true;
    initGame();
    showStopbutton();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
    // 타이머 만들기부터 시작
}
function stopGame(){
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY?');
    playSound(alertSound);
    stopSound(bgSound);
}
function finishGame(win){
    started = false;
    hideGameButton();
    if(win){
        playSound(winSound);
    } else {
        playSound(bugSound);
    }
    stopGameTimer();
    stopSound(bgSound);
    showPopUpWithText(win? 'YOU WON!!': 'YOU LOST~~')
    // 파라미터로 받은 win이 true면 YOU WON!!이 전달되고, false면 YOU LOST~~가 전달됨
}

function startGameTimer(){
    // timer = setInterval(count, 1000); 이렇게 count라는 함수 하나 더 만들지 말고 arrow function으로 끝내자.
    let remainingTimesec = GAME_DURATION_SEC;
    updateTimerText(remainingTimesec);
    timer = setInterval(()=>{
        if(remainingTimesec <= 0){
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            // 굳이 이렇게? 그냥 false로 넣으면 더 보기 편할거같은데
            return;
        }
        updateTimerText(--remainingTimesec)
    }, 1000);
    // setInterval 첫 시작이 1000ms 뒤네.
}

function stopGameTimer(){
    clearInterval(timer);
}

function updateTimerText(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
}

function hideGameButton(){
    gameBtn.style.visibility = 'hidden';
}
function showTimerAndScore(){
    gameTimer.style.visibility='visible';
    gameScore.style.visibility='visible';
}

function showStopbutton(){
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    // 아이콘을 이렇게 불러올 수 있네...? 근데 이게 왜되지? 아 icon이 fas와 fa-play 두개의 클래스를 가지는 거였구나?
    gameBtn.style.visibility = 'visible';
}

function showPopUpWithText(text){
    popUpText.innerText = text;
    popUp.classList.remove('pop-up--hide');
}

function hidePopUp(){
    popUp.classList.add('pop-up--hide');
}

function initGame() {
    score = 0;
    field.innerHTML = '';
    // 와 진짜 간단하게 해버리네;;
    gameScore.innerText = CARROT_COUNT;
    // 벌레와 당근을 생성한 뒤 field에 추가해줌
    addItem('carrot','5','./img/carrot.png')
    addItem('bug','5','./img/bug.png')
}

function onFieldClick(event){
    if(!started) {
        return
    }
    const target = event.target;
    if(target.matches('.carrot')){
        //당근!!
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if(score === CARROT_COUNT){
            finishGame(true);
        }
    } else if(target.matches('.bug')){
        //벌레!!
        finishGame(false);
    }
    // 새로운 api, matches('.')는 class가 carrot이면 이라는 뜻.
    // 나는 className을 이용했었다.
}
function playSound(sound){
    sound.currentTime = 0;
    // 처음부터 재생하기 위해 currentTime = 0;
    sound.play();
}
function stopSound(sound){
    sound.pause();
}
function updateScoreBoard(){
    gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath){
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;
    // 이렇게 쓸라고 뽑은거구만, 만약 높이 너비 안다면 굳이 필요없긴하네. 나처럼 %로 주는 경우에도 사실 별로 쓸모 없기도 하고.
    for(let i=0; i<count; i++){
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
};

function randomNumber(min, max){
    return Math.random() * (max - min) + min;
    // MDN에 최소 최대범위(min <= x < max) 랜덤으로 하려면 이렇게 하라고 나와있다.
}