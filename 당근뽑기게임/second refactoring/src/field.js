'use strict'
import * as sound from './sound.js';

// const carrotSound = new Audio('./sound/carrot_pull.mp3')
const CARROT_SIZE = 80;


export const ItemType = Object.freeze({
    carrot: 'carrot',
    bug:'bug',
});
// freeze API 활용 처음봄

export class Field{
    constructor(carrotCount, bugCount){
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;
        this.field = document.querySelector('.game__field');
        this.fieldRect = this.field.getBoundingClientRect();
        // this.onClick = this.onClick.bind(this);
        // onClick이 class와 바인딩이 됨. this 바인딩 공부. 근데 그냥 바로 arrow function으로 해버려도됨.
        // this.field.addEventListener('click',this.onClick); 이 아니라
        this.field.addEventListener('click',(event)=>this.onClick(event));
        // 이처럼 arrow function은 this가 유지되기 때문에 이렇게 해도 된다.
        // 아니면 아래 onClick이라는 멤버변수 자체를
        // onClick = event => { 내용 }으로 만들어줘도 this가 자동으로 바인딩이 된다.
    }

    init(){
        this.field.innerHTML = '';
        this._addItem('carrot',this.carrotCount,'./img/carrot.png')
        this._addItem('bug',this.bugCount,'./img/bug.png')
    }

    setClickListener(onItemClick){
        this.onItemClick = onItemClick;
    }

    _addItem(className, count, imgPath){
        // js에서는 아직 private한 함수를 만들 수 없다. 그래서 앞에 _를 붙여 외부에서 불러오지 말라고 말만 해둔 것이다. 효력은 없음.
        const x1 = 0;
        const y1 = 0;
        const x2 = this.fieldRect.width - CARROT_SIZE;
        const y2 = this.fieldRect.height - CARROT_SIZE;
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
            this.field.appendChild(item);
        }
    };

    onClick(event){
        const target = event.target;
        if(target.matches('.carrot')){
            target.remove();
            // playSound(carrotSound);
            sound.playCarrot();
            this.onItemClick && this.onItemClick(ItemType.carrot);
            // this.onItemClick에 콜백이 등록되어져 있으면 this.onItemClick()호출
        } else if(target.matches('.bug')){
            this.onItemClick && this.onItemClick(ItemType.bug);
        }
        // 새로운 api, matches('.')는 class가 carrot이면 이라는 뜻.
        // 나는 className을 이용했었다.
    }
}

function randomNumber(min, max){
    return Math.random() * (max - min) + min;
    // MDN에 최소 최대범위(min <= x < max) 랜덤으로 하려면 이렇게 하라고 나와있다.
}
// static함수라고, 이렇게 밖에다 만들어주면 클래스에 포함되는 것 보다, 밖에다가 두면 똑같이 반복해서 오브젝트에 만들어지지 않기 때문에 더 효율적이라는데 뭔소린지 잘 아직 모르겠음.