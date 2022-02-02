const countBtn = document.querySelector('.timer-start')
const count = document.querySelector('.timer-count')
const field = document.querySelector('.field');
const carrots = document.querySelector('.carrot')
const bugs = document.querySelector('.bug')

let lefttime = 10;
let timer;
function onCount(){
    makingProcess();
}
function printingCount(){
    count.innerHTML = lefttime;
    lefttime--;
    if(lefttime==-1){
        clearTimeout(timer);
        gameOver();
    }
}


countBtn.addEventListener('click', onCount);

function makingProcess(){
    for(i=0; i<10; i++){
        const carrot = makingCarrot();
        const carrotX = makingCarrotCoordinateX();
        const carrotY = makingCarrotCoordinateY();
        carrot.style.left=`${carrotX}%`;
        carrot.style.top=`${carrotY}%`;
        field.appendChild(carrot);
        const bug = makingBug();
        const bugX = makingBugCoordinateX();
        const bugY = makingBugCoordinateY();
        bug.style.left=`${bugX}%`;
        bug.style.top=`${bugY}%`;
        field.appendChild(bug);
    }
    document.addEventListener('click', event => {
        if(event.target.parentElement.className=="carrot"){
            event.target.parentElement.remove();
        } else if (event.target.parentElement.className=="bug") {
            gameOver();
        }
    });
}
function makingCarrot(){
    const carrotDiv = document.createElement('div');
    carrotDiv.setAttribute('class','carrot');
    carrotDiv.innerHTML = `<img src="./img/carrot.png" alt="carrot" />`
    return carrotDiv;
}
function makingCarrotCoordinateX(){
    const x = Math.random()*100;
    return x;
}
function makingCarrotCoordinateY(){
    const y = Math.random()*100;
    return y;
}

function makingBug(){
    const bugDiv = document.createElement('div');
    bugDiv.setAttribute('class','bug');
    bugDiv.innerHTML = `<img src="./img/bug.png" alt="bug" />`
    return bugDiv;
}
function makingBugCoordinateX(){
    const x = Math.random()*100;
    return x;
}
function makingBugCoordinateY(){
    const y = Math.random()*100;
    return y;
}

// 1. 만든다.
// 2. 좌표를 랜덤으로 찍어준다.
// 3. 화면에 표시한다.


function gameOver(){
    const div  = document.createElement('div')
    div.setAttribute('class', 'gameover')
    div.innerHTML = `<h1>gameOver</h1>`
    field.appendChild(div);
    div.addEventListener('click',retry);
}

function retry(){
    while(field.hasChildNodes()){
        field.removeChild(field.firstChild);
    }
    // 여기서 gameover div도 지워버리는구나~
    clearTimeout(timer);
    lefttime = 10;
    onCount();
}

