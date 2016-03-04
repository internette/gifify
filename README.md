# GIPHIFY
This is the readme for the library Giphify, a [GIPHY](http://giphy.com/) powered tooltip. There are zero dependencies.
##How To Use
1.  Download the JavaScript file (gifitup.min.js) and CSS file (gifitup.min.css)
2.  Put the JavaScript and CSS files into your project folder
3.  Link to the JavaScript and CSS files in your html file
4.  Go to the [Request API Key](http://api.giphy.com/submit) link to request an API key
5.  Initialize the tooltip through one of the following ways:

**Without jQuery**
```html
<span class="tooltip">This will be a tooltip</span>
```
```javascript
window.onload = function(){
	$('.tooltip').giphify('APIKEYGOESHERE');
}
```

**With jQuery**
```html
<span class="tooltip">This will be a tooltip</span>
```
```javascript
$(document).ready(function(){
	$('.tooltip').giphify('APIKEYGOESHERE');
});
```

##What's to come?
I'm planning on including color schemes, potentially the choice of a click to show the tooltip (if mouse over is not your thing). I'm also considering adding the ability to choose which direction your tooltip should appear (top, left, right, bottom). If you have any other ideas, please don't resist to reach out to me at [acj.gfx@gmail.com](mailto:acj.gfx@gmail.com). Please enjoy!

![Please enjoy!](http://i.giphy.com/Myrl3DnFGuuvS.gif "Please Enjoy!")