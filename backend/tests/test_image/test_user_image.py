# standard library
import json
from base64 import b64encode

import pytest

# 3rd party library
from pytest_mock import MockFixture, MockType

# local module
from src.constants import API, PATH
from src.image.user_image import UserImage


@pytest.fixture(scope="function")
def user_image(mock_file: MockType) -> UserImage:
    """
    提供 `UserImage` 物件
    """
    return UserImage(mock_file)


class TestUserImage:
    """
    CUT
    ---
    `UserImage`
    """

    def test_abspath(self, user_image: UserImage) -> None:
        """
        MUT
        ---
        `UserImage.abspath`

        Description
        ---
        + Given：`user_image` 物件
        + When：調用 `abspath` 屬性
        + Then：應正確返回圖片的本地路徑
        """
        # Then
        assert user_image.abspath == f"{PATH.USER_UPLOAD_IMAGE_DIR.value}/test.jpg"

    def test_save(self, mock_file: MockType, user_image: UserImage) -> None:
        """
        MUT
        ---
        `UserImage.save`

        Description
        -----------
        + Given：`user_image` 物件
        + When：呼叫 `save`
        + Then：`FileStorage` 物件的 `save` 方法應協助儲存圖片
        """
        # When
        user_image.save()

        # Then
        mock_file.save.assert_called_once_with(user_image.abspath)

    def test_remove_existing_file(self, mocker: MockFixture, user_image: UserImage) -> None:
        """
        MUT
        ---
        `UserImage.remove`

        Description
        -----------
        + Given：`user_image` 物件
        + When：當嘗試移除已存在圖片時
        + Then：應呼叫到 `os.remove` 協助移除
        """
        # Given
        mocker.patch("os.path.exists", return_value=True)
        mock_remove = mocker.patch("os.remove")

        # When
        user_image.remove()

        # Then
        mock_remove.assert_called_once_with(user_image.abspath)

    def test_remove_non_existing_file(self, mocker: MockFixture, user_image: UserImage) -> None:
        """
        MUT
        ---
        `UserImage.remove`

        Description
        -----------
        + Given：`user_image` 物件
        + When：當嘗試移除不存在圖片時
        + Then：不應呼叫到 `os.remove`
        """
        # Given
        mocker.patch("os.path.exists", return_value=False)
        mock_remove = mocker.patch("os.remove")

        # When
        user_image.remove()

        # Then
        mock_remove.assert_not_called()

    def test_create_url(self, mocker: MockFixture, user_image: UserImage) -> None:
        """
        MUT
        ---
        `UserImage.create_url`

        Description
        -----------
        + Given：`user_image` 物件
        + When：當嘗試將圖片上傳至 Imgur
        + Then：應回傳 URL
        """
        # Given
        mocker.patch("builtins.open", mocker.mock_open(read_data=b"fake_image_data"))
        mocker.patch(
            "src.image.user_image.try_getenv", side_effect=["fake_api_key", "fake_client_id"]
        )
        mock_response = mocker.Mock()
        mock_response.text = json.dumps({"data": {"link": "https://imgur.com/test.jpg"}})
        mock_post = mocker.patch("requests.post", return_value=mock_response)

        # When
        url = user_image.create_url()

        # Then
        assert url == "https://imgur.com/test.jpg"
        mock_post.assert_called_once_with(
            API.IMGUR.value,
            headers={"Authorization": "Client-ID fake_client_id"},
            data={
                "key": "fake_api_key",
                "image": b64encode(b"fake_image_data"),
                "type": "base64",
                "name": "test.jpg",
                "title": "test.jpg",
            },
        )
