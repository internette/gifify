var aList = document.querySelectorAll('.tooltip');
var tooltip = {
  randomGif: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  init: function(el, elX, elY){
    var $el = el, x = elX, y = elY;
    $.ajax({
      url: 'http://api.giphy.com/v1/gifs/search?q='+ el.innerHTML.replace(/ /g, '+') +'&api_key=dc6zaTOxFJmzC',
      dataType: 'json',
      success: function(gifs){
        var gif = gifs.data[tooltip.randomGif(0,gifs.data.length)].images.fixed_height;
        var gifUrl = gif.url;
        var width = Number(gif.width);
        var height = Number(gif.height);
        tooltip.create(gifUrl, $el, height, width, elX, elY);
        // var toolTip = document.getElementById('tooltip');
        // toolTip.style.top = (top-height-viewportOffset.height) + 'px';
        // toolTip.style.top = window.innerHeight - (el.offsetParent.offsetTop + el.offsetTop).px;
        // toolTip.style.left = (left-(width/2))+'px';
        // console.log(viewportOffset);
      }
    });
  },
  create: function(el, par, elH, elW, elX, elY){
    var tip = document.createElement('div');
    var tipImg = document.createElement('img');
    tipImg.src = el;
    tip.id = 'tooltip';
    tip.style.top =  (par.offsetParent.offsetTop - elH - Number(getComputedStyle(par.offsetParent).height.replace('px',''))) + 'px';
    tip.style.left =  (par.offsetParent.offsetLeft-((elW/2)-(Number(getComputedStyle(par).width.replace('px',''))/2))+5) + 'px';
    console.log();
    tip.appendChild(tipImg);
    document.body.appendChild(tip);
  },
  animate: function(){
    var thistip = document.getElementById('');
  },
  remove: function(el){
    document.body.removeChild(document.getElementById('tooltip'));
  }
}
for(var i = 0; i<aList.length; i++){
  document.querySelectorAll('.tooltip')[i].addEventListener('mouseenter',function(e){
    tooltip.init(e.target, e.clientX, e.clientY);
  });
    document.querySelectorAll('.tooltip')[i].addEventListener('mouseleave',function(e){
    tooltip.remove(e.target);
  });
}