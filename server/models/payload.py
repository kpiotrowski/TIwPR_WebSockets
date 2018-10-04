import json

from server.models.player import Position


class Payload:

    def __init__(self, **kwargs):
        self.type = kwargs.get('type')
        self.data = kwargs.get('data')
        self.id = kwargs.get('id')

    def send(self, client):
        client.sendMessage(json.dumps(self.__dict__).encode('utf-8'), False)


class GameDataPayload:

    def __init__(self, **kwargs):
        self.game_id = kwargs.get('game_id')
        self.position = Position(**kwargs.get('position', {}))
