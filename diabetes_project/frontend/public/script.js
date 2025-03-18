document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predict-form');
    const resultElement = document.getElementById('result');
    
    // Check if we have the prediction card elements
    const predictionCard = document.getElementById('prediction-result');
    const loadingSpinner = document.getElementById('loading-spinner');
    const diagnosisElement = document.getElementById('diagnosis');
    const confidenceElement = document.getElementById('confidence');
    const riskIndicator = document.getElementById('risk-indicator');
    const adviceElement = document.getElementById('advice');
    
    // Using the new UI or the simple one
    const useNewUI = predictionCard && loadingSpinner && diagnosisElement && confidenceElement;

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Ngăn chặn load lại trang

        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = parseFloat(value); // Chuyển đổi sang số
        });

        console.log("📌 Dữ liệu gửi đến API:", data); // Kiểm tra dữ liệu

        // Show loading if available
        if (useNewUI) {
            loadingSpinner.style.display = 'block';
            if (predictionCard) predictionCard.style.display = 'none';
        }

        try {
            // Try local API first (relative URL)
            const response = await fetch("/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log("📌 Kết quả từ API:", result); // Debug response từ API

            if (result.error) {
                if (resultElement) {
                    resultElement.innerText = `❌ Lỗi: ${result.error}`;
                    resultElement.className = 'result-positive'; // Add error styling
                }
            } else {
                // Handle the result for the simple UI
                if (resultElement) {
                    resultElement.innerText = `Dự đoán: ${result.prediction}, Độ tự tin: ${(result.confidence * 100).toFixed(2)}%`;
                    resultElement.className = result.prediction === 'Diabetic' ? 'result-positive' : 'result-negative';
                }
                
                // Handle the result for the new UI
                if (useNewUI) {
                    // Hide loading spinner
                    loadingSpinner.style.display = 'none';
                    
                    // Display results card
                    predictionCard.style.display = 'block';
                    
                    // Set diagnosis
                    if (result.prediction === 'Diabetic') {
                        diagnosisElement.textContent = 'Có khả năng mắc tiểu đường';
                        diagnosisElement.style.color = '#e74c3c';
                    } else {
                        diagnosisElement.textContent = 'Không có dấu hiệu tiểu đường';
                        diagnosisElement.style.color = '#2ecc71';
                    }
                    
                    // Set confidence
                    const confidencePercent = (result.confidence * 100).toFixed(2);
                    confidenceElement.textContent = `${confidencePercent}%`;
                    
                    // Set risk indicator
                    riskIndicator.style.width = `${result.confidence * 100}%`;
                    if (result.confidence < 0.3) {
                        riskIndicator.className = 'risk-level low-risk';
                    } else if (result.confidence < 0.7) {
                        riskIndicator.className = 'risk-level medium-risk';
                    } else {
                        riskIndicator.className = 'risk-level high-risk';
                    }
                    
                    // Set advice
                    if (adviceElement) {
                        if (result.prediction === 'Diabetic') {
                            adviceElement.textContent = 'Nên tham khảo ý kiến bác sĩ để có chẩn đoán chính xác.';
                        } else {
                            adviceElement.textContent = 'Duy trì lối sống lành mạnh và kiểm tra định kỳ.';
                        }
                    }
                }
            }
        } catch (error) {
            console.error("❌ Lỗi khi gửi request:", error);
            
            if (resultElement) {
                resultElement.innerText = "Lỗi kết nối đến server!";
                resultElement.className = 'result-positive';
            }
            
            if (useNewUI) {
                loadingSpinner.style.display = 'none';
            }
        }
    });

    // Optional: Add functions for model_info and scaler_info if those elements exist
    const modelInfoElement = document.getElementById('model-info');
    const scalerInfoElement = document.getElementById('scaler-info');
    
    if (modelInfoElement) {
        fetchModelInfo();
    }
    
    if (scalerInfoElement) {
        fetchScalerInfo();
    }

    // ✅ Hàm lấy thông tin Model
    async function fetchModelInfo() {
        try {
            const response = await fetch("/model_info");
            const data = await response.json();
            if (modelInfoElement) {
                modelInfoElement.innerText = JSON.stringify(data, null, 2);
            }
        } catch (error) {
            console.error("❌ Lỗi lấy thông tin model:", error);
            if (modelInfoElement) {
                modelInfoElement.innerText = "Lỗi lấy thông tin model!";
            }
        }
    }

    // ✅ Hàm lấy thông tin Scaler
    async function fetchScalerInfo() {
        try {
            const response = await fetch("/scaler_info");
            const data = await response.json();
            if (scalerInfoElement) {
                scalerInfoElement.innerText = JSON.stringify(data, null, 2);
            }
        } catch (error) {
            console.error("❌ Lỗi lấy thông tin scaler:", error);
            if (scalerInfoElement) {
                scalerInfoElement.innerText = "Lỗi lấy thông tin scaler!";
            }
        }
    }
});