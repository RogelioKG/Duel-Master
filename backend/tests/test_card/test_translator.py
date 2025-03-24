# standard library

# 3rd party library
import pytest
import torch
from pytest_mock import MockerFixture, MockType

# local module
from src.card.translator import YugiohTranslator


@pytest.fixture(scope="function")
def mock_tensor(mocker: MockerFixture) -> MockType:
    """
    模擬 `torch.Tensor` 物件
    """
    mock_tensor = mocker.MagicMock(spec=torch.Tensor)
    mock_tensor.to = mocker.Mock(return_value=mock_tensor)
    mock_tensor.__iter__ = mocker.Mock(return_value=iter([1, 2, 3]))

    return mock_tensor


@pytest.fixture(scope="function")
def translator(mocker: MockerFixture, mock_logger: MockType) -> YugiohTranslator:
    """
    提供 `YugiohTranslator` 物件
    """
    # 模擬 device
    mock_device = mocker.MagicMock(name="mock_device")
    mocker.patch("torch.device", return_value=mock_device)

    # 模擬 tokenizer
    mock_tokenizer = mocker.MagicMock(name="mock_tokenizer")
    mocker.patch("src.card.translator.AutoTokenizer.from_pretrained", return_value=mock_tokenizer)

    # 模擬 model
    mock_model = mocker.MagicMock(name="mock_model")
    mock_model.to = mocker.Mock(return_value=mock_model)
    mocker.patch(
        "src.card.translator.MT5ForConditionalGeneration.from_pretrained", return_value=mock_model
    )

    # 提供 translator
    translator = YugiohTranslator(logger=mock_logger)

    return translator


class TestYugiohTranslator:
    """
    CUT
    ---
    `YugiohTranslator`
    """

    def test_translate(
        self,
        mocker: MockerFixture,
        mock_tensor: MockType,
        translator: YugiohTranslator,
    ) -> None:
        """
        MUT
        ---
        `YugiohTranslator.translate`

        Description
        -----------
        + Given：translator 物件
        + When：當呼叫 `translate` 時
        + Then：應啟動 tokenizer 與 model，並完成翻譯
        """
        # Given
        translator._tokenizer.encode = mocker.Mock(return_value=mock_tensor)
        translator._tokenizer.decode = mocker.Mock(
            side_effect=["Translated text", "Something else...", "Something else..."]
        )
        translator._model.generate = mocker.Mock(return_value=mock_tensor)

        # When
        translated_text = translator.translate("Untranslated text")

        # Then
        assert translated_text == "Translated text"
        translator._tokenizer.encode.assert_called_once()
        translator._model.generate.assert_called_once()
