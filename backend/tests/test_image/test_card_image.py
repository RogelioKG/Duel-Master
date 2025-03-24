# 3rd party library
import pytest
import requests
from pytest_mock import MockFixture

# local module
from src.constants import API, PATH
from src.image.card_image import CardImage


@pytest.fixture(scope="function")
def card_image(mock_logger: MockFixture) -> CardImage:
    """
    提供 `CardImage` 物件
    """
    return CardImage("12345", logger=mock_logger)


class TestCardImage:
    """
    ## CUT
    `CardImage`
    """

    def test_exists_locally(self, mocker: MockFixture, card_image: CardImage) -> None:
        """
        MUT
        ---
        `CardImage.exists_locally`

        Description
        -----------
        + Given：`card_image` 物件
        + When：當呼叫 `exists_locally` 時
        + Then：應呼叫到 `os.path.exists`
        """
        # Given
        mock_path_exists = mocker.patch("os.path.exists", return_value=True)

        # Then
        assert card_image.exists_locally() is True
        mock_path_exists.assert_called_once_with(f"{PATH.YUGIOH_IMAGE_DIR.value}/12345.jpg")

    def test_download_success(self, mocker: MockFixture, card_image: CardImage) -> None:
        """
        MUT
        ---
        `CardImage.download`

        Description
        -----------
        + Given：`card_image` 物件
        + When：當下載成功時
        + Then：應呼叫到 `requests.get` (請求) 和 `builtins.open` (寫入圖片)
        """
        # Given
        mock_response = mocker.Mock()
        mock_response.raise_for_status = mocker.Mock()
        mock_response.content = b"fake_image_data"
        mock_get = mocker.patch("requests.get", return_value=mock_response)
        mock_open = mocker.patch("builtins.open", mocker.mock_open())

        # Then
        assert card_image.download() is True
        mock_get.assert_called_once_with(f"{API.YUGIOH_IMAGE.value}/12345.jpg")
        mock_open.assert_called_once_with(f"{PATH.YUGIOH_IMAGE_DIR.value}/12345.jpg", "wb")

    def test_download_failure(self, mocker: MockFixture, card_image: CardImage) -> None:
        """
        MUT
        ---
        `CardImage.download`

        Description
        -----------
        + Given：`card_image` 物件
        + When：當下載失敗時
        + Then：應回傳 `False`
        """
        # Given
        mocker.patch(
            "requests.get", side_effect=requests.exceptions.RequestException("Download failed")
        )

        # Then
        assert card_image.download() is False

    def test_remove_existing_file(self, mocker: MockFixture, card_image: CardImage) -> None:
        """
        MUT
        ---
        `CardImage.remove`

        Description
        -----------
        + Given：`card_image` 物件
        + When：當嘗試移除存在的圖片時
        + Then：應呼叫到 `os.remove` 協助移除
        """
        # Given
        mock_remove = mocker.patch("os.remove")
        mocker.patch.object(card_image, "exists_locally", return_value=True)

        # When
        card_image.remove()

        # Then
        mock_remove.assert_called_once_with(f"{PATH.YUGIOH_IMAGE_DIR.value}/12345.jpg")

    def test_remove_non_existing_file(self, mocker: MockFixture, card_image: CardImage) -> None:
        """
        MUT
        ---
        `CardImage.remove`

        Description
        -----------
        + Given：`card_image` 物件
        + When：當圖片不存在於本地，卻嘗試移除時
        + Then：不應呼叫到 `os.remove`
        """
        # Given
        mock_remove = mocker.patch("os.remove")
        mocker.patch.object(card_image, "exists_locally", return_value=False)

        # When
        card_image.remove()

        # Then
        mock_remove.assert_not_called()
