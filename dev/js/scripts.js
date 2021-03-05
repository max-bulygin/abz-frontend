var svg4everybody = require('svg4everybody');
var sticky = require('./modules/_sticky');
var smoothScroll = require('./modules/_smooth-scroll');

document.addEventListener('DOMContentLoaded', function () {
    svg4everybody();

    sticky();

    smoothScroll();
});