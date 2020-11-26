
window.onload = init

function init() {

let sidebar = document.querySelector('.toggle-sidebar');
let maidSideBar = document.querySelector('.toggle-sidebar-main');
let sideBarBody = document.querySelector('.sideBar ');

if(sidebar && maidSideBar){
    sidebar.addEventListener('click', closeNav)
    maidSideBar.addEventListener('click', openNav)



 function closeNav() {

    sideBarBody.classList.add('hideNav', 'animate__animated', 'animate__fadeOutLeft') 
 
 
 } 

 function openNav() {

     sideBarBody.classList.remove('hideNav', 'animate__animated', 'animate__fadeOutLeft') 
    sideBarBody.classList.add('openNav', 'animate__animated', 'animate__fadeInLeft')
 }



 function performAction() {
   if(document.body.clientWidth < 770){
    
    sideBarBody.style.display="none"
   
   }else if(document.body.clientWidth > 768){
    sideBarBody.style.display="block"
    sideBarBody.classList.add('animate__animated', 'animate__fadeInLeft')
    sideBarBody.classList.remove( 'animate__fadeOutLeft')
   }
 }


 window.onresize = performAction  
   
}
  
}

