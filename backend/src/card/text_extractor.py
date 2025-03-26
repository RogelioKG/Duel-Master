# standard library
import logging
import random
import re
import time
from abc import ABC, abstractmethod

# 3rd party library
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials

# local module
from src.utils.misc import try_getenv


class AbstractTextExtractor(ABC):
    @abstractmethod
    def extract(self, src: str) -> str:  # pragma: no cover
        """從指定來源提取文字

        Parameters
        ----------
        src : str
            圖片 URL

        Returns
        -------
        str
            提取出的文字
        """
        pass


class OcrTextExtractor(AbstractTextExtractor):
    def __init__(self, *, logger: logging.Logger) -> None:
        self.logger = logger
        self._subscription_key = try_getenv("AZURE_CV_SUBSCRIPTION_KEY")
        self._endpoint = try_getenv("AZURE_CV_ENDPOINT")
        self._computervision_client = ComputerVisionClient(
            self._endpoint, CognitiveServicesCredentials(self._subscription_key)
        )

    def extract(self, src: str) -> str:
        self.logger.debug("[OcrTextExtractor] - extracting text started")

        operation_id = self._send_read_request(src)
        read_result = self._poll_with_backoff(operation_id)

        self.logger.debug(
            "In OcrTextExtractor, extracting text completed.\nResult:\n%s",
            read_result,
        )

        extracted_text = OcrTextExtractor._filter_text(read_result)

        self.logger.debug(
            "In OcrTextExtractor, filtering text completed.\nResult:\n%s",
            extracted_text,
        )

        return extracted_text

    def _send_read_request(self, src: str) -> str:
        """發送 OCR 請求，返回操作 ID

        Parameters
        ----------
        src : str
            圖片 URL

        Returns
        -------
        str
            操作 ID
        """
        read_response = self._computervision_client.read(src, raw=True)
        operation_id = read_response.headers["Operation-Location"].split("/")[-1]

        return operation_id

    def _poll_with_backoff(
        self, operation_id: str, *, max_attempts: int = 10, initial_wait: float = 1.0
    ) -> list[str]:
        """向 Azure OCR API 不斷輪詢

        Parameters
        ----------
        operation_id : str
            操作 ID
        max_attempts : int, optional
            最大嘗試次數
        initial_wait : float, optional
            最初等待時間

        Returns
        -------
        list[str]
            讀取結果

        Raises
        ------
        RuntimeError
            OCR 程序處理失敗
        TimeoutError
            OCR 程序跑太久
        TimeoutError
            OCR 程序不知為何未開始
        """
        wait_time = initial_wait

        for _ in range(max_attempts):
            read_result = self._computervision_client.get_read_result(operation_id)
            if read_result.status == OperationStatusCodes.succeeded:
                break
            elif read_result.status == OperationStatusCodes.failed:
                raise RuntimeError("OCR processing failed.")
            else:
                time.sleep(wait_time)
                # 每次 request 最多間隔 10 秒
                wait_time = min(wait_time * 2, 10)
                # 加入 jitter (避免同算法的 client 造成流量高峰)
                wait_time -= random.uniform(0, 1)
                # TODO: 如果 initial_wait < 1 可能會出問題，要檢查

        if read_result.status == OperationStatusCodes.succeeded:
            extracted_text_list: list[str] = [
                line.text
                for text_result in read_result.analyze_result.read_results
                for line in text_result.lines
            ]
            return extracted_text_list
        elif read_result.status == OperationStatusCodes.running:
            raise TimeoutError("OCR processing took too long!")
        elif read_result.status == OperationStatusCodes.not_started:
            raise TimeoutError("OCR processing is not even started!")

    @staticmethod
    def _filter_text(text_list: list[str]) -> str:
        """過濾 OCR 提取出的文字

        Parameters
        ----------
        text_list : list[str]
            ...

        Returns
        -------
        str
            提取出的文字
        """

        # 重寫一遍的算法
        # 根據這樣的邏輯抽取出 ...
        # NOTE: 並非絕對穩定輸出

        # 【】 \w{4}\-\w{5} ... \d{8}
        # \w{4}\-\w{5} 【】 ... ATK \d{8}
        # 【】 ... \w{4}\-\w{5} ATK \d{8}
        # 【】 \w{4}\-\w{5} ... ATK \d{8}

        start = 0
        for i in range(len(text_list)):
            if "【" in text_list[i] and "】" in text_list[i]:
                start = i + 1

        end = len(text_list) - 1
        for j in reversed(range(len(text_list))):
            if re.match(r"\d{8}.*", text_list[j]):
                end = j - 1

        description_text_list: list[str] = text_list[start : end + 1]

        for description_text in description_text_list.copy():
            if re.match(r"\w{4}\-\w{5}", description_text):
                description_text_list.remove(description_text)
            elif "ATK" in description_text or "DEF" in description_text:
                description_text_list.remove(description_text)

        description = "".join(description_text_list)

        return description
