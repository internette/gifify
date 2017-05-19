/*=========================================================================================

    Thanks to the following sites: 
    -http://www.sitepoint.com/guide-vanilla-ajax-without-jquery/
    -http://www.binaryintellect.net/articles/596d0c4b-eb24-4504-a379-e36dae020393.aspx

=========================================================================================*/
var _ = self.Gifify = function (opts) {
		this.query = opts.query;
}

_.prototype = {
	get init_elms(){
		return this.getAllElements(this.query)
	},
	getAllElements: function(selector){
		return document.querySelectorAll(selector);
	},
	get cleanedQuery(){
		return this.query.match(/\s/gi) ? this.query.replace(/\s/gi, '+') : this.query
	},
	get getGiphyString(){
		return 'http://api.giphy.com/v1/gifs/search?q='+ this.cleanedQuery +'&api_key=dc6zaTOxFJmzC'
	},
	createTooltipImg: function(el_w, img_src){
		var tooltip_img = document.createElement('img');
		tooltip_img.src = img_src;
		tooltip_img.style.width = (el_w/2) + 'px';
		return tooltip_img
	},
	checkForBodyMargin: function(){
		
	},
	createToolTip: function(el_w, el_h, parent_elm, img_src){
		var tooltip = document.createElement('div');
		var tooltip_img = this.createTooltipImg(el_w, img_src)
		tooltip.id = 'tooltip';
		if (parent_elm.getBoundingClientRect().top < (el_h + 5)){
			tooltip.className += 'bottom';
			tooltip.style.top = (parent_elm.getBoundingClientRect().height + parent_elm.getBoundingClientRect().top) + 'px';
		} else {
			tooltip.className += 'top';
			tooltip.style.top = (parent_elm.getBoundingClientRect().top - (el_h/2 + 25)) + 'px';
		}
		if (parent_elm.getBoundingClientRect().left < el_w/2) {
			tooltip.className += ' left'
			tooltip.style.left = '25px';
		} else {
			tooltip.style.left = (parent_elm.getBoundingClientRect().left - (el_w/4)) + 'px';
		}
		tooltip.appendChild(tooltip_img);
		return tooltip
	},
	addTooltipToBody: function(img_src, el_w, el_h, parent_elm){
		var tooltip = this.createToolTip(el_w, el_h, parent_elm, img_src);
		document.body.appendChild(tooltip);
	},
	randInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	getRandomImage: function(images){
		var rand_int = this.randInt(0, images.length);
		return images[rand_int].images.fixed_height;
	},
	imgProperties: function(chosen_gif){
		return {
			src: chosen_gif.url,
			width: Number(chosen_gif.width),
			height: Number(chosen_gif.height)
		}
	},
	parsedResponseData: function(api_response){
		return JSON.parse(api_response).data;
	},
	initializeTooltip: function(api_response, elm){
		var gifs = this.parsedResponseData(api_response);
		var img_props = this.imgProperties(this.getRandomImage(gifs))
		this.addTooltipToBody(img_props.src, img_props.width, img_props.height, elm);
		this.fadeIn(document.getElementById('tooltip'));
	},
	fadeIn: function(el){
		var $this = this;
		if(Number(el.style.opacity)<1){
			el.style.opacity = Number(el.style.opacity) + 0.2;
			if(el.className.match(/top/gi)){
				el.style.top = (parseInt(el.style.top.slice(0, -2)) - 3) + 'px';
			} else {
				el.style.top = (parseInt(el.style.top.slice(0, -2))+ 3) + 'px';
			}
			setTimeout(function(){
				return $this.fadeIn(el);
			}, 20);
		}
	},
	apiCall: function(elm){
		var $this = this;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://api.giphy.com/v1/gifs/search?q='+ this.cleanedQuery +'&api_key=dc6zaTOxFJmzC');
		xhr.send(null);
		xhr.onreadystatechange = function () {
			var DONE = 4; // readyState 4 means the request is done.
			var OK = 200; // status 200 is a successful return.
			if (xhr.readyState === DONE) {
				if (xhr.status === OK){
					$this.initializeTooltip(xhr.responseText, elm)
				}
			} else {
				//Error Message Goes Here
			}
		}
	},
	fadeOut: function(el){
		var $this = this;
		if(Number(el.style.opacity)>0){
			el.style.opacity = Number(el.style.opacity) - 0.2;
			el.style.top = (Number(el.style.top.slice(0, -2)) + 3) + 'px';
			setTimeout(function(){
				return $this.fadeOut(el);
			}, 30);
		} else {
			el.parentNode.removeChild(el);
		}
	},
	gifify: function(){
		for(var i = 0; i<this.getAllElements(this.query).length; i++){
			$this = this;
			this.init_elms[i].addEventListener('mouseenter', function(e){
				setTimeout(function(){
					$this.apiCall(e.target);
				}, 100);
			});
			$this.init_elms[i].addEventListener('mouseout', function(){
				var tooltips = document.querySelectorAll('#tooltip');
				for(var i = 0; i<tooltips.length; i++){
					var tooltip = tooltips[i];
					$this.fadeOut(tooltip);
				}
			});
		}
	}
}
var Wrapper = function (user_query) {
    Wrapper.prototype = _.prototype;
    Wrapper.fn = _.prototype;
    return new Gifify({
			query: user_query
		});
}
$ = Wrapper;