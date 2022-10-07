ZEN = "".join(chr(0xFF01 + i) for i in range(94))
HAN = "".join(chr(0x21 + i) for i in range(94))

ZEN_NUMBER = "０１２３４５６７８９"
HAN_NUMBER = "0123456789"

ZEN2HAN = str.maketrans(ZEN, HAN)
HAN2ZEN = str.maketrans(HAN, ZEN)


def zen2han(s: str):
    return s.translate(ZEN2HAN)


def han2zen(s: str):
    return s.translate(HAN2ZEN)


def zen2han_number(s: str):
    return s.translate(str.maketrans(ZEN_NUMBER, HAN_NUMBER))
