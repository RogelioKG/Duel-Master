# 3rd party library
import pytest
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from pytest_mock import MockerFixture, MockType

# local module
from src.card.text_extractor import OcrTextExtractor


@pytest.fixture(scope="function")
def ocr_text_extractor(mocker: MockerFixture, mock_logger: MockType) -> OcrTextExtractor:
    """
    提供 `OcrTextExtractor` 物件
    """
    # 假環境變數
    mocker.patch(
        "src.card.text_extractor.try_getenv", side_effect=["fake_subscription_key", "fake_endpoint"]
    )

    # 模擬 computervision_client
    mock_cv_client = mocker.MagicMock()
    mocker.patch("src.card.text_extractor.ComputerVisionClient", return_value=mock_cv_client)

    return OcrTextExtractor(logger=mock_logger)


class TestOcrTextExtractor:
    """
    ## CUT
    `OcrTextExtractor`
    """

    def test__send_read_request(
        self, mocker: MockerFixture, ocr_text_extractor: OcrTextExtractor
    ) -> None:
        """
        MUT
        ---
        `OcrTextExtractor._send_read_request`

        Description
        -----------
        + Given：使用 Azure OCR API
        + When：當發送 read request
        + Then：應取得正確的 operation_id
        """
        # Given
        mock_response = mocker.Mock()
        mock_response.headers = {
            "Operation-Location": "https://api.cognitiveservices.azure.com/vision/v3.2/read/analyze/operation-id"
        }
        ocr_text_extractor._computervision_client.read = mocker.Mock(return_value=mock_response)

        # When
        operation_id = ocr_text_extractor._send_read_request("fake_url")

        # Then
        assert operation_id == "operation-id"

    def test__poll_with_backoff_max_attempts_valueerror(
        self, mocker: MockerFixture, ocr_text_extractor: OcrTextExtractor
    ) -> None:
        """
        MUT
        ---
        `OcrTextExtractor._poll_with_backoff`

        Description
        -----------
        + Given：使用 Azure OCR API
        + When：當 polling 的 max_attempts < 1
        + Then：應拋出 `ValueError`
        """
        # Given
        mock_result = mocker.Mock()
        mock_result.status = OperationStatusCodes.succeeded
        mock_result.analyze_result.read_results = [
            mocker.Mock(lines=[mocker.Mock(text="CARD-NAME"), mocker.Mock(text="Some description")])
        ]
        ocr_text_extractor._computervision_client.get_read_result = mocker.Mock(
            return_value=mock_result
        )

        # Then
        with pytest.raises(ValueError, match="max_attempts must >= 1!"):
            ocr_text_extractor._poll_with_backoff("operation-id", max_attempts=0)

    def test__poll_with_backoff_initial_wait_valueerror(
        self, mocker: MockerFixture, ocr_text_extractor: OcrTextExtractor
    ) -> None:
        """
        MUT
        ---
        `OcrTextExtractor._poll_with_backoff`

        Description
        -----------
        + Given：使用 Azure OCR API
        + When：當 polling 的 initial_wait <= 0
        + Then：應拋出 `ValueError`
        """
        # Given
        mock_result = mocker.Mock()
        mock_result.status = OperationStatusCodes.succeeded
        mock_result.analyze_result.read_results = [
            mocker.Mock(lines=[mocker.Mock(text="CARD-NAME"), mocker.Mock(text="Some description")])
        ]
        ocr_text_extractor._computervision_client.get_read_result = mocker.Mock(
            return_value=mock_result
        )

        # Then
        with pytest.raises(ValueError, match="initial_wait must > 0!"):
            ocr_text_extractor._poll_with_backoff("operation-id", initial_wait=0)

    def test__poll_with_backoff_success(
        self, mocker: MockerFixture, ocr_text_extractor: OcrTextExtractor
    ) -> None:
        """
        MUT
        ---
        `OcrTextExtractor._poll_with_backoff`

        Description
        -----------
        + Given：使用 Azure OCR API
        + When：當不斷 polling 後回傳成功狀態
        + Then：應取得解析後的結果
        """
        # Given
        mock_result = mocker.Mock()
        mock_result.status = OperationStatusCodes.succeeded
        mock_result.analyze_result.read_results = [
            mocker.Mock(lines=[mocker.Mock(text="CARD-NAME"), mocker.Mock(text="Some description")])
        ]
        ocr_text_extractor._computervision_client.get_read_result = mocker.Mock(
            return_value=mock_result
        )

        # When
        result = ocr_text_extractor._poll_with_backoff("operation-id")

        # Then
        assert result == ["CARD-NAME", "Some description"]

    def test__poll_with_backoff_timeout(
        self, mocker: MockerFixture, ocr_text_extractor: OcrTextExtractor
    ) -> None:
        """
        MUT
        ---
        `OcrTextExtractor._poll_with_backoff`

        Description
        -----------
        + Given：使用 Azure OCR API
        + When：當 Azure OCR 長時間未完成
        + Then：應拋出 `TimeoutError`
        """
        mock_result = mocker.Mock()
        mock_result.status = OperationStatusCodes.running
        ocr_text_extractor._computervision_client.get_read_result = mocker.Mock(
            return_value=mock_result
        )

        with pytest.raises(TimeoutError, match="OCR processing took too long!"):
            ocr_text_extractor._poll_with_backoff("operation-id", max_attempts=1)

    def test__poll_with_backoff_not_started(
        self, mocker: MockerFixture, ocr_text_extractor: OcrTextExtractor
    ) -> None:
        """
        MUT
        ---
        `OcrTextExtractor._poll_with_backoff`

        Description
        -----------
        + Given：使用 Azure OCR API
        + When：當 Azure OCR 未啟動
        + Then：應拋出 `TimeoutError`
        """
        mock_result = mocker.Mock()
        mock_result.status = OperationStatusCodes.not_started
        ocr_text_extractor._computervision_client.get_read_result = mocker.Mock(
            return_value=mock_result
        )

        with pytest.raises(TimeoutError, match="OCR processing is not even started!"):
            ocr_text_extractor._poll_with_backoff("operation-id", max_attempts=1)

    def test__poll_with_backoff_failed(
        self, mocker: MockerFixture, ocr_text_extractor: OcrTextExtractor
    ) -> None:
        """
        MUT
        ---
        `OcrTextExtractor._poll_with_backoff`

        Description
        -----------
        + Given：使用 Azure OCR API
        + When：當 Azure OCR 未啟動
        + Then：應拋出 `TimeoutError`
        """
        mock_result = mocker.Mock()
        mock_result.status = OperationStatusCodes.failed
        ocr_text_extractor._computervision_client.get_read_result = mocker.Mock(
            return_value=mock_result
        )

        with pytest.raises(RuntimeError, match="OCR processing failed."):
            ocr_text_extractor._poll_with_backoff("operation-id", max_attempts=1)

    @pytest.mark.parametrize(
        "text_list, expected_output",
        [
            (["【】", "ABCD-ABCDE", "...", "...", "...", "12345678"], "........."),
            (["ABCD-ABCDE", "【】", "...", "...", "...", "ATK", "12345678"], "........."),
            (["...", "...", "ABCD-ABCDE", "ATK", "12345678"], "......"),
            (["【】", "ABCD-ABCDE", "...", "...", "ATK", "12345678"], "......"),
        ],
    )
    def test__filter_text(self, text_list: list[str], expected_output: str) -> None:
        """
        MUT
        ---
        `OcrTextExtractor._filter_text`

        Description
        -----------
        + Given：提取出的文字 list
        + When：當呼叫 `_filter_text`
        + Then：文字應該被正確過濾，且回傳字串
        """
        # Then
        assert OcrTextExtractor._filter_text(text_list) == expected_output

    def test_extract(self, mocker: MockerFixture, ocr_text_extractor: OcrTextExtractor) -> None:
        """
        MUT
        ---
        `OcrTextExtractor.extract`

        Description
        -----------
        + Given：ocr_text_extractor 物件
        + When：當呼叫 `extract`
        + Then：取得過濾後的 OCR 文字
        """
        # Given
        _send_read_request_return = "operation-id"
        mocker.patch.object(
            ocr_text_extractor, "_send_read_request", return_value=_send_read_request_return
        )

        mock_result = mocker.Mock()
        mock_result.status = OperationStatusCodes.succeeded
        _poll_with_backoff_return = [
            "CARD-NAME",
            "Some description",
            "ATK 2500",
            "DEF 2000",
        ]
        mocker.patch.object(
            ocr_text_extractor,
            "_poll_with_backoff",
            return_value=_poll_with_backoff_return,
        )

        _filter_text_return = "Some description\n"
        mocker.patch.object(OcrTextExtractor, "_filter_text", return_value=_filter_text_return)

        # When
        result = ocr_text_extractor.extract("fake_url")

        # Then
        assert result == "Some description\n"
