/* self made */
// format a chat message / post to display on-screen

var isMessageEmpty = function (message) {
    return (!(/([^\s])/.test (message)));
};


var beautifyAll = function (message, options) {
    var defaults = {
        youtube: false,
        emoji: true,
        emoji_size: 16
    };
    options = _.extend({}, defaults, options);
    if (!message) return '';
    message = beautify.trailingSpaces (message);
    message = beautify.htmlEscape (message);
    message = beautify.imagify (message);
    message = beautify.audiofy (message);
    message = beautify.linkify (message);
    message = beautify.spaces (message);
    // message = beautify.bold (message); // mutiplication signs will bug
    message = beautify.italic (message);
    message = beautify.newlines (message);
    message = beautify.youtube (message, options);
    message = beautify.emoji (message, options);
    message = beautify.safe (message);
    return message;
};

var beautify = {

    htmlEscape: function (entry) {
        return entry.replace (/&/g, '&amp;')
            .replace (/</g, '&lt;')
            .replace (/>/g, '&gt;')
            .replace (/"/g, '&quot;')
            .replace (/'/g, '&apos;');
    },

    unescape: function(message) {
        return message.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'"); // i added this because EJS escape apostroph using 39, instead of 039. its currently used to unescape room_name in room.js
    },

    // embed youtube video if message contains a youtube link
    youtube: function (message, options) {
        var r1 = /youtube.com\/watch.*[?&]v=(.{11})/i;
        var r2 = /youtu.be\/(.{11})/i;
        var isYoutube = r1.test(message) || r2.test(message);
        if (isYoutube && options && !_.isEmpty(options.youtube)) {
            var width = options.youtube[0];
            var height = options.youtube[1];
            var videoId = RegExp.$1;
            var message = message + '<br/>';
            return (message + '<iframe width="' + width.toString() + '"'
                    + 'height="' + height.toString() + '" src="//www.youtube.com/embed/'
                    + videoId
                    + '" frameborder="0" style="margin-top: 5px;" allowfullscreen></iframe>');
        }
        return message;
    },

    // use *bold*
    bold: function (message) {
        return message.replace (/\*((\w|-)+)\*/g, '<b>$1</b>');
    },

    // use _italic_ (not used right now, it fucks with linkify on certain urls)
    italic: function (message) {
        // return message.replace (/_((\w|-)+)_/g, '<i>$1</i>');
        return message.replace (/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');
        // return message;
    },

    // replace consecutive spaces with no-break spaces
    spaces: function (message) {
        return message.replace (/( {2,})([^\n]|$)/g, function (spaces) {
            // replace with no-break spaces
            spaces = spaces.replace (/ /g, '&nbsp;');
            return spaces;
        });
    },

    // removes trailing spaces
    trailingSpaces: function (message) {
        return message.replace (/\s+$/, '');
    },

    // removes beginning and trailing spaces, and replace any consecutive space in the middle with one
    // hence remove ALL useless spaces
    trimSpaces: function (message) {
        return $.trim(message.replace(/\s+/g, ' '));
    },

    // replace \n by <br />
    newlines: function (message) {
        return message.replace (/\n/g, '<br />');
    },

    // convert text to html (basic parts of beautifyAll)
    html: function(message){
        message = beautify.htmlEscape (message);
        message = beautify.spaces (message);
        message = beautify.newlines (message);
        return message;
    },

    // replace all <br> by \n, and &nbsp; by white space
    textareaLines: function(message){
        return beautify.unescape(message.replace(/<br\s*[\/]?>/gi, "\n").replace(/&nbsp;/gi, " "));
    },

    // Capitalize the first letter of string
    capitalize: function(message){
        return message.charAt(0).toUpperCase() + message.slice(1);
    },

    // +1 on a JQuery'ed DOM element's text
    add1: function($div){
        $div.text( parseInt($div.text() || 0) + 1 );
    },

    // +n on a JQuery'ed DOM element's text
    addN: function($div, n){
        $div.text( parseInt($div.text() || 0) + n );
    },

    // -1 on a JQuery'ed DOM element's text, if NoBelowZero is true, it cant go below 0
    minus1: function($div, NoBelowZero){
        $div.text( parseInt($div.text() || 0) - 1 );
        if (NoBelowZero && parseInt($div.text()) < 0) $div.text(0);
    },

    // get random element from an array. This will pop last element from array, and when the array is empty, it
    // will shuffle and array, and start poping again. Hence generally you'll not see 2 same element twice in a row
    // how to use:
    // 1) Initiate object: var random = new beautify.Random(array);
    // 2) Whenever you call random(), it will return a random element from the array
    Random: function(arr) {
        var shuffled_array = _.shuffle(arr);
        return function(){
            if (_.isEmpty(shuffled_array)){
                shuffled_array = _.shuffle(arr);
            }
            return shuffled_array.pop();
        };
    },

    emotions: function(){
        return ['LOL!', 'Srsly.', 'ZOMFG!', 'Whoa!', 'Hot!', 'Sweet!', 'Really!',
        'OH! SNAP!', 'w00t!', 'Boioioioing.', 'Cow level pl0x.', 'SHOOP!', 'YARR!', 'SAUCY!',
        'OMGz.', 'R0FL!', 'Wat!', 'lel.', 'shizznizz!', 'Oooh, damn.', 'Hehe.'].slice(0);
    },

    // detect link in chat & posts and make them actual url
    linkify: function(message){
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        // if it's an message is an <img> or <a href> tag, don't do anything
        // !TODO: this will stop any legitimate emoji text from turning into emojis
        if (/<img (.*?)>/g.test(message) || /<a (.*?)<\/a>/g.test(message) || /<audio (.*?)<\/audio>/g.test(message)) return message;

        // if it's a link of peeranswer, open in the same tab; if it's another site, open in another tab
        var newTab = 'target="_blank"';
        if (message.indexOf(window.document.domain.replace('www.','')) > -1){ // this gives the current page's url, ex: peeranswer.com
            newTab = '';
        }

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|()!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = message.replace(replacePattern1, _.template('<a href="$1" class="pseudo-link_blue" <%=newTab%>>$1</a>')({ newTab: newTab }));

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, _.template('$1<a href="http://$2" class="pseudo-link_blue" <%=newTab%>>$2</a>')({ newTab: newTab }));

        return replacedText;
    },

    // upon incoming message, determine whether or not to automatically scroll down a chat window to the bottom
    scrollChat: function($messageContainer, messageClass, senderID, myID){
        // When user scroll up in chat box, new incoming message wont bring it down.
        // Automatic scrolldown is only triggered if one of 3 condition is satisfied:
        // 1) if i'm already at the bottom of chat (let's give it a tolerance of 30px, apparently on some users it's bugged)
        // 2) if message senderID is me, and 3) if messages has not filled up
        // the chat yet and therefore scrollbar is still not visible (this condition is more of a bug fix)
        // To simply scroll down the chat, just dont put the parameters 'messageClass' or 'senderID'

        if (!messageClass || !senderID
            || Math.abs(( $messageContainer.scrollTop()+$messageContainer.find(messageClass).last().outerHeight(true) ) - ( $messageContainer[0].scrollHeight-$messageContainer.outerHeight(true) )) < 30
            || senderID == myID
            || $messageContainer[0].scrollHeight - $messageContainer.find(messageClass).last().outerHeight(true) <= $messageContainer.outerHeight(true) ){
            $messageContainer[0].scrollTop = $messageContainer[0].scrollHeight;
        }

    },

    // display drawing in post
    imagify: function(text){
        // we want to render image between [img][/img], every display attempt is a
        // GET request. So when it hits our own server, we want to make sure it's
        // indeed a valid image url before making the request. Only the followings
        // are considered valid:
        // 1. if url goes to other site, we send request without other restriction
        // 2. if url starts with a forward slash, it will hit our own server,
        //    so we only send request if it's ending with .png, followed by a query
        //    string (ex: /drawing/123.png?size=23x23)
        // 3. if url starts with any variable of peeranswer.com, do the same as 2,
        //    aka, only allow request ending with .png, followed by a query string
        var newText = text.replace(/\[img\](.*?)\[\/img\]/g, function(match, url){
            url = $.trim(url);
            var site = window.location.hostname.replace('www.','') + (location.port ? ':' + location.port : '');
            // case 1
            var isURL = /^((https?|ftp):)?\/\/.*/i; // this must be tested, or else an url without a forward slash (ex "a.png") will make
            // browser send a GET request by appending this url to the current page path
            var isOurSite = url.replace(new RegExp("^(https?)?:?(\\/\\/)?(www.)?","i"), '').indexOf(site) == 0;
            console.log(url.replace(new RegExp("^(https?)?:?(\\/\\/)?(www.)?","i"), ''))
            // case 2
            var root = /^\/(.*).*(jpeg|jpg|png|gif|bmp)(?:\?([^#]*))?(?:#(.*))?/i;
            // case 3
            var local = new RegExp("^(https?)?:?(\\/\\/)?(www.)?(" + site + ").*(jpeg|jpg|png|gif|bmp)(?:\\?([^#]*))?(?:#(.*))?","i");
            console.log('is our site:', isOurSite, 'valid root image:', root.test(url), 'valid local img:', local.test(url), 'url:', url)
            if ((isURL.test(url) && !isOurSite) || root.test(url) || local.test(url)) {
                url = url.replace('http://', '//'); // use relative URL, so console won't yell about non-https content
                return ('<img class="PostImage" src="' + url + '">');
            }
            else return match;
        });
        return newText;
    },

    // display audios
    audiofy: function(text){
        var newText = text.replace(/\[audio\](.*?)\[\/audio\]/g, function(match, url){
            url = $.trim(url);
            var externalImage = /^((https?|ftp):)?\/\/.*/i;
            var localImage = /^\/(.*).*(wav|wma|mp3|mpeg|ra|ram|rm|mid|ogg)/i;
            if (externalImage.test(url) || localImage.test(url)) {
                return ('<audio class="PostAudio" preload="metadata" src="' + url + '" controls></audio>');
            }
            else return match;
        });
        return newText;
    },

    // create emojis
    emoji: function (message, options) {
        if (window._replaceEmoticons && options && options.emoji) {
            message = window._replaceEmoticons(message, options.emoji_size);
            return message;
        }
        return message;
    },

    // create one sticker
    stickerize: function (sticker_url) {
        return _.template(
            "<div class='sticker center-contained' style='background-image:url(<%-sticker_url%>)'></div>"
        )({ sticker_url : sticker_url });
    },

    // guard against bbox spam
    safe: function(message) {
        message = message.replace(/bbox\[(.*?)\](.*?)/g, '');
        return message;
    },

    // same beautifyAll, but only render text
    text: function(message, opt){
        opt = opt || {};
        var original = message;
        if (opt.maxChar) message = message.substr(0, opt.maxChar);
        if (original.length > message.length) message = message + '...';
        message = beautify.trailingSpaces (message);
        message = beautify.htmlEscape (message);
        message = beautify.spaces (message);
        message = beautify.newlines (message);
        return message;
    },

    // round number to a certain decimal
    round: function(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    },

    // add a query parameter to url, if value is empty, remove that parameter
    updateUrlQuery: function(key, value, url) {
        if (!url) url = window.location.href;
        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
            hash;

        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null)
                return url.replace(re, '$1' + key + "=" + value + '$2$3');
            else {
                hash = url.split('#');
                url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
        }
        else {
            if (typeof value !== 'undefined' && value !== null) {
                var separator = url.indexOf('?') !== -1 ? '&' : '?';
                hash = url.split('#');
                url = hash[0] + separator + key + '=' + value;
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
            else return url;
        }
    },

    // remove value from comma separated values string, Ex: removeString("1,2,3", "2") will output "1,3"
    removeString: function(list, value) {
        var separator = ",";
        list = _.compact(list.split(separator));
        list = _.without(list, value);
        return list.join(separator);
    },

    // add value from comma separated values string. Ex: addString("1,2,3", "4") outputs "1,2,3,4"
    addString: function(list, value){
        var separator = ",";
        if (!list) list = '';
        if (!_.isArray(value)) value = [value];
        list = list.split(separator);
        list = _.union(list, value);
        list = _.compact(list);
        return list.join(separator);
    },

    // show how long ago a timestamp was
    timeAgo: function(date, ref_date, date_formats, time_units) {
      //Date Formats must be be ordered smallest -> largest and must end in a format with ceiling of null
      date_formats = date_formats || {
        past: [
          { ceiling: 60, text: "$seconds secs" },
          { ceiling: 3600, text: "$minutes min" },
          { ceiling: 86400, text: "$hours hours" },
          { ceiling: 2629744, text: "$days days" },
          { ceiling: 31556926, text: "$months months" },
          { ceiling: null, text: "$years years" }
        ],
        future: [
          { ceiling: 60, text: "in $seconds seconds" },
          { ceiling: 3600, text: "in $minutes minutes" },
          { ceiling: 86400, text: "in $hours hours" },
          { ceiling: 2629744, text: "in $days days" },
          { ceiling: 31556926, text: "in $months months" },
          { ceiling: null, text: "in $years years" }
        ]
      };
      //Time units must be be ordered largest -> smallest
      time_units = time_units || [
        [31556926, 'years'],
        [2629744, 'months'],
        [86400, 'days'],
        [3600, 'hours'],
        [60, 'minutes'],
        [1, 'seconds']
      ];
      date = new Date(date); ref_date = ref_date ? new Date(ref_date) : new Date(); var seconds_difference = (ref_date - date) / 1000; var tense = 'past'; if (seconds_difference < 0) { tense = 'future'; seconds_difference = 0-seconds_difference; } function get_format() { for (var i=0; i<date_formats[tense].length; i++) { if (date_formats[tense][i].ceiling == null || seconds_difference <= date_formats[tense][i].ceiling) { return date_formats[tense][i]; } } return null; } function get_time_breakdown() { var seconds = seconds_difference; var breakdown = {}; for(var i=0; i<time_units.length; i++) { var occurences_of_unit = Math.floor(seconds / time_units[i][0]); seconds = seconds - (time_units[i][0] * occurences_of_unit); breakdown[time_units[i][1]] = occurences_of_unit; } return breakdown; } function render_date(date_format) { var breakdown = get_time_breakdown(); var time_ago_text = date_format.text.replace(/\$(seconds|minutes|hours|days|months|years)/g, function() { return breakdown[arguments[1]]; }); return depluralize_time_ago_text(time_ago_text, breakdown); } function depluralize_time_ago_text(time_ago_text, breakdown) { for(var i in breakdown) { if (breakdown[i] == 1) { var regexp = new RegExp("\\b"+i+"\\b"); time_ago_text = time_ago_text.replace(regexp, function() { return arguments[0].replace(/s\b/g, ''); }); } } return time_ago_text; } return render_date(get_format());
    },

    // same as timeAgo, but translates it to Chinese if necessary
    timeAgo2: function(date, isChinese){
        var eng = beautify.timeAgo(date);
        if (!isChinese) return eng;
        var map = {
            m: '分钟', h: '小时', d: '天', M: '个月', y: '年',
            min: '分钟', minute: '分钟', hour: '小时', day: '天', month: '个月', year: '年',
            mins: '分钟', minutes: '分钟', hours: '小时', days: '天', months: '个月', years: '年',
        };
        var num = parseInt(eng) + '';
        var unit = eng.replace(' ', '').replace(num, '');
        var chinese = num + map[unit];
        return chinese;
    },

    // change image's relative url to absolute url
    absUrl: function(url){
        if (url.indexOf('/') == 0) return SITE_URL + url;
        else return url
    },

    // convert time from ISO format to a more readible format to be displayed
    convertTime: function (date){
        var time_now = new Date();
        var time_msg = new Date(date);
        var date_msg = time_msg.getDate(); // day of the month (from 1-31)
        var day_msg = time_msg.getDay(); // day of the week (from 0-6)
        var month_msg = time_msg.getMonth();
        var year_msg = time_msg.getFullYear();
        var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];
        var hours_msg = time_msg.getHours();
        var minutes_msg = time_msg.getMinutes();
        var ampm_msg = (hours_msg >= 12) ? "PM" : "AM";
        hours_msg = (hours_msg >= 13) ? hours_msg-12 : (hours_msg == 0 ? 12 : hours_msg);

        // same day
        if (time_now.getDate() == date_msg && time_now.getMonth() == month_msg && time_now.getFullYear() == year_msg){
            minutes_msg = minutes_msg.toString();
            minutes_msg = (minutes_msg.length == 1) ? ('0' + minutes_msg) : minutes_msg;
            return (hours_msg + ':' + minutes_msg + ' ' + ampm_msg);
        // within 6 days
        } else if ((time_now.getTime()-time_msg.getTime()) < 518400000){
            return (dayNames[day_msg]);
        // same year
        } else if (time_now.getFullYear() == year_msg) {
            return (monthNames[month_msg] + ' ' + date_msg);
        // past year
        } else {
            return (date_msg + '/' + (parseInt(month_msg) + 1).toString() + '/' + year_msg);
        }
    },

    // display a date separated by dash. If detailled is true, add hour and minute as well
    date: function(date, detailled){
        var join = '-';
        var d = date ? new Date(date) : new Date();
        var basic = d.getFullYear() + join + (d.getMonth() + 1) + join + d.getDate();
        // ex: 2012-02-19
        if (!detailled) return basic;
        // ex: 2012-02-19 21:06
        else return basic + ' ' + d.getHours() + ':' + d.getMinutes();
    }


};
