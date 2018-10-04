import json

from server.models.game import create_new_game
from .models.payload import Payload, GameDataPayload

games = {}


def handle_message(payload : Payload, client):
    if payload.type == 'NEW_GAME':
        handle_new_game(payload, client)
    elif payload.type == 'FIND_GAME':
        handle_find_game(payload, client)
    elif payload.type == 'JOIN_GAME':
        handle_join_game(payload, client)
    elif payload.type == 'MOVE':
        handle_move(payload, client)


def handle_new_game(payload, client):
    game = create_new_game()
    games[game.id] = game
    response = Payload(type="NEW_GAME_CREATED", id=payload.id, data=game.id)
    response.send(client)


def handle_find_game(payload, client):
    data = GameDataPayload(**payload.data)

    if data.game_id not in games:
        Payload(type="GAME_NOT_EXIST", id=payload.id).send(client)
    else:
        Payload(type="GAME_FOUND", id=payload.id, data=data.game_id).send(client)


def handle_join_game(payload, client):
    data = GameDataPayload(**payload.data)

    game = games.get(data.game_id)
    if not game:
        return

    game.add_player(payload.id, client)
    Payload(type="DRAW_MAP", id=payload.id, data=game.get_map()).send(client)
    game.send_positions_to_players()


def handle_move(payload, client):
    data = GameDataPayload(**payload.data)

    game = games.get(data.game_id)
    if not game:
        return

    player = game.players.get(payload.id)
    if not player:
        return

    if game.position_allowed(data.position.x, data.position.y, player.id):
        player.position.x = data.position.x
        player.position.y = data.position.y
        player.position.r = data.position.r
        game.send_positions_to_players(payload.id)



