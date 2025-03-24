# standard library
import logging

# 3rd party library
import pytest
from pytest_mock import MockerFixture, MockType
from werkzeug.datastructures import FileStorage


@pytest.fixture(scope="function")
def mock_logger(mocker: MockerFixture) -> MockType:
    """
    模擬 logger 物件
    """
    return mocker.MagicMock(spec=logging.Logger)


@pytest.fixture(scope="function")
def mock_file(mocker: MockerFixture) -> MockType:
    """
    模擬 `FileStorage` 物件
    """
    mock_file = mocker.MagicMock(spec=FileStorage)
    mock_file.filename = "test.jpg"
    return mock_file
