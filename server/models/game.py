import uuid

from server.models.map import Map
from server.models.player import create_new_player


class Game:

    def __init__(self, game_id):
        self.id = game_id
        self.players = {}
        self.map = Map()

    def add_player(self, player_id, socket):
        if player_id in self.players:
            self.players[player_id].socket = socket
            return self.players[player_id]

        new_player = create_new_player(player_id, socket, len(self.players)+1)
        print(f"Created new player {new_player.name}: {new_player.id}")
        self.players[player_id] = new_player
        return self.players[player_id]

    def get_map(self):
        return self.map.to_dict()


def create_new_game() -> Game:
    game_id = str(uuid.uuid4())
    game = Game(game_id=game_id)
    return game
