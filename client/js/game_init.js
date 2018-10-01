var message_handler = function(data){
    switch(data.type){
        case 'NEW_GAME_CREATED':
            handle_new_game(data);
            break;
        case 'GAME_NOT_EXIST':
            handle_game_not_exist();
            break;
        case 'GAME_FOUND':
            handle_game_found(data)
            break;
    }
}

var handle_new_game = function(data){
    game_id = data.data;
    $('#gameId').val(game_id).attr('readonly', 'readonly');
    $('.newGameInfo').html('Stworzono nową grę <br/>'+window.location.hostname+'?gameId='+game_id+'<br/> Aby rozpocząć kliknij Dołącz');
    notify("ok", "Stworzono nową grę");
}

var handle_game_not_exist = function(){
    notify('fail', "Gra o podanym identyfikatorze nie istnieje")
}

var handle_game_found = function(data){
    setCookie('gameId', data.data, 1)
    window.location.href = 'game.html';
}

var create_new_game = function(){
    send_msg(socket, "NEW_GAME", null);
    return false;
}

var join_existing_game = function(game_id){
    send_msg(socket, "FIND_GAME", {"game_id": game_id})
    return false;
}
