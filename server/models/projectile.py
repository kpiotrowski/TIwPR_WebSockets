
DEFAULT_DAMAGE = 50


class Projectile:

    def __init__(self, **kwargs):

        self.pos_x = kwargs.get('pos_x')
        self.pos_y = kwargs.get('pos_y')
        self.angle = kwargs.get('angle')

        self.speed_x = kwargs.get('speed_x')
        self.speed_y = kwargs.get('speed_y')

        self.damage = kwargs.get('damage', DEFAULT_DAMAGE)
