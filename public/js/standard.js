// Global JS file, show me included in all webpage

window.SITE_URL = '//' + location.host;


// ================================= Plugins =================================

// jQuery caret
!function(e,t){var n=document.createElement("input"),r={setSelectionRange:"setSelectionRange"in n||"selectionStart"in n,createTextRange:"createTextRange"in n||"selection"in document},a=/\r\n/g,o=/\r/g,c=function(t){return"undefined"!=typeof t.value?t.value:e(t).text()},i=function(t,n){"undefined"!=typeof t.value?t.value=n:e(t).text(n)},s=function(e,t){var n=c(e).replace(o,""),r=n.length;return"undefined"==typeof t&&(t=r),t=Math.floor(t),0>t&&(t=r+t),0>t&&(t=0),t>r&&(t=r),t},u=function(e,t){return e.hasAttribute?e.hasAttribute(t):"undefined"!=typeof e[t]},l=function(e,t,n,r){this.start=e||0,this.end=t||0,this.length=n||0,this.text=r||""};l.prototype.toString=function(){return JSON.stringify(this,null,"    ")};var g=function(e){return e.selectionStart},f=function(e){var t,n,r,o,i,s;return e.focus(),e.focus(),n=document.selection.createRange(),n&&n.parentElement()===e?(o=c(e),i=o.length,r=e.createTextRange(),r.moveToBookmark(n.getBookmark()),s=e.createTextRange(),s.collapse(!1),t=r.compareEndPoints("StartToEnd",s)>-1?o.replace(a,"\n").length:-r.moveStart("character",-i)):0},h=function(e){return e?r.setSelectionRange?g(e):r.createTextRange?f(e):t:t},d=function(e,t){e.setSelectionRange(t,t)},m=function(e,t){var n=e.createTextRange();n.move("character",t),n.select()},v=function(e,t){e.focus(),t=s(e,t),r.setSelectionRange?d(e,t):r.createTextRange&&m(e,t)},x=function(e,t){var n=h(e),r=c(e).replace(o,""),a=+(n+t.length+(r.length-n)),s=+e.getAttribute("maxlength");if(u(e,"maxlength")&&a>s){var l=t.length-(a-s);t=t.substr(0,l)}i(e,r.substr(0,n)+t+r.substr(n)),v(e,n+t.length)},p=function(e){var t=new l;t.start=e.selectionStart,t.end=e.selectionEnd;var n=Math.min(t.start,t.end),r=Math.max(t.start,t.end);return t.length=r-n,t.text=c(e).substring(n,r),t},R=function(e){var t=new l;e.focus();var n=document.selection.createRange();if(n&&n.parentElement()===e){var r,a,o,i,s=0,u=0,g=c(e);r=g.length,a=g.replace(/\r\n/g,"\n"),o=e.createTextRange(),o.moveToBookmark(n.getBookmark()),i=e.createTextRange(),i.collapse(!1),o.compareEndPoints("StartToEnd",i)>-1?s=u=r:(s=-o.moveStart("character",-r),s+=a.slice(0,s).split("\n").length-1,o.compareEndPoints("EndToEnd",i)>-1?u=r:(u=-o.moveEnd("character",-r),u+=a.slice(0,u).split("\n").length-1)),s-=g.substring(0,s).split("\r\n").length-1,u-=g.substring(0,u).split("\r\n").length-1,t.start=s,t.end=u,t.length=t.end-t.start,t.text=a.substr(t.start,t.length)}return t},S=function(e){return e?r.setSelectionRange?p(e):r.createTextRange?R(e):t:t},T=function(e,t,n){e.setSelectionRange(t,n)},b=function(e,t,n){var r=e.createTextRange();r.moveEnd("textedit",-1),r.moveStart("character",t),r.moveEnd("character",n-t),r.select()},E=function(e,t,n){t=s(e,t),n=s(e,n),r.setSelectionRange?T(e,t,n):r.createTextRange&&b(e,t,n)},w=function(t,n){var r=e(t),a=r.val(),o=S(t),c=+(o.start+n.length+(a.length-o.end)),i=+r.attr("maxlength");if(r.is("[maxlength]")&&c>i){var s=n.length-(c-i);n=n.substr(0,s)}var u=a.substr(0,o.start),l=a.substr(o.end);r.val(u+n+l);var g=o.start,f=g+n.length;E(t,o.length?g:f,f)},y=function(e){var t=window.getSelection(),n=document.createRange();n.selectNodeContents(e),t.removeAllRanges(),t.addRange(n)},k=function(e){var t=document.body.createTextRange();t.moveToElementText(e),t.select()},A=function(t){var n=e(t);return n.is("input, textarea")||t.select?void n.select():void(r.setSelectionRange?y(t):r.createTextRange&&k(t))},B=function(){document.selection?document.selection.empty():window.getSelection&&window.getSelection().removeAllRanges()};e.extend(e.fn,{caret:function(){var e=this.filter("input, textarea");if(0===arguments.length){var t=e.get(0);return h(t)}if("number"==typeof arguments[0]){var n=arguments[0];e.each(function(e,t){v(t,n)})}else{var r=arguments[0];e.each(function(e,t){x(t,r)})}return this},range:function(){var e=this.filter("input, textarea");if(0===arguments.length){var t=e.get(0);return S(t)}if("number"==typeof arguments[0]){var n=arguments[0],r=arguments[1];e.each(function(e,t){E(t,n,r)})}else{var a=arguments[0];e.each(function(e,t){w(t,a)})}return this},selectAll:function(){return this.each(function(e,t){A(t)})}}),e.extend(e,{deselectAll:function(){return B(),this}})}(window.jQuery||window.Zepto||window.$);

// Rate limiter
window.RateLimiter = function(a){var b=1e3*a.interval,c=a.maxInInterval,d=a.minDifference?1e3*a.minDifference:null,f=(a.namespace||null,{}),g={};return function(){var i,a=Array.prototype.slice.call(arguments),h=a.pop();"function"==typeof h?i=a[0]||"":(i=h||"",h=null);var j=1e3*Date.now(),l=j-b;clearTimeout(g[i]);var p,m=f[i]=(f[i]||[]).filter(function(a){return a>l}),n=m.length>=c,o=d&&j-m[m.length-1];return n||d>o?(p=Math.min(m[0]-j+b,d?d-o:1/0),p=Math.floor(p/1e3)):p=0,m.push(j),g[i]=setTimeout(function(){delete f[i]},b/1e3),h?h(null,p):p}}

// jquery simulate
;(function($){$.fn.extend({simulate:function(type,options){return this.each(function(){var opt=$.extend({},$.simulate.defaults,options||{});new $.simulate(this,type,opt);});}});$.simulate=function(el,type,options){this.target=el;this.options=options;if(/^drag$/.test(type)){this[type].apply(this,[this.target,options]);}else{this.simulateEvent(el,type,options);}};$.extend($.simulate.prototype,{simulateEvent:function(el,type,options){var evt=this.createEvent(type,options);this.dispatchEvent(el,type,evt,options);return evt;},createEvent:function(type,options){if(/^mouse(over|out|down|up|move)|(dbl)?click$/.test(type)){return this.mouseEvent(type,options);}else if(/^key(up|down|press)$/.test(type)){return this.keyboardEvent(type,options);}},mouseEvent:function(type,options){var evt;var e=$.extend({bubbles:true,cancelable:(type!="mousemove"),view:window,detail:0,screenX:0,screenY:0,clientX:0,clientY:0,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,button:0,relatedTarget:undefined},options);var relatedTarget=$(e.relatedTarget)[0];if($.isFunction(document.createEvent)){evt=document.createEvent("MouseEvents");evt.initMouseEvent(type,e.bubbles,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget||document.body.parentNode);}else if(document.createEventObject){evt=document.createEventObject();$.extend(evt,e);evt.button={0:1,1:4,2:2}[evt.button]||evt.button;} return evt;},keyboardEvent:function(type,options){var evt;var e=$.extend({bubbles:true,cancelable:true,view:window,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,keyCode:0,charCode:0},options);if($.isFunction(document.createEvent)){try{evt=document.createEvent("KeyEvents");evt.initKeyEvent(type,e.bubbles,e.cancelable,e.view,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.keyCode,e.charCode);}catch(err){evt=document.createEvent("Events");evt.initEvent(type,e.bubbles,e.cancelable);$.extend(evt,{view:e.view,ctrlKey:e.ctrlKey,altKey:e.altKey,shiftKey:e.shiftKey,metaKey:e.metaKey,keyCode:e.keyCode,charCode:e.charCode});}}else if(document.createEventObject){evt=document.createEventObject();$.extend(evt,e);} if(($.browser!==undefined)&&($.browser.msie||$.browser.opera)){evt.keyCode=(e.charCode>0)?e.charCode:e.keyCode;evt.charCode=undefined;} return evt;},dispatchEvent:function(el,type,evt){if(el.dispatchEvent){el.dispatchEvent(evt);}else if(el.fireEvent){el.fireEvent('on'+type,evt);} return evt;},drag:function(el){var self=this,center=this.findCenter(this.target),options=this.options,x=Math.floor(center.x),y=Math.floor(center.y),dx=options.dx||0,dy=options.dy||0,target=this.target;var coord={clientX:x,clientY:y};this.simulateEvent(target,"mousedown",coord);coord={clientX:x+1,clientY:y+1};this.simulateEvent(document,"mousemove",coord);coord={clientX:x+dx,clientY:y+dy};this.simulateEvent(document,"mousemove",coord);this.simulateEvent(document,"mousemove",coord);this.simulateEvent(target,"mouseup",coord);},findCenter:function(el){var el=$(this.target),o=el.offset();return{x:o.left+el.outerWidth()/2,y:o.top+el.outerHeight()/2};}});$.extend($.simulate,{defaults:{speed:'sync'},VK_TAB:9,VK_ENTER:13,VK_ESC:27,VK_PGUP:33,VK_PGDN:34,VK_END:35,VK_HOME:36,VK_LEFT:37,VK_UP:38,VK_RIGHT:39,VK_DOWN:40});})(jQuery);

// fast click
$(function() {
    if (window.FastClick) FastClick.attach(document.body);
});




// ================================= Settings =================================

// Prevent IE caching GET request
$.ajaxSetup({ cache: false });

// capitalize string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// Detecting an "invalid date" Date object
Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
};





// ============================= Global Functions =============================

// Generate UUID (used as identifier for messaging)
window.GenerateUUID = function(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


// make addEventListener works in IE
window.AttachEvent = function(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    }else if (element.attachEvent) {
        element.attachEvent('on' + type, handler)
    } else {
        element['on' + type] = handler;
    }
};

// preload images
window.PreloadImages = function(arr) {
    arr.forEach(function(url){
        $('#preload').append('<img width="1" height="1" src="' + url + '">');
    });
};

// jQuery's .show() and .hide() only operate on the CSS 'display' property, these 2 custom
// function will toggle the 'visibility' property (not used atm)
$.fn.showV = function() { this.css('visibility', 'visible'); return this; };
$.fn.hideV = function() { this.css('visibility', 'hidden'); return this; };

// jQuery's .show() set display to block, this set it to inline-block
$.fn.showI = function() { this.css('display', 'inline-block'); return this; };

// set text, if empty falls back to "data-default" attribute of that element
$.fn.text2 = function(content) {
    var $this = this;
    return this.text(function(){
        return content || $this.attr('data-default')
    });
};

// set text to the value of its attribute
$.fn.textAttr = function(attr) {
    return this.text(this.attr(attr));
};


// adjust element's height to fit its content
$.fn.adjustHeight = function(){
    var sum = 0;
    this.children().each(function() {
        if ($(this).css('position') == 'absolute') return;
        sum += $(this).outerHeight(true);
    });
    this.height(sum);
    return this;
};

// - if (screen - n) is too small for absolutely centered element, position
//   it on top instead of cropping their top and bottom parts
// - if "reHeight" is true, adjust element's height to fit its content
// - element must have absolute position
$.fn.magicCenter = function(options){
    var opt = {
        n: 0,
        adjustHeight: false
    };
    _.extend(opt, options);
    if (opt.adjustHeight) this.adjustHeight();
    if (this.height() > window.innerHeight - opt.n) this.css('bottom', 'auto');
    else this.css('bottom', '0px');
    return this;
};

// return true if div is scrolled to bottom (used atm to load more convo on top tar)
$.fn.scrolledToBottom = function(tolerance){
    if (!tolerance) tolerance = 10;
    if (this.scrollTop() + this.innerHeight() >= this.get(0).scrollHeight - tolerance) {
        return true;
    }
    else return false;
};

// true if page contents exceed viewport (vertically)
window.PageExceedsViewport = function(){
    return $(document).height() > $(window).height();
};

// Get height of hidden elements
$.fn.getHeight = function(){
    var previousCss  = this.attr("style");
    this.css({
        position:   'absolute',
        visibility: 'hidden',
        display:    'block'
    });
    var optionHeight = this.height();
    this.attr("style", previousCss ? previousCss : "");
    return optionHeight;
};

// Determine if element is visible in viewport
window.IsVisibleInViewport = function(el) {
    if (typeof jQuery === "function" && el instanceof jQuery) el = el[0];
    if (!el || !el.getBoundingClientRect) return;
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
};

// create a non-blocking version of _.each, allowing UX to be smoother and avoid freezing
// the webpage due to compution intensive task blocking the main event loop
// internally, it runs 1 iteration of the loop at each clock tick, instead of stacking iterations
// as much as possible (which is the normal way)
window.asyncEach = function(items, fn, i){
    if (!_.isArray(items) || _.size(items) <= 0) return;
    if ( i >= items.length) return;
    if (!i) i = 0;
    fn(items[i]);
    setTimeout(function(){
        asyncEach(items, fn, ++i);
    }, 0);
};


// Call fn once condition is satisfied. Use this instead of while to avoid blocking main thread
// Both parameters are functions.
window.executeWhen = function(fn, condition){
    var id = setInterval(function(){
        if (condition()) { clearInterval(id); fn(); }
    }, 1);
};


// ---------- helper animate.css functions ----------------
$.fn.animatedShow = function(effect, duration, callback){ // duration can be "long" or "short", default is short
    var callback = _.isFunction(callback) ? callback : function(){};
    var durationClass = ''
    if (duration == "long") durationClass = "animate_duration_long";
    else if (duration == "medium") durationClass = "animate_duration_medium";
    else if (duration == "short") durationClass = "animate_duration_short";
    else if (duration == "very short") durationClass = "animate_duration_very_short";
    else if (parseInt(duration)) durationClass = "animate_duration_" + parseInt(duration);
    var classes = 'animated ' + durationClass + ' ' + effect;
    var $this = this;
    $this.addClass(classes).show()
    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $this.removeClass(classes);
        callback($this);
    });
    return this;
};

$.fn.animatedHide = function(effect, duration, callback){ // duration can be "long" or "short", default is short
    var callback = _.isFunction(callback) ? callback : function(){};
    var durationClass = ''
    if (duration == "long") durationClass = "animate_duration_long";
    else if (duration == "medium") durationClass = "animate_duration_medium";
    else if (duration == "short") durationClass = "animate_duration_short";
    else if (duration == "very short") durationClass = "animate_duration_very_short";
    else if (parseInt(duration)) durationClass = "animate_duration_" + parseInt(duration);
    var classes = 'animated ' + durationClass + ' ' + effect;
    var $this = this.data('uniqueId', new Date());
    $this.addClass(classes)
    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $this.hide().removeClass(classes);
        callback($this);
    });
    return this;
};


// insert DOM element at a specific index (not used atm)
$.fn.insertAt = function(index, element) {
  if (!index) {
    this.append(element); return this;
  }
  var lastIndex = this.children().size()
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index)
  }
  this.append(element)
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last())
  }
  return this;
};

// Get URL parameters. Ex: $.urlParam('id'); will output 6
$.urlParam = function(name, url){
    url = url || window.location.href;
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
    if (results==null){
       return null;
    } else{ return results[1] || 0; }
};


// when scroll inside an element, disable page scroll
window.DisableOuterScroll = function(element, e){
    if ($(element).get(0).scrollHeight <= $(element).height()) return;
    var d = e.originalEvent.wheelDelta || -e.originalEvent.detail,
        dir = d > 0 ? 'up' : 'down',
        stop = (dir == 'up' && element.scrollTop == 0) || (dir == 'down' && element.scrollTop == element.scrollHeight-element.offsetHeight);
    stop && e.preventDefault();

}


// extract background-image's url
window.ExtractBgUrl = function(bg_url){
    if (!bg_url) return '';
    bg_url = /^url\((['"]?)(.*)\1\)$/.exec(bg_url);
    bg_url = bg_url ? bg_url[2] : ""; // If matched, retrieve url, otherwise ""
    return bg_url;
};

// set element's background-image url
$.fn.setBgUrl = function(url){
    return this.css('background-image', 'url(' + url + ')');
};

window.HideAllPages = function(){
    $('body').children('.page').hide();
};

window.ShowPage = function(page){
    HideAllPages();
    $('#' + page + '-page').show();
};

// determine if currently using mobile
window.IsMobile = function() {
    return (typeof window.orientation !== 'undefined');
};

// determine if current browser is android or iOS
window.GetOS = function() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ) return 'iOS';
  else if(userAgent.match( /Android/i )) return 'Android';
  else return 'unknown';
}



// display last active in human readable format, rely on beautify.timeAgo module
// To use: must have data-time attribute
$.fn.timeAgo = function(){
    var t = this.attr('data-time');
    if (!t || !beautify.timeAgo) return;
    // replace text
    var s = beautify.timeAgo(t);
    this.text(s);
    // add a title so in case of 3M, people know it means 3 months ago
    var n = parseInt(s);
    var unit = s.replace(n+'', '');
    var plural = n >= 2 ? 's' : '';
    if (unit == 's') unit = 'second';
    else if (unit == 'm') unit = 'minute';
    else if (unit == 'h') unit = 'hour';
    else if (unit == 'M') unit = 'month';
    else if (unit == 'y') unit = 'year';
    var explanation = 'last active ' + n + ' ' + unit + plural + ' ago';
    this.attr('title', explanation);
    return this;
};


// Set div to remaining height with unknown height divs above and below
$.fn.FitHeight = function(){
    var sum = 0;
    var $p = this.parent();
    $p.children().not(this).each(function(){
        sum += $(this).outerHeight();
    });
    var h = $p.height() - sum;
    this.outerHeight(h);
};



// handle status for both $.post and $.PostFormData
$.StatusHander = function(status){
    // you must login
    if (status == 401) LoginAlert();
    // you are blocked
    if (status == 299){
        if (!window.showNotifBubble) return;
        showNotifBubble({ content: 'You are unable to perform such action.' });
    }
};



// send formdata wrapper
$.PostFormData = function(url, options){
    var formData = options.formData; // formData to be sent if it's supported
    var fallbackData = options.fallbackData; // data to be sent if formData is not supported
    var fallbackCondition = options.fallbackCondition || function(){ return false; }; // condition that forces the usage of fallback call & data
    var onProgress = options.onProgress || function(){}; // upload progress
    var onLoad = options.onLoad || function(){}; // upload complete
    var onSuccess = options.onSuccess || function(){}; // ajax call returns 200
    var onComplete = options.onComplete || function(){}; // ajax call is complete
    var onError = options.onError || function(){}; // error occured
    var onTooMany = options.onTooMany || function(){}; // too many requests
    // if browser doesn't support FormData, falls back to normal POST method, which can not include audio
    if ( fallbackData && (!window.FormData || fallbackCondition()) ) {
        $post(url, fallbackData, function(data){
            onSuccess(data);
        });
    }
    // if browser supports FormData, use multipart
    else {
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                if (!xhr.upload) return;
                AttachEvent(xhr.upload, 'progress', function(e){
                    e = e || window.event;
                    var percentage = e.loaded / e.total;
                    onProgress(percentage, e);
                }, false);
                AttachEvent(xhr.upload, 'load', function(e){
                    e = e || window.event;
                    onLoad(e);
                }, false);
               return xhr;
            },
            success: function(data){
                onSuccess(data);
            },
            complete: function(xhr){
                // too many requests
                if (xhr.status == 429) onTooMany();
                onComplete();
                // other issues
                $.StatusHander(xhr.status);
            },
            error: onError
        });
    }
};

// storage for $.ajax "lock" option
window.AjaxLocked = {};

// custom $.ajax
window.$ajax = function(opt){
    // by default, if user is not logged in, we'll pop an alert
    // asking user to login or signup
    if (_.isUndefined(opt.loginAlert)) opt.loginAlert = true;
    opt.url = SITE_URL + opt.url;
    opt.xhrFields =  { withCredentials: true };
    opt.crossDomain = true;   
    // set option "lock" to TRUE, ensures a request to be processed before making it again. Defaults to FALSE
    var req_id = opt.type + ' ' + opt.url + ' ' + JSON.stringify(opt.data || {});
    if (opt.lock){
        var successFn = opt.success || function(){};
        if (AjaxLocked[req_id]) return;
        AjaxLocked[req_id] = true;
        opt.success = function(args){
            // unlock first, then execute success callback
            AjaxLocked[req_id] = false;
            successFn(args);
        }
    }
    return $.ajax.apply(this, [opt]).complete(function(xhr, status){
        // unlock if success callback didn't execute
        if (opt.lock && status != 'success'){
            AjaxLocked[req_id] = false;
        }
        // execute when401() callback
        if (xhr.status == 401){
            window.LoginAlert();
            if (opt.when401) opt.when401();
        }
        // execute onComplete() callback
        if (opt.onComplete) opt.onComplete();
    });
}

// custom $.get
window.$get = function(route, successFn){
    return $ajax({ url: route, success: successFn, type: 'GET' });
}

// custom $.post
window.$post = function(route, data, successFn, opt){
    opt = opt || {};
    return $ajax(_.extend({ url: route, data: data, success: successFn, type: 'POST' }, opt));
}

// determine if string contains chinese/japanese
window.HasChinese = function(s){
    return s && s.match(/[\u3400-\u9FBF]/);
};

// a default swal error message, when we have nothing to say
window.swalError = function(){
    swal({
        title: "",
        text: "<h2 style='margin-bottom:0;'>Error occured.</h>",
        showConfirmButton: true,
        html: true,
        type: 'error'
    });
};

//swel error msg that allows customized error msg
window.swalError2 = function (errMsg) {
    swal(
        'Oops...',
        errMsg,
        'error'
    )
};

window.swalSucc = function (msg) {
    swal(
        'Good job!',
        msg,
        'success'
    )

};


window.swalInfo = function (title,msg) {
    swal(
        title,
        msg,
        'info'
    )

};


// a swal that only has title, use this if u want to only display
// one sentence. The default swal has a gap that's awkward
window.swal2 = function(options, cb){
    options.title = '';
    options.html = true;
    // make h3 instead of h2 if exceed a certain # of characters, this also
    // depends on the language (english is shorter than chinese for same length)
    var limit = window.HasChinese(options.text) ? 16 : 27;
    var tag = options.text.length <= limit ? 'h2' : 'h3';
    options.text = "<" + tag + " style='margin-bottom:0;'>" + options.text + "</" + tag + ">";
    return swal(options, cb);
};



// alert telling use he must login/signup to use this function
window.LoginAlert = function(){
    swal({
        title: 'Login required',
        text: 'Click here to <a href="/login" class="pseudo-link login-alert-link">login</a> or <a href="signup" class="pseudo-link login-alert-link">create an account</a>.',
        type: 'warning',
        html: true,
        showConfirmButton: false
    });
};

// return a JSON containing all attributes of an element
$.fn.getAllAttr = function(){
    var attributes = {};
    $.each(this.get(0).attributes, function(i, attrib){
        attributes[attrib.name] = attrib.value;
    });
    return attributes;
};

// return user title
// - if user is working, show "JOB_TITLE, JOB_PLACE"
// - else, show "SCHOOL, STUDENT_TYPE";
window.UserTitle = function(user){
    var isChinese = window.HasChinese(user.education);
    var student_type = user.education;
    if (isChinese) student_type += '生'; // 大学 -> 大学生
    if (_.contains(['在职', 'worker'], user.occupation)) {
        var title = user.job_title;
        if (user.job_place) title += ', ' + user.job_place;
        return title;
    }
    else return user.school + ', ' + student_type;
};

// fake socket
window.FakeSocket = {
    on: function(){},
    emit: function(){}
};

window.Raw = function (data) {
    return CircularJSON.parse(CircularJSON.stringify(data));
}


$( document ).ready(function () {


    // ---------------- .square-select utility ---------------- //

    // if clicked on mask (this only occurs on browser that doesn't have support
    // for "pointer-events: none;", which is rare), simulate clicking on select
    $(document).on('click', '.square-select .mask', function(){
        var $p = $(this).closest('.square-select');
        var $select = $p.find('select');
        var $mask = $p.find('.mask');
        $select.simulate('mousedown');
    });

    // upon selected an option, display the 'data-display' attribute on mask
    $(document).on('change', '.square-select select', function(){
        var $p = $(this).closest('.square-select');
        var $mask = $p.find('.mask');
        var $option = $(this).find("option:selected");
        $mask.text($option.attr('data-display'));
        console.log('mask changed to', $option.attr('data-display'))
    });

    // Select the option of given value, but display the 'data-display' attribute
    // of that option. If no value was given, use the option that has default value
    $.fn.SetVal = function(val){
        if (!this.hasClass('square-select')) return console.error('Wrong jQuery element', this.attr('id'));
        if (!_.isUndefined(val)) val = String(val);
        else val = this.attr('data-default-selected');
        console.log('programmatically select', val);
        // change core html element, and change mask (which triggered by .on('change') handler above)
        this.find('select').val(val).change();
    };

    // Select the option of data-display value
    $.fn.SetVal2 = function(display_val){
        var val = this.find('select option[data-display="' + display_val + '"]').attr('value');
        if (!_.isUndefined(val)) this.SetVal(val);
    };

    // get the value of the selected option
    $.fn.SelectedVal = function(useDisplayedValuedInstead){
        if (!this.hasClass('square-select')) return console.error('Wrong jQuery element');
        // get selected value
        var selected_value = $(this).find('select').val();
        // get selected option
        var $selected_option = $(this).find('select option').filter(function(){
            return $(this).attr('value') == selected_value;
        });
        // make sure it's not an invalid one (used for placeholder)
        if ($selected_option.attr("data-invalid") == "true") return;
        // return value
        if (useDisplayedValuedInstead) return $selected_option.attr('data-display');
        else return $selected_option.attr('value');
    }




    // --------------------------- footer --------------------------- //
    $('#footer-links a').click(function(){
        var a = $(this).parent().find('a').removeClass('active');
        $(this).addClass('active');
    });




    // ------------------------------------- image theater ------------------------------------- //
    $.fn.showTheater = function(img_url){
        var src = this.attr('src') || ExtractBgUrl(this.css('background-image')) || img_url;
        if (!src) return;
        var $p = $('#image_theater');
        $p.find('img').attr('src', src);
        $p.show();
        $('#overlay').show();
    };

    // zoom in an image
    $(document).on('click', '.zoomable-img', function(){
        $(this).showTheater();
    });

    // zoom out an image
    $('#image_theater').click(function(){
        $('#overlay, #image_theater').hide();
    });



    // -------------------------------------- slidable text (when too long) -------------------------------------- //

    // HOW TO USE:
    // 1) add class 'slidable' to text div
    // 2) text's parent div must have "overflow: hidden" to avoid text going out of bound
    // 3) text's parent div must have "width" set
    $(document)
    .on('mouseover', '.slidable', function(){
        $(this).stop(); // stop ongoing animation at current position
        $(this).data('originalMarginLeft', $(this).data('originalMarginLeft') || $(this).css('margin-left')); // store its initial margin-left value, used to restore to its initial position later
        var maxWidth = $(this).parent().width();
        var slidingDistance = $(this)[0].scrollWidth - maxWidth; // scrollWidth will give element's natural width
        var speed = 0.05; // sliding speed
        var time = slidingDistance / speed; // time it takes to slide
        if (slidingDistance > 0){
            $(this).animate(
                { 'margin-left':  -slidingDistance-parseInt($(this).css('text-indent')) },
                { duration: time, easing: 'linear' }
            );
        }
    })
    .on('mouseout', '.slidable', function(){
        $(this).stop(); // stop ongoing animation at current position
        $(this).animate(
            { 'margin-left' :  $(this).data('originalMarginLeft') },
            { duration: 400,  easing: 'swing' }
        );
    });



    // --------------------------------- pop --------------------------------- //

    // keep track of open pop stack
    $(document).data('opened-pop', []);

    // add pop to stack
    function addPop($e){
        $(document).data('opened-pop').push($e);
    }

    // remove pop from stack
    function removePop($e){
        var arr = $(document).data('opened-pop');
        $(document).data('opened-pop', _.reject(arr, function($opened){
            return $opened.is($e);
        }));
    }

    $.fn.showPop = function(option, next){
        var self = this;
        var next = next || function(){};
        var defaults = {
            showOverlay: true,
            fadeIn: false, 
            fadeDuration: { pop: 300, overlay: 500 }
        };
        var option = _.extend({}, defaults, option);
        var cb = function(){
            addPop(self);
            self.trigger('pop-opened');
            next();
        };
        // overlay
        if (option.showOverlay) {
            if (option.fadeIn) $('#overlay').fadeIn(option.fadeDuration.overlay);
            else $('#overlay').show();
        }
        // pop
        if (option.fadeIn) {
            self.fadeIn(option.fadeDuration.pop, cb);
        }
        else {
            self.show(0, cb);
        }
        return this;
    };

    $.fn.hidePop = function(option, next){
        var self = this;
        var next = next || function(){};
        var defaults = {
            hideOverlay: true,
            fadeOut: false, 
            fadeDuration: { pop: 300, overlay: 500 }
        };
        var option = _.extend({}, defaults, option);
        var cb = function(){
            removePop(self);
            self.trigger('pop-closed');
            next();
        };
        // overlay
        if (option.hideOverlay) {
            if (option.fadeOut) $('#overlay').fadeOut(option.fadeDuration.overlay);
            else $('#overlay').hide();
        }
        // pop
        if (option.fadeOut) {
            self.fadeOut(option.fadeDuration.pop, cb);
        }
        else {
            self.hide(0, cb);
        }
        return this;
    };

    // click outside of pop, close last pop
    $(document).on('click', function(e){
        var $pop = _.last($(document).data('opened-pop'));
        if ($pop && $pop.attr('data-close-outside') == 'true' && !$(e.target).is($pop) && !$pop.find(e.target).length) {
            $pop.hidePop();
        }
    });

    // click X, close it
    $(document).on('click', '.pop .close', function(e){
        var $pop = $(this).closest('.pop');
        var customHide = $pop.data('customHide');
        if (customHide) customHide();
        else $pop.hidePop();
    });



    // ------------------- hide footer when input is focused ----------------- //
    // this is such that footer doesn't hide the input, on mobile devices .... //
    if (window.IsMobile()){
        $(document).on('focus click', 'input, textarea', function(){
            $('#footer').hide();
        });
        $(document).on('blur', 'input, textarea', function(){
            $('#footer').fadeIn(1600);
        });
    }




    // ----------------------- m-block: edit type page ---------------------- //

    // m-switch (beautiful iOS-like switch)
    $(document).on('click', '.m-switch', function(){
        $(this).toggleClass('checked');
    });

    // click on m-block, focus on the editable element inside
    $(document).on('click', '.autofocus', function(e){
        // display select list 
        var $select = $(this).find('select');
        if ($select.length){
            if ($(e.target).is('select')) return;
            else { return $select.simulate('mousedown'); }
        }
        // ... or focus textarea 
        var $textarea = $(this).find('textarea');
        if ($textarea.length) return $textarea.focus();
        // ... or focus input 
        var $input = $(this).find('input');
        if ($input.length) return $input.focus();
        // ... or toggle m-switch
        var $switch = $(this).find('.m-switch');
        if ($switch.length){
            if ($(e.target).hasClass('m-switch')) return;
            else return $switch.toggleClass('checked');
        }
    });

    // when press enter on textarea that allows 1 line only, forbid making new line
    $(document).on('keydown', 'textarea.one-line', function(e){
        if (e.which == 13){
            e.preventDefault();
            $(this).blur();
            return false;
        }
    });

    // when click left arrow is on top of page, go to previous page
    // or the page specified in url's "prev" parameter
    $(document).on('click', '.m-title .prev', function(){
        var prev = $.urlParam('prev');
        if (prev) window.location.href = prev;
        else window.history.back();
    });









});