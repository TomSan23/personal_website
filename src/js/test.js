var toggle = document.getElementById("navbar-toggle");
var navbar = document.getElementById("navbar");
toggle.addEventListener("click", function () {
   if(navbar.classList.contains("navbar-open")){
      navbar.classList.remove("navbar-open");
   } else {
      navbar.classList.add("navbar-open");
   }
});