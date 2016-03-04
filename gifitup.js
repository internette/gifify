var GiphItUp = function () {
    this.targetElement = null;
}
GiphItUp.prototype.Init = function (query) {
    this.targetElement = document.querySelectorAll(query);
}