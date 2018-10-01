class Position:

    def __init__(self, **kwargs):
        x = kwargs.get('x')  # Position X
        y = kwargs.get('y')  # Position Y
        r = kwargs.get('r')  # Rotation R


class Player:

    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.name = kwargs.get('name')
        self.socket = kwargs.get('socket')


def create_new_player(player_id, socket, num) -> Player:
    player = Player(id=player_id, socket=socket, name=f"Player{str(num)}")
    return player

