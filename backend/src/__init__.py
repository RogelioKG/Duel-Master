# standard library
import logging

# 3rd party library
from dotenv import load_dotenv
from flask import Flask, Response, jsonify, request, send_file, send_from_directory
from flask_cors import CORS

# load environment variable
load_dotenv()

# local module
from src.card.text_extractor import OcrTextExtractor  # noqa: E402
from src.card.translation_pipeline import TranslationPipeline, normalize_punctuation  # noqa: E402
from src.card.translator import YugiohTranslator  # noqa: E402
from src.constants import PATH  # noqa: E402
from src.image.card_image import CardImage  # noqa: E402
from src.image.user_image import UserImage  # noqa: E402
from src.shared_types import FrontCardData  # noqa: E402


def create_app() -> Flask:
    """創建 Flask app，並初始化所有依賴"""
    # app
    app = Flask(__name__)
    CORS(app)

    # 設定日誌
    logger = app.logger
    logger.setLevel(logging.DEBUG)

    # OCR 文字提取器
    text_extractor = OcrTextExtractor(logger=logger)

    # 翻譯模型
    translator = YugiohTranslator(logger=logger)

    # 翻譯管線
    translation_pipeline = TranslationPipeline(text_extractor, translator)
    translation_pipeline.add_postprocess_hook(normalize_punctuation)

    # app.config
    app.config["TRANSLATION_PIPELINE"] = translation_pipeline
    app.config["LOGGER"] = logger

    @app.route("/api/translate", methods=["POST"])
    def translate_api() -> Response | tuple[Response, int]:
        """翻譯 API"""

        if "image" not in request.files:
            return jsonify({"success": False, "errMessage": "No image file provided"}), 400

        # 儲存圖片
        image = request.files["image"]
        user_image = UserImage(image)
        user_image.save()
        user_image_url = user_image.create_url()

        # 翻譯圖片
        pipeline: TranslationPipeline = app.config["TRANSLATION_PIPELINE"]
        translated_text = pipeline.process(user_image_url)

        # 產出 FrontCardData
        front_card_data: FrontCardData = {"description": translated_text}

        # 刪除圖片
        user_image.remove()

        return jsonify({"success": True, "frontCardData": front_card_data})

    @app.route("/api/question", methods=["POST"])
    def question_api() -> Response | tuple[Response, int]:
        """問答 API"""
        if not request.data:
            return jsonify({"success": False, "errMessage": "No question text provided"}), 400

        question_text = request.data.decode("utf-8")

        return jsonify(
            {
                "success": True,
                "answer": f"嗯...我知道你問了「{question_text}」，但拍謝，問答功能還在開發中噢！",
            }
        )

    @app.route("/api/assets/card-material/<path:filepath>")
    def serve_card_material(filepath: str) -> Response | tuple[Response, int]:
        """卡片材質 API"""
        return send_from_directory(PATH.YUGIOH_MATERIAL_DIR.value, filepath)

    @app.route("/api/assets/card-image/<image_id>")
    def serve_card_image(image_id: str) -> Response | tuple[Response, int]:
        """卡面圖片 API"""
        logger: logging.Logger = app.config["LOGGER"]
        card_image = CardImage(image_id, logger=logger)

        # 如果圖片不存在就下載
        if not card_image.exists_locally():
            card_image.download()

        return send_file(card_image.local_path)

    return app
