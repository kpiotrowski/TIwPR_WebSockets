class Position:

    def __init__(self, **kwargs):
        self.x = kwargs.get('x', 1)  # Position X
        self.y = kwargs.get('y', 1)  # Position Y
        self.r = kwargs.get('r', 0)  # Rotation R

    def to_dict(self):
        return {
            "x": str(self.x),
            "y": str(self.y),
            "r": str(self.r)
        }


class Player:

    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.name = kwargs.get('name')
        self.socket = kwargs.get('socket')
        self.position = Position()

        self.life = kwargs.get('life', 100)
        self.points = kwargs.get('points', 0)

    def generate_info(self):
        return {
            "id": self.id,
            "name": self.name,
            "position": self.position.to_dict(),
            "life": self.life,
            "points": self.points
        }

    def hit(self):
        self.life -= 40
        if self.life < 0:
            self.life = 0

    def is_destroyed(self):
        return self.life == 0


def create_new_player(player_id, socket, num, position: Position) -> Player:
    player = Player(id=player_id, socket=socket, name=f"Player{str(num)}")
    player.position = position
    return player

