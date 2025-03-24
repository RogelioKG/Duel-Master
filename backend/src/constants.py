# standard library
import os
from enum import Enum


class API(Enum):
    YUGIOH_IMAGE = "https://images.ygoprodeck.com/images/cards_cropped"
    IMGUR = "https://api.imgur.com/3/image"


class PATH(Enum):
    YUGIOH_IMAGE_DIR = os.path.abspath("./src/assets/card-image")
    YUGIOH_MATERIAL_DIR = os.path.abspath("./src/assets/card-material")
    USER_UPLOAD_IMAGE_DIR = os.path.abspath("./src/storage")
    MODEL_DIR = os.path.abspath("./src/model")
