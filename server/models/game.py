import uuid

from server.models.map import Map
from server.models.payload import Payload
from server.models.player import create_new_player, Position
from random import randint
import math


class Game:

    def __init__(self, game_id):
        self.id = game_id
        self.players = {}
        self.map = Map()

    def add_player(self, player_id, socket):
        if player_id in self.players:
            self.players[player_id].socket = socket
            return self.players[player_id]

        new_player = create_new_player(player_id, socket, len(self.players) + 1, self.find_free_place())
        print(f"Created new player {new_player.name}: {new_player.id}")
        self.players[player_id] = new_player
        return self.players[player_id]

    def get_map(self):
        return self.map.to_dict()

    def send_positions_to_players(self, player_id=None):

        if player_id is not None:
            data = [self.players[player_id].generate_info()]
        else:
            data = [self.players[player].generate_info() for player in self.players]

        for player in self.players:
            Payload(type="DRAW_PLAYERS", id=player, data=data).send(self.players[player].socket)

    def find_free_place(self, player_id=None) -> Position:
        for _ in range(100):
            x = randint(1, self.map.width - 2)
            y = randint(1, self.map.height - 2)
            if self.position_allowed(x, y, player_id):
                return Position(x=x, y=y, r=0)

    def position_allowed(self, x, y, player_id=None):

        def point_allowed(p_x, p_y):
            if p_x < 0 or p_y < 0 or p_x > self.map.width-1 or p_y > self.map.height-1:
                return False, None

            if self.map.content[str(int(p_y))][str(int(p_x))] != "0":
                return False, None

            if player_id is None:
                return True, None

            for idx in self.players:
                player = self.players[idx]
                if player.id != player_id:
                    if (p_x in [math.ceil(player.position.x), math.floor(player.position.x)] and
                            p_y in [math.ceil(player.position.y), math.floor(player.position.y)]):
                        return False, player.id

            return True, None

        floor_x, ceil_x = math.floor(x), math.ceil(x)
        floor_y, ceil_y = math.floor(y), math.ceil(y)

        x_ar = [floor_x, ceil_x] if x - floor_x > 0.15 else [floor_x]
        y_ar = [floor_y, ceil_y] if y - floor_y > 0.15 else [floor_y]

        for xx in x_ar:
            for yy in y_ar:
                allowed, player_hit = point_allowed(xx, yy)
                if not allowed:
                    return False, player_hit

        return True, None

    def calculate_bullet_stop(self, s_x, s_y, r, player_id) -> (Position, str):

        dx = -math.sin(-r * math.pi/180)
        dy = -math.cos(-r * math.pi/180)

        while 0 < s_x < self.map.width-1 and 0 < s_y < self.map.height-1:
            s_x += dx
            s_y += dy
            allowed, player_hit = self.position_allowed(math.floor(s_x), math.floor(s_y), player_id)
            if not allowed:
                return Position(x=s_x, y=s_y), player_hit

        return Position(x=s_x, y=s_y), None

    def player_destroyed(self, player):
        pass


def create_new_game() -> Game:
    game_id = str(uuid.uuid4())
    game = Game(game_id=game_id)
    return game
