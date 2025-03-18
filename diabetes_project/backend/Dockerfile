# Sử dụng Python 3.9 làm môi trường chạy
FROM python:3.9

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cài đặt các thư viện cần thiết
RUN pip install --no-cache-dir -r requirements.txt

# Mở cổng 5001 cho Flask API
EXPOSE 5001

# Chạy ứng dụng Flask API
CMD ["python", "app.py"]