# standard library
import io

import pytest

# 3rd party library
from flask import Flask
from flask.testing import FlaskClient
from pytest_mock import MockerFixture, MockType

from src import create_app
from src.card.text_extractor import AbstractTextExtractor
from src.card.translation_pipeline import TranslationPipeline
from src.card.translator import AbstractTranslator
from src.image.card_image import CardImage
from src.image.user_image import UserImage


@pytest.fixture(scope="function")
def mock_card_image(mocker: MockerFixture) -> MockType:
    """
    模擬 `UserImage` 物件
    """
    mock_card_image = mocker.MagicMock(spec=CardImage)
    mocker.patch("src.CardImage", return_value=mock_card_image)
    return mock_card_image


@pytest.fixture(scope="function")
def mock_user_image(mocker: MockerFixture) -> MockType:
    """
    模擬 `UserImage` 物件
    """
    mock_user_image = mocker.MagicMock(spec=UserImage)
    mock_user_image.save = mocker.Mock()
    mock_user_image.create_url = mocker.Mock(return_value="Mocked URL")
    mocker.patch("src.UserImage", return_value=mock_user_image)
    return mock_user_image


@pytest.fixture(scope="function")
def mock_pipeline(mocker: MockerFixture) -> MockType:
    """
    模擬 `TranslationPipeline` 物件
    """
    mock_pipeline = mocker.MagicMock(spec=TranslationPipeline)
    mock_pipeline.process = mocker.Mock(return_value="Mocked Translation")
    mock_pipeline.add_postprocess_hook = mocker.Mock()
    mocker.patch("src.TranslationPipeline", return_value=mock_pipeline)
    return mock_pipeline


@pytest.fixture(scope="function")
def app(mocker: MockerFixture, mock_user_image: MockType, mock_pipeline: MockType):
    """
    提供 app 物件
    """
    mock_text_extractor = mocker.MagicMock(spec=AbstractTextExtractor)
    mocker.patch("src.OcrTextExtractor", return_value=mock_text_extractor)
    mock_translator = mocker.MagicMock(spec=AbstractTranslator)
    mocker.patch("src.YugiohTranslator", return_value=mock_translator)
    app = create_app()
    app.config.update({"TESTING": True})
    yield app


@pytest.fixture(scope="function")
def client(app: Flask):
    """
    模擬 client
    """
    with app.test_client() as client:
        yield client


def test_translate_api(
    client: FlaskClient, mock_user_image: MockType, mock_pipeline: MockType
) -> None:
    """
    SUT
    ---
    Translation API

    Description
    -----------
    + Given：提供有效的圖片
    + When：呼叫 `/api/translate` endpoint
    + Then：應該回傳 200 並包含翻譯結果
    """
    # Given
    data = {"image": (io.BytesIO(b"fake image data"), "test.jpg")}

    # When
    response = client.post("/api/translate", data=data)

    # Then
    mock_user_image.save.assert_called_once()
    mock_user_image.create_url.assert_called_once()
    mock_pipeline.process.assert_called_once_with("Mocked URL")
    assert response.status_code == 200
    assert response.get_json()["success"] is True
    assert response.get_json()["frontCardData"]["description"] == "Mocked Translation"


def test_translate_api_no_image(client: FlaskClient) -> None:
    """
    SUT
    ---
    Translation API

    Description
    -----------
    + Given：沒有提供圖片
    + When：呼叫 `/api/translate` endpoint
    + Then：應該回傳 400 並顯示錯誤訊息
    """
    # When
    response = client.post("/api/translate", data={})
    # Then
    assert response.status_code == 400
    assert response.get_json() == {"success": False, "errMessage": "No image file provided"}


def test_question_api(client: FlaskClient) -> None:
    """
    SUT
    ---
    Question API

    Description
    -----------
    + Given：提供問題內容
    + When：呼叫 `/api/question` endpoint
    + Then：應該回傳 200 並返回模擬的答案
    """
    response = client.post("/api/question", data="這是測試問題")

    assert response.status_code == 200
    assert response.get_json()["success"] is True
    assert response.get_json()["answer"] is not None


def test_question_api_no_text(client: FlaskClient) -> None:
    """
    SUT
    ---
    Question API

    Description
    -----------
    + Given：沒有提供問題內容
    + When：呼叫 `/api/question` endpoint
    + Then：應該回傳 400 並顯示錯誤訊息
    """
    response = client.post("/api/question", data=b"")

    assert response.status_code == 400
    assert response.get_json() == {"success": False, "errMessage": "No question text provided"}


def test_serve_card_material(mocker: MockerFixture, client: FlaskClient) -> None:
    """
    SUT
    ---
    Card Material API

    Description
    -----------
    + Given：提供有效的檔案路徑
    + When：呼叫 `/api/assets/card-material/<path>` endpoint
    + Then：應該回傳 200 並提供檔案
    """
    # Given
    mock_send_from_directory = mocker.patch(
        "src.send_from_directory", return_value="mocked response"
    )

    # When
    response = client.get("/api/assets/card-material/sample.jpg")

    # Then
    assert response.status_code == 200
    assert response.text == "mocked response"
    mock_send_from_directory.assert_called_once()


def test_serve_card_image(
    mocker: MockerFixture, client: FlaskClient, mock_card_image: MockType
) -> None:
    """
    SUT
    ---
    Card Image API

    Description
    -----------
    + Given：提供有效的圖片 ID
    + When：呼叫 `/api/assets/card-image/<image_id>` endpoint
    + Then：應該回傳 200 並提供圖片
    """
    # Given
    mock_card_image.exists_locally = mocker.Mock(return_value=True)
    mock_card_image.local_path = "src/assets/card-image/mock_id"
    mock_send_file = mocker.patch("src.send_file", return_value="mocked response")

    # When
    response = client.get("/api/assets/card-image/mock_id")

    # Then
    assert response.text == "mocked response"
    assert response.status_code == 200
    mock_send_file.assert_called_once_with("src/assets/card-image/mock_id")


def test_serve_card_image_download_yet(
    mocker: MockerFixture, client: FlaskClient, mock_card_image: MockType
) -> None:
    """
    SUT
    ---
    Card Image API

    Description
    -----------
    + Given：提供有效的圖片 ID，但圖片尚未存在於本地，需要下載
    + When：呼叫 `/api/assets/card-image/<image_id>` endpoint
    + Then：應該下載圖片，回傳 200 並提供圖片
    """
    # Given
    mock_card_image.exists_locally = mocker.Mock(return_value=False)
    mock_card_image.local_path = "src/assets/card-image/mock_id"
    mock_card_image.download = mocker.Mock()
    mock_send_file = mocker.patch("src.send_file", return_value="mocked response")

    # When
    response = client.get("/api/assets/card-image/mock_id")

    # Then
    assert response.text == "mocked response"
    assert response.status_code == 200
    mock_card_image.download.assert_called_once()
    mock_send_file.assert_called_once_with("src/assets/card-image/mock_id")
