# standard library
from collections.abc import Callable

# local module
from .text_extractor import AbstractTextExtractor
from .translator import AbstractTranslator


class TranslationPipeline:
    def __init__(
        self, text_extractor: AbstractTextExtractor, translator: AbstractTranslator
    ) -> None:
        self.text_extractor = text_extractor
        self.translator = translator
        self.postprocess_hooks: list[Callable[[str], str]] = []

    def add_postprocess_hook(self, hook: Callable[[str], str]) -> None:
        """註冊翻譯後處理函式
        Parameters
        ----------
        hook : Callable[[str], str]
            後處理函式
        """
        self.postprocess_hooks.append(hook)

    def process(self, src: str) -> str:
        """開始翻譯流程

        Parameters
        ----------
        src : str
            圖片 URL

        Returns
        -------
        str
            翻譯字串
        """
        extracted_text = self.text_extractor.extract(src)
        translated_text = self.translator.translate(extracted_text)

        # 執行所有後處理 Hook
        for postprocess_hook in self.postprocess_hooks:
            translated_text = postprocess_hook(translated_text)

        return translated_text


def normalize_punctuation(text: str) -> str:
    """中文標點符號標準化

    Parameters
    ----------
    text : str
        標準化前字串

    Returns
    -------
    str
        標準化後字串
    """
    norm_map = {
        ":": "：",
        ";": "；",
        "!": "！",
        "?": "？",
        ",": "，",
        ".": "。",
    }
    return "".join(norm_map.get(char, char) for char in text)
