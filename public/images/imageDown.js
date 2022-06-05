var fs = require('fs'),
    request = require('request');

const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream("log.txt"),
  stderr: fs.createWriteStream("log.txt"),
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        port : 3306,
        user : 'admin_root',
        password : 'bOPTDZXP8Xvdf9I1',
        database : 'admin_ethereum_api'
    //   user : 'root',
    //   password : '',
    //   database : 'ethereum_api'
    }
})

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
//   console.log('done');
// });

async function downloadAllFiles() {
  var rows = await knex('main_coin_list').select('*')

  for (var i = 0; i < rows.length; i ++) {
    var img = rows[i].coinImage

    await knex('main_coin_list')
      .where('network', rows[i].network)
      .where('tokenAddress', rows[i].tokenAddress)
      .update({
        geckoImage: img
      })
    // var arr = rows[0].coinImage.split('/')

    // myLogger.log(arr)
  }
}

downloadAllFiles()