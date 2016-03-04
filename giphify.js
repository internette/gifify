/*=========================================================================================

    Thanks to the following sites: 
    -http://www.sitepoint.com/guide-vanilla-ajax-without-jquery/
    -http://www.binaryintellect.net/articles/596d0c4b-eb24-4504-a379-e36dae020393.aspx

=========================================================================================*/
var Giphify = function () {
    this.targetElement = null;
}
Giphify.prototype.Init = function (query) {
    this.targetElement = document.querySelectorAll(query);
}
Giphify.prototype.CreateToolTip = function(imgsrc, elW, elH, par){
	var tip = document.createElement('div');
	var tipImg = document.createElement('img');
	tipImg.src = imgsrc;
	tipImg.style.width = (elW/2) + 'px';
	tip.id = 'tooltip';
	// tip.style.opacity = 0;
	tip.style.left = (par.getBoundingClientRect().left - (elW/4)) + 'px';
	tip.style.top = (par.getBoundingClientRect().top - (elH/2 + 25)) + 'px';
	tip.appendChild(tipImg);
	document.body.appendChild(tip);
}
Giphify.prototype.ApiCall = function(query, apikey, el){
	var $this = this;
	var $el = el;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://api.giphy.com/v1/gifs/search?q='+ query +'&api_key='+apikey);
	xhr.send(null);
	xhr.onreadystatechange = function () {
		var DONE = 4; // readyState 4 means the request is done.
		var OK = 200; // status 200 is a successful return.
		if (xhr.readyState === DONE) {
			if (xhr.status === OK){
				var gifs = JSON.parse(xhr.responseText).data;
				var random = $this.Random(0, gifs.length);
				var randGif = gifs[random];
				var gifImg = randGif.images.fixed_height;
				var gifSrc = gifImg.url;
				var gifURL = randGif.embed_url;
				var width = Number(gifImg.width);
        		var height = Number(gifImg.height);
				$this.CreateToolTip(gifSrc, width, height, $el);
				$this.FadeIn(document.getElementById('tooltip'));
			}
		} else {
			//Error Message Goes Here
		}
	}
}
Giphify.prototype.Random = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
Giphify.prototype.FadeIn = function(el){
	var $this = this;
	if(Number(el.style.opacity)<1){
	  el.style.opacity = Number(el.style.opacity) + 0.2;
	  el.style.top = (Number(el.style.top.replace('px','')) - 3) + 'px';
	  setTimeout(function(){
	    return $this.FadeIn(el);
	  }, 20);
	}
}
Giphify.prototype.FadeOut = function(el){
	var $this = this;
	if(Number(el.style.opacity)>0){
	  el.style.opacity = Number(el.style.opacity) - 0.2;
	  el.style.top = (Number(el.style.top.replace('px','')) + 3) + 'px';
	  setTimeout(function(){
	    return $this.FadeOut(el);
	  }, 30);
	} else {
		el.parentNode.removeChild(el);
	}
}
Giphify.prototype.giphify = function(apikey){
	for(var i = 0; i<this.targetElement.length; i++){
		$this = this.__proto__;
		this.targetElement[i].addEventListener('mouseenter', function(e){
			setTimeout(function(){
				$this.ApiCall(e.target.innerHTML, apikey, e.target);
			}, 100);
		});
		this.targetElement[i].addEventListener('mouseout', function(){
			var tooltips = document.querySelectorAll('#tooltip');
			for(var i = 0; i<tooltips.length; i++){
				var tooltip = tooltips[i];
				$this.FadeOut(tooltip);
			}
		});
	}
}
var Wrapper = function (query) {
    Wrapper.prototype = Giphify.prototype;
    Wrapper.fn = Giphify.prototype;
    var gif = new Giphify();
    gif.Init(query);
    return gif;
}
$ = Wrapper;