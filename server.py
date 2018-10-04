import json
import uuid

from autobahn.twisted.websocket import WebSocketServerProtocol, \
    WebSocketServerFactory

from server.game import handle_message
from server.models.payload import Payload

clients = {}


class MyServerProtocol(WebSocketServerProtocol):
    def onConnect(self, request):
        print("Web socket connect")

    def onOpen(self):
        print("Web socket ")

    def onMessage(self, payload, isBinary):
        if isBinary:
            pass
            # print("Binary message received: {0} bytes".format(len(payload)))
        else:
            # print(f"Received data {payload.decode('utf8')}")
            payload = json.loads(payload.decode('utf8'))

        payload = Payload(**payload)
        if not payload.id:
            payload.id = str(uuid.uuid4())
            Payload(id=payload.id, type="SET_CLIENT_ID").send(self)

        if payload.id not in clients:
            clients[payload.id] = self

        handle_message(payload, self)

    def onClose(self, was_clean, code, reason):
        pass


if __name__ == "__main__":
    import sys

    from twisted.python import log
    from twisted.internet import reactor

    log.startLogging(sys.stdout)

    factory = WebSocketServerFactory("ws://0.0.0.0:8888/tanks")
    factory.protocol = MyServerProtocol
    reactor.listenTCP(8888, factory)
    reactor.run()
