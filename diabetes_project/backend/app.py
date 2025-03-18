from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ✅ Load model và scaler
try:
    model = tf.keras.models.load_model("diabetes_model.keras")
    scaler = joblib.load("scaler.pkl")
    print("✅ Model và Scaler đã được tải thành công!")
except Exception as e:
    print(f"❌ Lỗi tải model hoặc scaler: {e}")
    model, scaler = None, None

# ✅ Xử lý đầu vào
def preprocess_input(data):
    """Chuẩn hóa dữ liệu đầu vào"""
    return scaler.transform([data])

# ✅ API: Kiểm tra trạng thái server
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "🚀 API Flask đang chạy!"})

# ✅ API: Kiểm tra thông tin model
@app.route("/model_info", methods=["GET"])
def model_info():
    try:
        model_summary = []
        model.summary(print_fn=lambda x: model_summary.append(x))
        return jsonify({"model_summary": model_summary})
    except Exception as e:
        return jsonify({"error": str(e)})

# ✅ API: Dự đoán bệnh tiểu đường
@app.route("/predict", methods=["POST"])
def predict():
    try:
        input_data = request.json
        required_keys = ["Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
                         "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"]

        # 🔹 Kiểm tra dữ liệu đầu vào
        if not all(key in input_data for key in required_keys):
            return jsonify({"error": "Thiếu dữ liệu đầu vào!"}), 400

        # 🔹 Chuyển đổi dữ liệu sang dạng số
        try:
            features = [float(input_data[key]) for key in required_keys]
        except ValueError:
            return jsonify({"error": "Dữ liệu phải ở dạng số!"}), 400

        # 🔹 Chuẩn hóa dữ liệu
        processed_input = preprocess_input(features)

        # 🔹 Thực hiện dự đoán
        prediction = model.predict(processed_input)[0][0]
        result = {
            "prediction": "Diabetic" if prediction > 0.5 else "Non-Diabetic",
            "confidence": float(prediction)
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ API: Kiểm tra scaler
@app.route("/scaler_info", methods=["GET"])
def scaler_info():
    try:
        mean_values = scaler.mean_.tolist()
        scale_values = scaler.scale_.tolist()
        return jsonify({"mean": mean_values, "scale": scale_values})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)