const burger = document.querySelector('.burger');
const header = document.querySelector('.header');
const spans = burger.querySelectorAll('span');
const navLinks = document.querySelectorAll('.nav_link');

let open = false;
let isAnimating = false;

function openMenu(){
    if (open || isAnimating) return;
    isAnimating = true;
    open = true;

    const middleTop = spans[1].offsetTop;
    //  схлопывание
    spans[0].style.top = middleTop + 'px';
    spans[2].style.top = middleTop + 'px';
    header.classList.add('expanded');
    header.classList.remove('collapsed');
        
    setTimeout(() => {
        // скрываем центральную
        spans[1].style.opacity = '0';

            // делаем крестик
        spans[0].style.transform = 'rotate(45deg)';
        spans[2].style.transform = 'rotate(-45deg)';
    }, 300); 
    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

function closeMenu(){
    if (!open || isAnimating) return;
    isAnimating = true;
    open = false;

    // убираем крестик
    spans[0].style.transform = 'rotate(0deg)';
    spans[2].style.transform = 'rotate(0deg)';
    spans[1].style.opacity = '1';

    // закрываем меню
    header.classList.remove('expanded');
    header.classList.add('collapsed');

    setTimeout(() => {
        spans[0].style.top = '0px';
        spans[2].style.top = '16px';
    }, 300);

    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

burger.addEventListener('click', () => {
    if (isAnimating) return; 

    if (open) {
        closeMenu();
    } else {
        openMenu();
    }
});
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});