// FeedManager Interface
//   pushItemFeed(item)
//   write()

// Todo: Add writeToSlack?
// Todo: Rename Publisher instead of Manager?

var exports = module.exports = {};
var newsletterfeed = [];
var filepath = 'output/newsletterfeed.json';

var fs = require('fs')
, adapter = require('./alexa-adapter.js');

function pushFeedItem(item)
{
    if(item != null)
    {
        newsletterfeed.push(adapter.adapt(
            item.uid + '-newsletter',
            item.updateDate,
            item.titleText,
            item.description,
            item.redirectionUrl
        ));
    }
}

function writeToFile(newsletterfeedjson)
{
    fs.writeFile(filepath, newsletterfeedjson, function (err) {
        if (err) return console.log(err);
        console.log('newsletterfeed.json written');
    });      
}

function compareFeedToFile(newsletterfeedjson)
{
    var obj;
    fs.readFile(filepath, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        if(obj != null && obj.length > 0 && JSON.stringify(obj) == newsletterfeedjson)
        {
            console.log('newsletterfeed.json not written - new data matches existing data')
        }
        else if(obj != null && obj.length > 0)
        {
            writeToFile(newsletterfeedjson);
        }
        else
        {
            console.log('newsletterfeed.json not written - new data null or empty')         
        }
    }); 
}

function readFile(newsletterfeedjson)
{
    fs.stat(filepath, function(err, stat) {
        if(err == null) {
            compareFeedToFile(newsletterfeedjson);
        } else if(err.code == 'ENOENT') {
            // file does not exist
            writeToFile(newsletterfeedjson);
        } else {
            console.log('Error while reading newsletterfeed file: ', err.code);
        }
    });
}

function write()
{
    if(newsletterfeed != null && newsletterfeed.length > 0) 
    {
        var newsletterfeedjson = JSON.stringify(newsletterfeed);  

        readFile(newsletterfeedjson);
    }
    else
    {
        console.log('No newsletter feed file written; newsletterfeed was empty')
    }    
}

exports.push = pushFeedItem;
exports.write = write;