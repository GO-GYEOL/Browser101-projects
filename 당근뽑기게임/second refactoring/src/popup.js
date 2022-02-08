'use strict';

// 팝업 관련 애들을 리액트의 컴포넌트처럼 만들어주기 위해 refactoring했다.

// export default라고 하면 이 클래스를 바깥으로 노출시키는 것이다. 이 파일에서 뿐만 아니라 외부에서도 이 클래스를 볼 수 있도록 바깥으로 노출시키는 것이다.
export default class PopUp{
    constructor(){
        this.popUp = document.querySelector('.pop-up');
        this.popUpText = document.querySelector('.pop-up__message');
        this.popUpRefresh = document.querySelector('.pop-up__refresh');
        // PopUp에서 생성자 함수(constructor)를 통해, 이 함수 내부에 this를 통해 탑제될 멤버변수들을 생성한다. this. 이 그냥 const 같은거인듯?
        this.popUpRefresh.addEventListener('click', ()=>{
            this.onClick && this.onClick();
            // onClick이라는 멤버변수 존재하므로 true이므로 뒤의 this.onClick()동작한다. 이거 이전 강의에서 배웠던 if조건문 간편하게 쓰는 방법임.
            // 즉 this.onClick이라는 멤버변수가 있을 경우에, this.onClick를 호출한다. 라는 뜻.
            this.hide();
        });
    }
    setClickListener(onClick){
        this.onClick = onClick;
        // PopUp내부에 setClickListener를 등록하면, 등록된 onclick을 호출해줄 것이다.
        // 야 PopUp, 내가 여기 onClick라는 callback을 등록해놓을테니까, 팝업에서 버튼이 클릭되면 내가 전달해주는 onClick를 호출해, 라고 받아오는 것이다.
        // 그래서 PopUp클래스에 onClick라는 멤버변수를 만들어줬고, 이 멤버변수는 전달받은 callback인 onClick을 할당받는다.
        // 근데 이 주황색글씨로 표기되는거 extension인가. theme에서 Monokai쓰면 됨
    }

    showWithText(text){
        this.popUpText.innerText = text;
        this.popUp.classList.remove('pop-up--hide');
        // 그러고보니 popUpText가 뭔지 아 지정해줬구나 위에서ㅋㅋ
    }

    hide(){
        this.popUp.classList.add('pop-up--hide');
        // 기존 hidePopUp()이라는 함수 main.js에서 지워줬다.
    }
}