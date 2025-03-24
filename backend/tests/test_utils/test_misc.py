# 3rd party library
import pytest
from pytest_mock import MockFixture

# local module
from src.utils.misc import try_getenv


def test_try_getenv_existing_variable(mocker: MockFixture) -> None:
    """
    MUT
    ---
    `try_getenv`

    Description
    -----------
    + Given：
    + When：當環境變數存在時
    + Then：應回傳正確值
    """
    # Given
    mock_getenv = mocker.patch("os.getenv", return_value="test_value")

    # When
    result = try_getenv("TEST_VAR")

    # Then
    assert result == "test_value"
    mock_getenv.assert_called_once_with("TEST_VAR")


def test_try_getenv_missing_variable(mocker: MockFixture) -> None:
    """
    MUT
    ---
    `try_getenv`

    Description
    -----------
    + Given：
    + When：當環境變數不存在時
    + Then：應引發 `ValueError`
    """
    # Given
    mock_getenv = mocker.patch("os.getenv", return_value=None)

    # When
    with pytest.raises(ValueError) as excinfo:
        try_getenv("NONEXISTENT_VAR")

    # Then
    assert "NONEXISTENT_VAR environment variable is not set" in str(excinfo.value)
    mock_getenv.assert_called_once_with("NONEXISTENT_VAR")
