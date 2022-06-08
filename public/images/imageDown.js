var fs = require('fs'),
    request = require('request');

const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream("log.txt"),
  stderr: fs.createWriteStream("log.txt"),
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

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
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
//   console.log('done');
// });

async function downloadAllFiles() {
  var rows = await knex('main_coin_list').select('*')

  await knex('main_coin_list').update({
    localImage: ''
  })

  for (var i = 0; i < rows.length; i ++) {
    if (rows[i].coinImage == null || rows[i].coinImage == '') continue
    
    var arr = rows[i].coinImage.split('/')
    var img = ''

    for (var j = 5; j < arr.length - 1; j ++) {
      img += arr[j] + '_'
    }

    img += arr[arr.length - 1].split('?')[0]

    await knex('main_coin_list')
      .where('network', rows[i].network)
      .where('tokenAddress', rows[i].tokenAddress)
      .update({
        localImage: 'http://51.83.184.35:8888/images/' + img
      })
      
    download(rows[i].coinImage, img, function(){
    });

    await delay(1000)
  }

  myLogger.log('Finished')
}

downloadAllFiles()