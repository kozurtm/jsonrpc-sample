
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(res.rpc);
  res.render('index', { title: 'Express' });
};

/**
 * RPC
 */
var jsonrpc = require('../jsonrpc');
jsonrpc.addMethods({
  hello: function(rpc, callback) {
    var params = rpc.params || {};
    if (typeof params.message === 'string' && params.message !== '') {
      callback(null, { message: params.message.toUpperCase() });
    } else {
      callback(jsonrpc.Errno.INVALID_PARAMS);
    }
  }
});

exports.rpc = function(req, res) {
  jsonrpc(req, res);
};
