function notify(type, message) {
    switch(type){
        case 'ok':
            $('.alert').removeClass('alert-danger').addClass('alert-success')
            break;
        default:
            $('.alert').removeClass('alert-success').addClass('alert-danger')
    }
    $('.alert').html(message).fadeOut(0).show().fadeIn(1000).delay( 3000 ).fadeOut(1000);
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function send_msg(socket, type, data){
    var msg = {
        type: type,
        data: data,
        id:   $.cookie('playerId'),
      };

      socket.send(JSON.stringify(msg))
}

var socket = new WebSocket("ws://localhost:8888/tanks");

socket.onmessage = function (event) {
    console.log(event.data);
    data = JSON.parse(event.data);
    if (data.id) {
        setCookie('playerId', data.id, 1)
    }

    message_handler(data);
}

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  } 