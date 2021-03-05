module.exports = function () {

    var sticky = {
        header: document.getElementById("stickyHeader"),
        init: function () {
            window.addEventListener('scroll', this.onScroll.bind(this));
        },
        onScroll: function () {
            window.scrollY ?
                this.header.classList.add('is-active') :
                this.header.classList.remove('is-active');
        }
    };

    sticky.init();
};