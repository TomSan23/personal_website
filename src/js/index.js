var avatar = document.getElementById("avatar");
avatar.addEventListener("mousedown", function () {
    this.src = "images/mittens.jpg";
});
avatar.addEventListener("mouseleave", function () {
    this.src = "images/profile.jpg";
});
avatar.addEventListener("mouseup", function () {
    this.src = "images/profile.jpg";
});