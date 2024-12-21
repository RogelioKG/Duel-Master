from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import Protocol, Optional


# export type TranslateAPIResponse =
#   | { success: true; frontCardData: Partial<FrontCardData> }
#   | { success: false; errMessage: string }


class TranslateAPIResponse(Protocol):
    success: bool
    frontCardData: Optional[dict[str, str]]
    errMessage: Optional[str]


# export type QuestionAPIResponse =
# | { success: true; answer: string }
# | { success: false; errMessage: string }


class QuestionAPIResponse(Protocol):
    success: bool
    answer: Optional[str]
    errMessage: Optional[str]


app = Flask(__name__)
CORS(app)

mock_front_card_data = {
    "name": "灰流麗",
    "attribute": "fire",
    "level": 3,
    "monsterType": "不死族",
    "atk": 0,
    "def": 1800,
    "description": "「灰流麗」的效果1回合僅能使用1次。 包含以下效果的魔法、陷阱、怪獸效果發動時，可以從手札捨棄此卡發動。該效果無效。此效果也可以在對手回合發動。 ●從牌組將卡片加入手札的效果●從牌組將怪獸特殊召喚的效果●從牌組將卡片送入墓地的效果",
}


@app.route("/api/translate", methods=["POST"])
def translate_api():
    if "image" not in request.files:
        response: TranslateAPIResponse = {
            "success": False,
            "errMessage": "No image file provided",
        }
        return jsonify(response), 400

    image = request.files["image"]  # 圖片在這裡

    response: TranslateAPIResponse = {
        "success": True,
        "frontCardData": mock_front_card_data,
    }

    return jsonify(response)


@app.route("/api/question", methods=["POST"])
def question_api():
    if not request.data:
        response: QuestionAPIResponse = {
            "success": False,
            "errMessage": "No question text provided",
        }
        return jsonify(response), 400

    question_text = request.data.decode("utf-8")  # 問題在這裡

    response: QuestionAPIResponse = {
        "success": True,
        "answer": f"Your question '{question_text}' has been successfully processed.",
    }

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True, port=3000)
