/*=========================================================================================

    Thanks to the following sites: 
    -http://www.sitepoint.com/guide-vanilla-ajax-without-jquery/
    -http://www.binaryintellect.net/articles/596d0c4b-eb24-4504-a379-e36dae020393.aspx

=========================================================================================*/
var _ = self.Gifify = function (opts) {
	this.selector = opts.selector;
	// tooltip_height is 100 because fixed_height is chosen, which is 200
	// Then we cut the width in half in createTooltipImg, meaning we 
	// cut the height in half too
	// Then increased by 25 because arrow height plus top and bottom padding
	// Then add escape room for mouse if moved in the direction of the tooltip
	this.tooltip_height = 125
}

_.prototype = {
	get init_elms() {
		return this.getAllElements(this.selector)
	},
	getAllElements: function (selector) {
		return document.querySelectorAll(selector);
	},
	cleanedQuery: function (query) {
		return query.match(/\s/gi) ? query.replace(/\s/gi, '+').toLowerCase() : query.toLowerCase()
	},
	createTooltipImg: function (tooltip_width, img_src) {
		var tooltip_img = document.createElement('img');
		tooltip_img.src = img_src;
		tooltip_img.style.width = (tooltip_width) + 'px';
		return tooltip_img
	},
	createConditional: function (conditional, true_fn, false_fn) {
		if (conditional) {
			return true_fn()
		} else {
			return false_fn()
		}
	},
	styledToolTip: function (tooltip, attached_elm, img_width) {
		tooltip.id = 'gifify-tooltip'
		tooltip.style.top = this.topPosition(attached_elm)
		tooltip.style.left = this.leftPosition(attached_elm, img_width)
		tooltip.className = this.combineClasses(attached_elm, img_width)
		return tooltip
	},
	topPosition: function (attached_elm) {
		return this.createConditional(
			(attached_elm.getBoundingClientRect().top < this.tooltip_height),
			function () {
				return ((attached_elm.getBoundingClientRect().top + attached_elm.getBoundingClientRect().height) + 10) + 'px'
			}, function () {
				return (attached_elm.getBoundingClientRect().top - $this.tooltip_height - 10) + 'px'
			}
		)
	},
	leftPosition: function (attached_elm, tooltip_width) {
		return this.createConditional(
			(attached_elm.getBoundingClientRect().left < tooltip_width),
			function () {
				return attached_elm.getBoundingClientRect().left + 'px'
			}, function () {
				return $this.createConditional(
					(attached_elm.getBoundingClientRect().left > (window.innerWidth - tooltip_width)),
					function () {
						return (window.innerWidth - tooltip_width - 35) + 'px'
					}, function () {
						// We add the left alignment to the 1/2 width of the attached_elm to set 
						// tooltip left align to the middle of the element
						var center_of_attached_elm = (attached_elm.getBoundingClientRect().left + (attached_elm.getBoundingClientRect().width / 2))
						// Then we get the value of half of the tooltip and add 10 to account
						// for the padding
						var half_of_tooltip = (tooltip_width + 10) / 2
						// Finally, we subtract half of the tooltip width to center the tooltip
						// element as a whole
						return (center_of_attached_elm - half_of_tooltip) + 'px'
					}
				)
			}
		)
	},
	combineClasses: function (attached_elm, tooltip_width) {
		var classes = '', $this = this
		classes += this.createConditional(
			(attached_elm.getBoundingClientRect().top < this.tooltip_height),
			function () {
				return 'bottom'
			}, function () {
				return 'top'
			})
		classes += ' '
		classes += this.createConditional(
			(attached_elm.getBoundingClientRect().left < tooltip_width),
			function () {
				return 'left'
			}, function () {
				return $this.createConditional(
					(attached_elm.getBoundingClientRect().left > (window.innerWidth - tooltip_width)),
					function () {
						return 'right'
					}, function () {
						return ''
					}
				)
			}
		)
		classes = classes.trim()
		return classes
	},
	createGifToolTip: function (img_props, attached_elm) {
		var tooltip = this.styledToolTip(document.createElement('div'), attached_elm, img_props.width / 2);
		var tooltip_img = this.createTooltipImg(img_props.width / 2, img_props.src)
		tooltip.appendChild(tooltip_img)
		return tooltip
	},
	addTooltipToBody: function (img_props, attached_elm) {
		var tooltip = this.createGifToolTip(img_props, attached_elm);
		document.body.appendChild(tooltip);
	},
	randInt: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	getRandomImage: function (gifs) {
		var rand_int = this.randInt(0, gifs.length);
		var selected_gif = gifs[rand_int];
		if (selected_gif.hasOwnProperty('images')) {
			return selected_gif.images.fixed_height;
		} else {
			return selected_gif.fixed_height
		}
	},
	imgProperties: function (chosen_gif) {
		return {
			src: chosen_gif.url,
			width: parseInt(chosen_gif.width)
		}
	},
	parsedResponseData: function (api_response) {
		return JSON.parse(api_response).data;
	},
	initializeTooltip: function (api_response, attached_elm) {
		var gifs = this.parsedResponseData(api_response);
		var img_props = this.imgProperties(this.getRandomImage(gifs))
		this.addTooltipToBody(img_props, attached_elm);
		this.fadeIn(document.getElementById('gifify-tooltip'));
	},
	fadeIn: function (el) {
		var $this = this;
		if (Number(el.style.opacity) < 1) {
			el.style.opacity = Number(el.style.opacity) + 0.25;
			if (el.className.match(/top/gi)) {
				el.style.top = (parseInt(el.style.top.slice(0, -2)) - 2) + 'px';
			} else {
				el.style.top = (parseInt(el.style.top.slice(0, -2)) + 2) + 'px';
			}
			setTimeout(function () {
				return $this.fadeIn(el);
			}, 20);
		}
	},
	apiCall: function (elm) {
		var $this = this;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://api.giphy.com/v1/gifs/search?q=' + this.cleanedQuery(elm.innerHTML) + '&api_key=dc6zaTOxFJmzC');
		xhr.send(null);
		xhr.onreadystatechange = function () {
			var DONE = 4; // readyState 4 means the request is done.
			var OK = 200; // status 200 is a successful return.
			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {
					$this.initializeTooltip(xhr.responseText, elm)
				} else {
					console.error('There was a problem')
				}
			} else {
				// ERROR MESSAGE
			}
		}
	},
	fadeOut: function (el) {
		var $this = this;
		if (Number(el.style.opacity) > 0) {
			el.style.opacity = Number(el.style.opacity) - 0.25;
			el.style.top = (Number(el.style.top.slice(0, -2)) + 2) + 'px';
			setTimeout(function () {
				return $this.fadeOut(el);
			}, 30);
		} else {
			el.parentNode.removeChild(el);
		}
	},
	gifify: function () {
		for (var i = 0; i < this.getAllElements(this.selector).length; i++) {
			$this = this;
			this.init_elms[i].addEventListener('mouseenter', function (e) {
				setTimeout(function () {
					$this.apiCall(e.target);
				}, 100);
			});
			$this.init_elms[i].addEventListener('mouseout', function () {
				var tooltips = document.querySelectorAll('#gifify-tooltip');
				for (var i = 0; i < tooltips.length; i++) {
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
		selector: user_query
	});
}
$ = Wrapper;