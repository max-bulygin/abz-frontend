module.exports = function () {

    var smoothScroll = {
        links: document.querySelectorAll("a[href='#registerNow'], a[href='#users']"),
        bindEvents: function () {
            for (var i = 0; i < this.links.length; i++) {
                this.links[i].addEventListener('click', this.clickHandler)
            }
        },
        clickHandler: function (e) {
            e.preventDefault();
            var href = this.getAttribute("href");

            document.querySelector(href).scrollIntoView({
                behavior: "smooth"
            });
        }
    };

    smoothScroll.bindEvents();
};
