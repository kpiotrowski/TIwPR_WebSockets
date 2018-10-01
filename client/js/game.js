
game_id = getCookie('gameId');
map_content = null


var join = function(){
    send_msg(socket, "JOIN_GAME", {"game_id": game_id});
}

var message_handler = function(data){
    switch(data.type){
        case 'DRAW_MAP':
            draw_map(data.data);
            break;
        case 'DRAW_PlAYERS':
            draw_players(data.data);
            break;
    }
}

var draw_map = function(data){
    var map=document.getElementById("mapCanvas");
    $('#mapCanvas').attr('width', 64*data.width).attr('height', 64*data.height);
    ctx = map.getContext("2d");

    map_content = data.content

    var grass_img = document.getElementById("grass_img");
    var wall_img = document.getElementById("wall_img");
    for (var pos_y=0; pos_y<data.height; pos_y++) {
        for(var pos_x=0; pos_x<data.width; pos_x++){

            type = parseInt(data.content[pos_y.toString()][pos_x.toString()])
            if (type == 0){
                ctx.drawImage(grass_img, 0, 0, 64, 64, pos_x*64, pos_y*64, 64, 64)
            } else {
                ctx.drawImage(wall_img, 0, 0, 64, 64, pos_x*64, pos_y*64, 64, 64)
            }
        }
    }
}

var draw_players = function(data) {
    
}