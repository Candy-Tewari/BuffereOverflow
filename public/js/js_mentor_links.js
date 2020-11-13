let linkedinArray = document.getElementsByClassName('linkedin');
let portfolioArray = document.getElementsByClassName('portfolio');


for(let i=0;i<linkedinArray.length;i++) {
    let linkedin = linkedinArray[i];
    let portfolio = portfolioArray[i];
    linkedin.addEventListener('click',()=>{
        let place = linkedin.getAttribute('value');
        linkedin.innerHTML = place;
        this.open(place, '_blank');
    });
    portfolio.addEventListener('click',()=>{
        let place = portfolio.getAttribute('value');
        portfolio.innerHTML = place;
        this.open(place, '_blank');
    });
}