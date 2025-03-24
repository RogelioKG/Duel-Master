# standard library
import pytest
from pytest_mock import MockFixture, MockType

# local module
from src.card.text_extractor import AbstractTextExtractor
from src.card.translation_pipeline import TranslationPipeline, normalize_punctuation
from src.card.translator import AbstractTranslator


@pytest.fixture(scope="function")
def mock_text_extractor(mocker: MockFixture) -> MockType:
    """
    模擬 `TextExtractor` 物件
    """
    mock_text_extractor = mocker.Mock(spec=AbstractTextExtractor)
    mock_text_extractor.extract = mocker.Mock(return_value="Extracted text")
    return mock_text_extractor


@pytest.fixture(scope="function")
def mock_translator(mocker: MockFixture) -> MockType:
    """
    模擬 `Translator` 物件
    """
    mock_translator = mocker.Mock(spec=AbstractTranslator)
    mock_translator.translate = mocker.Mock(return_value="Translated text")
    return mock_translator


class TestTranslationPipeline:
    """
    CUT
    ---
    `TranslationPipeline`
    """

    def test_process_with_no_hooks(
        self, mock_text_extractor: MockType, mock_translator: MockType
    ) -> None:
        """
        MUT
        ---
        `TranslationPipeline.process`

        Description
        -----------
        + Given：translation_pipeline 物件
        + When：當沒有後處理 hook 時
        + Then：應正常運行
        """
        # Given
        translation_pipeline = TranslationPipeline(mock_text_extractor, mock_translator)

        # When
        result = translation_pipeline.process("Source text")

        # Then
        assert result == "Translated text"
        mock_translator.translate.assert_called_once_with("Extracted text")
        mock_text_extractor.extract.assert_called_once_with("Source text")

    def test_process_with_hooks(
        self, mock_text_extractor: MockType, mock_translator: MockType
    ) -> None:
        """
        MUT
        ---
        `TranslationPipeline.process`

        Description
        -----------
        + Given：translation_pipeline 物件
        + When：當僅有一個後處理 hook 時
        + Then：應正常運行
        """
        # Given
        translation_pipeline = TranslationPipeline(mock_text_extractor, mock_translator)

        # 註冊後處理 hook
        def sample_hook(text: str) -> str:
            return text.upper()

        translation_pipeline.add_postprocess_hook(sample_hook)

        # When
        result = translation_pipeline.process("Source text")

        # Then
        assert result == "TRANSLATED TEXT"
        mock_translator.translate.assert_called_once_with("Extracted text")
        mock_text_extractor.extract.assert_called_once_with("Source text")

    def test_process_with_multiple_hooks(
        self, mock_text_extractor: MockType, mock_translator: MockType
    ) -> None:
        """
        MUT
        ---
        `TranslationPipeline.process`

        Description
        -----------
        + Given：translation_pipeline 物件
        + When：當有多個後處理 hook 時
        + Then：應按順序執行 hook
        """
        # Given
        translation_pipeline = TranslationPipeline(mock_text_extractor, mock_translator)

        # 註冊多個後處理 hook
        def hook_one(text: str) -> str:
            return text + " Hook1"

        def hook_two(text: str) -> str:
            return text + " Hook2"

        translation_pipeline.add_postprocess_hook(hook_one)
        translation_pipeline.add_postprocess_hook(hook_two)

        # When
        result = translation_pipeline.process("Source text")

        # Then
        assert result == "Translated text Hook1 Hook2"
        mock_translator.translate.assert_called_once_with("Extracted text")
        mock_text_extractor.extract.assert_called_once_with("Source text")


def test_normalize_punctuation() -> None:
    """
    MUT
    ---
    `normalize_punctuation`

    Description
    -----------
    + Given：文字
    + When：當呼叫 `normalize_punctuation`
    + Then：應標準化中文標點符號
    """
    # Given
    text = "John Cena:早上好,世界!現在我有冰淇淋.你有冰淇淋嗎?"

    # When
    result = normalize_punctuation(text)

    # Then
    assert result == "John Cena：早上好，世界！現在我有冰淇淋。你有冰淇淋嗎？"
