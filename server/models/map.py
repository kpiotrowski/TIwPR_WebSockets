import json


class Map:

    def __init__(self):

        with open('server/maps/map.json') as f:
            data = f.read()

            self.content = json.loads(data)
            self.height = len(self.content)
            self.width = len(self.content["0"])

    def to_dict(self):
        return self.__dict__
