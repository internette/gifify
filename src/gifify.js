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
	createToolTip: function(el_w, attached_elm, img_src){
		var tooltip = document.createElement('div');
		var tooltip_img = this.createTooltipImg(el_w, img_src)
		// tooltip_height is 100 because fixed_height is chosen, which is 200
		// Then we cut the width in half in createTooltipImg, meaning we 
		// cut the height in half too
		// Then increased by 25 because arrow height plus top and bottom padding
		// Then add escape room for mouse if moved in the direction of the tooltip
		var tooltip_height = 125
		var tooltip_width = el_w/2;
		tooltip.id = 'gifify-tooltip';
		if (attached_elm.getBoundingClientRect().top < (tooltip_height)){
			tooltip.className += 'bottom';
			tooltip.style.top = ((attached_elm.getBoundingClientRect().top + attached_elm.getBoundingClientRect().height) + 10) + 'px';
		} else {
			tooltip.className += 'top';
			tooltip.style.top = (attached_elm.getBoundingClientRect().top - tooltip_height - 10) + 'px';
		}
		if (attached_elm.getBoundingClientRect().left < tooltip_width) {
			tooltip.className += ' left';
			tooltip.style.left = attached_elm.getBoundingClientRect().left + 'px';
		} else if (attached_elm.getBoundingClientRect().left > (window.innerWidth - tooltip_width)) {
			tooltip.className += ' right';
			tooltip.style.left = 'auto';
			tooltip.style.right = '15px';
		} else {
			// We add the left alignment to the 1/2 width of the attached_elm to set 
			// tooltip left align to the middle of the element
			var center_of_attached_elm = (attached_elm.getBoundingClientRect().left + (attached_elm.getBoundingClientRect().width/2));
			// Then we get the value of half of the tooltip and add 10 to account
			// for the padding
			var half_of_tooltip = (tooltip_width+10)/2;
			// Finally, we subtract half of the tooltip width to center the tooltip
			// element as a whole
			tooltip.style.left = (center_of_attached_elm - half_of_tooltip) + 'px';
		}
		tooltip.appendChild(tooltip_img);
		return tooltip
	},
	addTooltipToBody: function(img_src, el_w, attached_elm){
		var tooltip = this.createToolTip(el_w, attached_elm, img_src);
		document.body.appendChild(tooltip);
	},
	randInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	getRandomImage: function(gifs){
		var rand_int = this.randInt(0, gifs.length);
		var selected_gif = gifs[rand_int];
		if(selected_gif.hasOwnProperty('images')){
			return selected_gif.images.fixed_height;
		} else {
			return selected_gif.fixed_height
		}
	},
	imgProperties: function(chosen_gif){
		return {
			src: chosen_gif.url,
			width: parseInt(chosen_gif.width)
		}
	},
	parsedResponseData: function(api_response){
		return JSON.parse(api_response).data;
	},
	initializeTooltip: function(api_response, elm){
		var gifs = this.parsedResponseData(api_response);
		var img_props = this.imgProperties(this.getRandomImage(gifs))
		this.addTooltipToBody(img_props.src, img_props.width, elm);
		this.fadeIn(document.getElementById('gifify-tooltip'));
	},
	fadeIn: function(el){
		var $this = this;
		if(Number(el.style.opacity)<1){
			el.style.opacity = Number(el.style.opacity) + 0.25;
			if(el.className.match(/top/gi)){
				el.style.top = (parseInt(el.style.top.slice(0, -2)) - 2) + 'px';
			} else {
				el.style.top = (parseInt(el.style.top.slice(0, -2)) + 2) + 'px';
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
				} else {
					console.error('There was a problem')
				}
			} else {
				// ERROR MESSAGE
			}
		}
	},
	fadeOut: function(el){
		var $this = this;
		if(Number(el.style.opacity)>0){
			el.style.opacity = Number(el.style.opacity) - 0.25;
			el.style.top = (Number(el.style.top.slice(0, -2)) + 2) + 'px';
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
				var tooltips = document.querySelectorAll('#gifify-tooltip');
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