var tank_img = null;
var shadow_img = null;

game_id = getCookie('gameId');
player_id = getCookie('playerId')
my_position = {x:0, y:0, r:0}
my_temp_position = {x:0, y:0, r:0}
players = null
map_content = null
pos_updated = false
last_shoot_time = new Date()

var key_handler = function(){
    $(document).keypress(function(e){
        if (players == null || map_content ==null ) return;

        switch(e.which){
            case 119:
                move(1);
                break;
            case 115:
                move(-1);
                break;
            case 97:
                rotate(-1);
                break;
            case 100:
                rotate(1);
                break;
            case 32:
                shoot();
                break;
        }
    });
}

window.setInterval(function(){
   if (pos_updated){
    pos_updated = false;
    send_move_update();
   }
}, 50);


var move = function(forward){
    dz = -0.1;

    dx = Math.sin(-my_position.r*Math.PI/180)*dz;
    dy = Math.cos(-my_position.r*Math.PI/180)*dz;

    my_temp_position.x = my_position.x+(dx*forward);
    my_temp_position.y = my_position.y+(dy*forward);
    my_temp_position.r = my_position.r

    pos_updated = true;
}

var rotate = function(dir) {
    my_temp_position.x = my_position.x;
    my_temp_position.y = my_position.y;

    my_temp_position.r = my_temp_position.r +dir*5 %360;
    pos_updated = true;
}

var shoot = function() {
    if ( (new Date()).getTime() - last_shoot_time.getTime() > 3000){
        data = {
            "game_id": game_id,
            "shoot_position": {
                "x": my_position.x+0.5,
                "y": my_position.y+0.5,
                "r": my_position.r
            }
        }
        last_shoot_time = new Date();
        send_msg(socket, "SHOOT", data);
    }
}

var canvas_tank_draw_rotate = function(doom_elem, degrees, my_player) {
    ctx = doom_elem.getContext("2d");
    ctx.clearRect(0,0,80, 80);
    ctx.save();
    ctx.translate(40,40);

    ctx.rotate(degrees*Math.PI/180);
    if (my_player) {
        ctx.drawImage(shadow_img, -32, -40);
    }
    ctx.drawImage(tank_img, -32, -40);
    ctx.restore();
}

var move_tank_canvas = function(doom_elem, x, y) {
    x = parseInt(parseFloat(x)*64)-8;
    y = parseInt(parseFloat(y)*64)-8;

    doom_elem.css('left', x).css('top', y);
}

var send_move_update = function() {
    data = {
        "game_id": game_id,
        "position": {
            "x": my_temp_position.x,
            "y": my_temp_position.y,
            "r": my_temp_position.r
        }
    }
    send_msg(socket, "MOVE", data);
}

var join = function(){
    tank_img = document.getElementById("tank_img");
    shadow_img = document.getElementById("tank_shadow_img");

    send_msg(socket, "JOIN_GAME", {"game_id": game_id});
    key_handler();
}

var message_handler = function(data){
    switch(data.type){
        case 'DRAW_MAP':
            draw_map(data.data);
            break;
        case 'DRAW_PLAYERS':
            draw_players(data.data);
            break;
        case 'DRAW_SHOOT':
            draw_shoot(data.data);
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

var draw_shoot = function(data){
    audio_shoot = document.getElementById('shoot_mp3');
    audio_shoot.play();
    setTimeout(function(){
        audio_shoot.pause();
        audio_shoot.currentTime=0.0;
    }, 1800);

    var start = {
        x: parseFloat(data.start_position.x),
        y: parseFloat(data.start_position.y),
        r: parseFloat(data.start_position.r),
    }
    var end = {
        x: parseFloat(data.end_position.x),
        y: parseFloat(data.end_position.y),
        r: parseFloat(data.end_position.r),
    }

    var dx = Math.sin(-start.r*Math.PI/180)*-0.6;
    var dy = Math.cos(-start.r*Math.PI/180)*-0.6;

    var uuid = guid()
    var canvas_data = "<canvas width='10' height='10' class='projectile' id="+uuid+"></canvas>";
    $('.mapPlayers').append(canvas_data);

    var draw_next_move = function(pos_x, pos_y) {
        setTimeout(function(){
            pos_x += dx;
            pos_y += dy;
            $('#'+uuid).css('left', parseInt(pos_x*64)).css('top', parseInt(pos_y*64))
            if ((Math.abs(pos_x-end.x)<0.3 && Math.abs(pos_y-end.y)<0.3) || pos_x<=0 || pos_y<=0 || pos_x>=19 || pos_y>=19) {
                $('#'+uuid).remove();
                draw_explosion(pos_x, pos_y);
            } else {
                draw_next_move(pos_x, pos_y);
            }
        }, 25)
    }
    draw_next_move(start.x, start.y);
}

var draw_explosion = function(x, y){
    audio_explosion = document.getElementById('explode_mp3');
    audio_explosion.play();
    setTimeout(function(){
        audio_explosion.pause();
        audio_explosion.currentTime=0.0;
    }, 3000);

    var uuid = guid()
    canvas_data = "<canvas width='100' height='100' style='left:"+parseInt(x*64-50)+"px;top:"+parseInt(y*64-50)+"px' class='explosion' id="+uuid+"></canvas>";
    $('.mapPlayers').append(canvas_data);

    counter = 0
    var explode_img = document.getElementById("explosion_img");
    var canvas = document.getElementById(uuid);
    var ctx = canvas.getContext("2d");

    var draw_next_frame = function(counter){
        setTimeout(function(){
            x_pos = counter % 16;
            y_pos = parseInt(counter / 4)
            ctx.clearRect(0,0,100, 100);
            ctx.drawImage(explode_img, x_pos*64, y_pos*64, 64, 64, 0, 0, 100, 100);
            counter ++;
            if (counter >=16) {
                $('#'+uuid).remove();
                clearInterval(interval_id);
            } else {
                draw_next_frame(counter);
            }
        }, 100);
    }
    draw_next_frame(0);
}

var draw_players = function(data) {
    if (players == null) players = {};

    for (var i in data){
        player_data = data[i];
        players[player_data.id] = player_data;

        if( !$(".mapPlayers #player_"+player_data.id).length) {
            canvas_data = "<canvas width='80' height='80' class='player_tank' id=player_"+player_data.id+"></canvas>"
            $(".mapPlayers").append(canvas_data);
        }

        move_tank_canvas($(".mapPlayers #player_"+player_data.id), player_data.position.x, player_data.position.y);

        var tank = document.getElementById("player_"+player_data.id);
        canvas_tank_draw_rotate(tank, parseInt(player_data.position.r), player_data.id == player_id);

        if (player_data.id == player_id) {
            my_position = {x: parseFloat(player_data.position.x), y: parseFloat(player_data.position.y), r: parseInt(player_data.position.r) }
        }
    }
}