/**
 * Created by hesk on 16年11月1日.
 */
var fs = require('fs'),
  im = require('./imagemagick');

var path = __dirname + '/sample-images/blue-bottle-coffee.jpg';
var target_dst_path = __dirname + '/sample-images/';
var imdata = fs.readFileSync(path, 'binary');
var timeStarted = new Date;


im.resize({
  srcData: imdata,
  width: 256,
  resize_operation: 5
}, function (err, stdout, stderr) {
  if (err) return console.error(err.stack || err);
  fs.writeFileSync(target_dst_path + 'test-resize-io.jpg', stdout, 'binary');
  console.log('real time taken for convert (with buffers): ' +
    ((new Date) - timeStarted) + ' ms');

  console.log('resize(...) wrote "test-resized.jpg" (' + stdout.length + ' Bytes)');
});

