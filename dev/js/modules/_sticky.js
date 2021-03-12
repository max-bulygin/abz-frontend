module.exports = function () {

    var sticky = {
        header: document.getElementById("stickyHeader"),
        main: document.querySelector(".site-main"),
        padding: "padding-top:" + document.getElementById("stickyHeader").offsetHeight + "px",
        init: function () {
            window.addEventListener("scroll", this.onScroll.bind(this));
        },
        onScroll: function () {
            if (window.scrollY) {
                this.header.classList.add("is-active");
                this.main.setAttribute("style", this.padding);
            } else {
                this.header.classList.remove("is-active");
                this.main.removeAttribute("style");
            }
        }
    };

    sticky.init();
};