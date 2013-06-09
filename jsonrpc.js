var Errno = {
  PARSE_ERROR:      -32700,
  INVALID_REQUEST:  -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS:   -32602,
  INTERNAL_ERROR:   -32603,
  SERVER_ERROR:     -32000
};

var Errmsg = {
  '-32700': 'Parse error',
  '-32600': 'Invalid Request',
  '-32601': 'Method not found',
  '-32602': 'Invalid params',
  '-32603': 'Internal error',
  '-32000': 'Server error'
};

function namespace(ns) {
  if (typeof ns === 'undefined') {
    ns = '';
  }
  return ns.toString();
}

function makeErrorObject(params) {
  var id, code, message;

  if (typeof params === 'number') {
    params = { code: params };
  }
  id = typeof params.id === 'undefined' ? null : params.id;
  code = (params.code >= -32700 && params.code <= -32000) ? params.code : Errno.INTERNAL_ERROR;
  message = params.message || Errmsg[code] || 'Unknown error';
  
  return {
    jsonrpc: '2.0',
    id: id,
    error: {
      code: code,
      message: message,
      data: params.data
    }
  };
}

//
//
//
  
var NSMethod = {};
var JSONRPC = function(req, res, ns) {
  var nsm = NSMethod[namespace(ns)];

  var rpc = req.body;
  if (typeof rpc.id === 'undefined') {
    rpc.id = null;
  }

  // check version
  var version = rpc.jsonrpc;
  if (!(typeof version === 'string' && version === '2.0')) {
    res.json(makeErrorObject({
      id: rpc.id,
      code: Errno.INVALID_REQUEST
    }));
    return;
  }

  // check method
  var method = rpc.method;
  if (!(nsm && nsm[method])) {
    res.json(makeErrorObject({
      id: rpc.id,
      code: Errno.METHOD_NOT_FOUND
    }));
    return;
  }

  // exec method
  nsm[method](rpc, function(err, result) {
    if (err) {
      if (typeof err === 'number') {
        err = { code: err };
      }
      err.id = rpc.id;
      res.json(makeErrorObject(err));
    } else if (rpc.id) {
      res.json({
        jsonrpc: '2.0',
        id: rpc.id,
        result: result
      });
    }
  });
};

JSONRPC.addMethods = function(methods, ns) {
  ns = namespace(ns);
  var nsm = NSMethod[ns] || (NSMethod[ns] = {});
  Object.keys(methods).forEach(function(name) {
    nsm[name] = methods[name];
  });
};

JSONRPC.Errno = Errno;

module.exports = JSONRPC;
