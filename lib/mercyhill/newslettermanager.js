// Directs parsing and output of mercy hill newsletter content

var exports = module.exports = {};

var htmlToText = require('html-to-text')
, newsletterparser = require('./newsletterparser.js')
, config = require('./config.js');

function pushFeeds(item)
{
    config.feedManagers.forEach(function(entry) {
        entry.push(item);
    }); 
}

function writeFiles()
{
    config.feedManagers.forEach(function(entry) {
        entry.write();
    });
}

function processItem(item)
{
    item.rawPlainText = htmlToText.fromString(item.rawHtml);

    var match = newsletterparser.buildServeTeam(item);

    newsletterparser.buildFooter(item);

    newsletterparser.filterDescription(item, match.index);

    newsletterparser.buildDescription(item);

    newsletterparser.buildUid(item);      

    pushFeeds(item);
}

function readItem(results, item)
{
    results.push({
        updateDate: item.pubdate,
        titleText: item.title,
        redirectionUrl: config.redirectionUrl,
        rawHtml: item.description,
        uid: item.guid
    }); 
}

exports.processItem = processItem;
exports.readItem = readItem;
exports.writeFiles = writeFiles;
exports.config = config;