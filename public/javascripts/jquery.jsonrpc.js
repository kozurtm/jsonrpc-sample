(function($) {

  function noop() {}

  $.extend({
    jsonrpc: function(options) {
      var defaultOpts = {};
      ['url', 'method', 'done', 'fail'].forEach(function(name) {
        if (options[name]) {
          defaultOpts[name] = options[name];
        }
      });
      if (typeof defaultOpts.done !== 'function') {
        defaultOpts.done = noop;
      }
      if (typeof defaultOpts.fail !== 'function') {
        defaultOpts.fail = noop;
      }

      var rpcid = 1;

      return function(options) {
        var req = {
          jsonrpc: '2.0',
          id: options.id || rpcid++,
          method: options.method || defaultOpts.method || undefined,
          params: options.params || {}
        };

        var cbdone = typeof options.done === 'function' ? options.done : defaultOpts.done;
        var cbfail = typeof options.fail === 'function' ? options.fail : defaultOpts.fail;

        return $.ajax({
          url: options.url || defaultOpts.url || '/',
          contentType: 'application/json',
          dataType: 'json',
          type: 'POST',
          data: JSON.stringify(req),
          timeout: options.timeout || 0
        })
          .done(function(data) {
            if (data.error) {
              cbdone(data.error, null, data.id);
            } else {
              cbdone(null, data.result, data.id);
            }
          })
          .fail(function() {
            cbfail();
          });
      };
    },

    jsonrpcManager: function(options) {
      var jqxhr;
      var request = $.jsonrpc(options);
      return {
        abort: function() {
          if (jqxhr) jqxhr.abort();
          jqxhr = null;
        },
        send: function(options) {
          if (jqxhr) jqxhr.abort();
          jqxhr = request(options);
        }
      };
    }
  });

})(jQuery);
