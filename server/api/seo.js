// ============= Indexing pages on Google via Sitemap and RSS Feed =============

var Question = require('../../models/question.js');
var _ = require('underscore');


// put the first few words in the url
function slugify(text){
    var limit = 80;
    text = text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text

    // Take the 80 first characters
    var trimmed = text.substring(0, limit);

    var arr = trimmed.split('-');
    // if there's just one word, we trim it to the maximum length
    if (arr.length == 1){
        arr[0] = arr[0].substring(0,limit);
    }
    // If original version surpassed maximum length,
    // we remove the last word because it might been cut
    else if (text.length >= limit) {
        arr = arr.slice(0, -1);
    }
    return arr.join('-');
}



module.exports = function(app){

    // use sitemap to index the list of subject page
    app.get('/sitemap', function(req, res){
        console.log('fetching sitemap ...');

        var links = '';
        G_subject_list.forEach(function(subject){
            links += _.template(
                '<url>' +
                    "<loc>https://www.peeranswer.com/study/<%= subject %></loc>" +
                    "<changefreq>monthly</changefreq>" +
                    "<priority>1.00</priority>" +
                '</url>'
            )({ subject: subject.replace(' ', '%20') });
        });

        var xml =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' +
            links +
        '</urlset>';
        res.end(xml);
    });


    // every 2 hours, tell google to GET /rss to index the latest 5k question
    app.get('/rss', function(req, res){
        var startTime = new Date();

        Question.fetchSEO(null, function(data){
            if (_.isEmpty(data)) { res.end(); return; }
            var links = '';
            _.each(data, function(question){
                links += _.template(
                    '<item>' +
                        "<link>https://www.peeranswer.com/question/<%= question._id %></link>" +
                        "<pubDate><%= lastmod %></pubDate>" +
                    '</item>'
                )({
                    question: question,
                    subject: question.subject.replace(' ', '%20'),
                    lastmod: question.last_bump.toUTCString() // RSS date must be in RFC-822 format
                });
            });
            var xml =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">' +
                '<channel>' +
                    '<title>PeerAnswer</title>' +
                    '<link>https://www.peeranswer.com</link>' +
                    '<description>PeerAnswer latest questions</description>' +
                    links +
                '</channel> ' +
            '</rss>'
            res.end(xml);
            console.log('fetching RSS took ' + (new Date() - startTime) + 'ms');
        });
    });


}

