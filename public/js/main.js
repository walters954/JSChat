var nickname = 'guest';
var socket = io('http://localhost:8082');


$(function() {
  socket.on('connect', function() {
    if (!(uuid = localStorage.getItem('uuid'))) {
      var randomlyGeneratedUID = Math.random().toString(36).substring(3, 16) + +new Date;
      localStorage.setItem('uuid', randomlyGeneratedUID);
    }

    socket.emit('register', uuid);
  });

});

$('form').submit(function() {
  if (/\S/.test($('#m').val()))
    socket.emit('message', $('#m').val());
  $('#m').val('');
  return false;
});

// receive msg
socket.on('message', function(msg) {
  $('#messages').append($('<li>').text(msg));
});
socket.on('nickname', function(msg) {
  nickname = msg;
  $('#messages').append($('<li>').text(msg + ' just joined!'));
});
socket.on('clear', function() {
  $('#messages').html("");
});
socket.on('channel', function(msg) {
  $('#messages').append($('<li>').text(msg));
});
socket.on('list', function(msg) {
  $('#messages').append($('<li>').text(msg));
});

/*Warren */
jQuery(document).ready(function() {
    jQuery('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');

        // Show/Hide Tabs
        jQuery('.tabs ' + currentAttrValue).show().siblings().hide();

        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');

        e.preventDefault();
    });
});
