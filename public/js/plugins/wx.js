// Toast
$('<div id="toast" style="display: none;"> <div class="weui-mask_transparent"></div> <div class="weui-toast"> <i class="weui-icon-success-no-circle weui-icon_toast"></i> <p class="weui-toast__content">已完成</p> </div> </div>').appendTo('body');
var Toast = {
    show: function(text, cb){
        var $toast = $('#toast');
        if ($toast.css('display') != 'none') return;
        $toast.find('.weui-toast__content').text(text);
        $toast.fadeIn(100);
        setTimeout(function () {
            $toast.fadeOut(100);
            cb && cb();
        }, 2000);
    }
};

// Loading
$('<div id="loadingToast" style="display:none;"> <div class="weui-mask_transparent"></div> <div class="weui-toast"> <i class="weui-loading weui-icon_toast"></i> <p class="weui-toast__content">数据加载中</p> </div> </div>').appendTo('body');
var Loading = {
    show: function(text){
        var $toast = $('#loadingToast');
        if ($toast.css('display') != 'none') return;
        $toast.find('.weui-toast__content').text(text);
        $toast.fadeIn(100);
    },
    hide: function(){
        $('#loadingToast').fadeOut(100);
    }
};

// do shit on the next process tick
var NextTick = function(fn){
    setTimeout(fn, 0);
};