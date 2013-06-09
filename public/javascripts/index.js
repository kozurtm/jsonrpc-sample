$(document).ready(function() {
  var $response = $('#response');
  var $message  = $('#message');

  var $rpc = $.jsonrpcManager({
    url: '/rpc',
    method: 'hello',
    done: function(err, result, id) {
      if (err) {
        $response.prepend($('<div class="error">').text(id + ':' + JSON.stringify(err)));
      } else {
        $response.prepend($('<div>').text(id + ':' + JSON.stringify(result)));
      }
    },
    fail: function() {
      $response.prepend($('<div class="error">fail</div>'));
    }
  });

  $('#send').on(
    'click',
    function(event) {
      $rpc.send({
        params: {
          message: $message.val()
        }
      });
    });
  
/*  var id = 0;
  $('#send').on(
    'click',
    function(event) {
      console.log(event);
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/rpc',
        contentType: 'application/json',
        data: JSON.stringify({
          jsonrpc: '2.0',
          id: '' + (id++),
          method: 'hello',
          params: {
            message: $('#message').val()
          }
        })
      })
      .done(function(res) {
        $('#response').prepend($('<div>').text(JSON.stringify(res)));
      })
      .fail(function() {
        console.log(error);
      });
    });
*/
});
