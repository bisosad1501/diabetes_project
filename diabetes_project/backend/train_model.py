from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import matplotlib.pyplot as plt

# ✅ Tạo mô hình Deep Learning tối ưu hơn
def create_model():
    model = Sequential([
        Dense(128, activation="relu", input_shape=(X_train.shape[1],)),
        BatchNormalization(),
        Dropout(0.3),  # Tăng Dropout để tránh overfitting
        Dense(64, activation="relu"),
        BatchNormalization(),
        Dropout(0.3),
        Dense(32, activation="relu"),
        Dense(16, activation="relu"),
        Dense(1, activation="sigmoid")
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), 
                  loss="binary_crossentropy", 
                  metrics=["accuracy"])
    return model

# ✅ Thêm callbacks để tối ưu hóa huấn luyện
early_stopping = EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=5)

# ✅ Huấn luyện mô hình với callbacks
model = create_model()
history = model.fit(X_train, y_train, 
                    epochs=150, batch_size=16, 
                    validation_data=(X_test, y_test),
                    callbacks=[early_stopping, reduce_lr])

# ✅ Lưu mô hình & scaler
model.save("diabetes_model.keras")
joblib.dump(scaler, "scaler.pkl")

# ✅ Vẽ biểu đồ Accuracy & Loss
plt.figure(figsize=(12,5))
plt.subplot(1,2,1)
plt.plot(history.history["accuracy"], label="Train Accuracy")
plt.plot(history.history["val_accuracy"], label="Validation Accuracy")
plt.legend()
plt.title("Training & Validation Accuracy")

plt.subplot(1,2,2)
plt.plot(history.history["loss"], label="Train Loss")
plt.plot(history.history["val_loss"], label="Validation Loss")
plt.legend()
plt.title("Training & Validation Loss")
plt.show()

print("✅ Mô hình đã được cải thiện và lưu!")