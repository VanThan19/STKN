# 📑 BÁO CÁO TỔNG HỢP HỆ THỐNG VIETFIT (OPENGYM)
**Hệ thống theo dõi tập luyện thể hình & thể chất cá nhân (Self-Hosted Workout & Fitness Tracker)**

---

## CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI

### 1.1. Đặt vấn đề & Tính cấp thiết
Hiện nay, nhu cầu rèn luyện thể chất và tập thể hình (Gym & Fitness) ngày càng phổ biến. Tuy nhiên, hầu hết các ứng dụng di động thương mại trên thị trường (như Hevy, Strong, MyFitnessPal,...) đều tồn tại các hạn chế lớn:
* **Chi phí cao:** Yêu cầu người dùng trả phí thuê bao định kỳ (subscription) theo tháng/năm mới mở khóa các tính năng phân tích nâng cao.
* **Xâm phạm quyền riêng tư:** Dữ liệu cá nhân, thể trạng, lịch trình và thói quen sinh hoạt của người dùng bị lưu trữ trên máy chủ tập trung của bên thứ ba, thường xuyên bị khai thác để quảng cáo hoặc phân tích hành vi.
* **Phụ thuộc kết nối mạng:** Nhiều ứng dụng không thể hoạt động hoặc bị hạn chế chức năng khi người dùng ở trong các tầng hầm phòng gym mất sóng 4G/Wi-Fi.
* **Nguy cơ mất dữ liệu:** Khi công ty cung cấp dịch vụ đóng cửa máy chủ, toàn bộ lịch sử tập luyện nhiều năm của người dùng sẽ biến mất.

### 1.2. Mục tiêu của đề tài
Xây dựng hệ sinh thái ứng dụng **VietFit (openGym)** – một giải pháp theo dõi tập thể hình và thể chất toàn diện, hiện đại với triết lý:
1. **Self-hosted & Privacy-first:** Người dùng hoàn toàn làm chủ dữ liệu của mình, tự lưu trữ dữ liệu tại máy cá nhân hoặc máy chủ riêng, không có bất kỳ mã theo dõi (telemetry) hay quảng cáo nào.
2. **Offline-first:** Ứng dụng hoạt động mượt mà ngay cả khi không có mạng, dữ liệu tự đồng bộ ngầm khi kết nối lại.
3. **Khoa học & Giải phẫu chuyên sâu:** Tích hợp bản đồ giải phẫu cơ bắp tương tác và các thuật toán thể thao chuyên sâu (Progression Engine, Plate Calculator, Estimated 1RM, Recovery Model).
4. **Đa nền tảng:** Hỗ trợ từ Web (PWA), Di động (Android & iOS) đến các thiết bị đồng hồ thông minh (Apple Watch, Wear OS, Garmin, Zepp OS).

---

## CHƯƠNG 2: PHÂN TÍCH YÊU CẦU HỆ THỐNG

### 2.1. Yêu cầu chức năng (Functional Requirements)

1. **Phân hệ Lập kế hoạch & Thiết kế giáo án (Planning & Routines):**
   * Lên lịch tập theo các ngày cố định trong tuần hoặc chu kỳ luân phiên (Rotation A, B, C...).
   * Cung cấp các giáo án kinh điển: *Push/Pull/Legs, Upper/Lower, Full Body, 5×5*.
   * Bản đồ cơ bắp thu nhỏ (Mini Body Map) cho từng buổi tập để nhận biết nhóm cơ mục tiêu.
   * Cấu hình bài tập: Số hiệp, số rep, mức tạ mục tiêu, ghép cặp **Superset**, hiệp khởi động tự động (**Warm-up ramp**), hiệp giảm tải (**Drop set**).
   * Gắn các quy tắc tăng tiến mức tạ thông minh (**Progression Engine**).

2. **Phân hệ Theo dõi buổi tập thời gian thực (Live Workout Tracking):**
   * Tự động điền mức tạ và số rep của buổi tập trước làm gợi ý tham chiếu.
   * Đồng hồ đếm ngược thời gian nghỉ (**Rest Timer**) tự động kích hoạt sau mỗi hiệp tập.
   * Công cụ tính toán chia bánh tạ (**Plate Math Calculator**) hỗ trợ đòn Olympic, đòn EZ, đòn Trap bar, khung Smith.
   * Thay thế bài tập linh hoạt (**Swap Exercise**) cùng nhóm cơ với 1 chạm khi máy tập phòng gym bị kẹt người.
   * Ghi nhận nỗ lực tập luyện (**RPE / RIR**), thông báo kỷ lục cá nhân mới (**PR / 1RM**).

3. **Phân hệ Thư viện bài tập & Bản đồ cơ học (Library & Body Map):**
   * Cơ sở dữ liệu hơn **5.600 bài tập** chuẩn hóa kèm ảnh động/video hướng dẫn động tác.
   * Bản đồ giải phẫu cơ bắp tương tác: Chạm vào bất kỳ cơ nào trên cơ thể để lọc ra bài tập tác động đến cơ đó.
   * Hồ sơ thiết bị (Equipment Profile): Lọc bài tập tương ứng với thiết bị sở hữu (Phòng Gym, Tại nhà, Tạ đơn,...).
   * Tạo bài tập cá nhân (Custom Exercise) kèm ảnh/video riêng (tự động xóa metadata EXIF/vị trí GPS).

4. **Phân hệ Thống kê & Quản lý thể trạng (Analytics & Progress):**
   * Bản đồ hồi phục cơ bắp (**Fatigue & Muscle Recovery Map**): Dự đoán nhóm cơ đã phục hồi hoặc cần nghỉ.
   * Biểu đồ sức mạnh 1RM ước tính (**Estimated 1RM**).
   * Biểu đồ nhiệt hoạt động 365 ngày (**Activity Heatmap**) theo dõi tính kỷ luật.
   * Biểu đồ biến thiên cân nặng so với đường mục tiêu (Target line).
   * Lưu trữ số đo các vòng cơ thể và thư viện ảnh vóc dáng với thanh trượt so sánh trước/sau (**Before/After slider**).

5. **Phân hệ Trợ lý ảo & Thiết bị thông minh (AI Coach & Smartwatch):**
   * AI Coach hỗ trợ thích ứng giáo án khi người tập bị đau cơ hoặc thiếu thiết bị.
   * Ứng dụng mở rộng trên Apple Watch, Wear OS (Galaxy Watch/Pixel Watch), Garmin và Zepp OS.

6. **Phân hệ Quản trị & Hệ thống (Admin & System):**
   * Xác thực bảo mật bằng **Passkey (FIDO2 / WebAuthn)**, không lưu mật khẩu dạng văn bản.
   * Hỗ trợ đa ngôn ngữ (bao gồm gói ngôn ngữ Tiếng Việt).
   * Xuất / Nhập toàn bộ dữ liệu dự phòng dạng file JSON (`Export / Import Backup`).

### 2.2. Yêu cầu phi chức năng (Non-Functional Requirements)
* **Tính sẵn sàng & Offline (Offline-first):** Toàn bộ giao diện và dữ liệu hoạt động mượt mà không cần internet; tự động đồng bộ khi có kết nối mạng (Sync merge 409 retry).
* **Hiệu năng & Tối ưu hóa:** Sử dụng React 19 và Zustand giúp ứng dụng cực nhẹ, render tức thì, không bị giật lag; kích thước bundle nhỏ.
* **Bảo mật & Quyền riêng tư:** Mã nguồn mở AGPL-3.0; không thu thập dữ liệu hành vi người dùng (Zero telemetry/tracking); lưu trữ cục bộ bảo mật.
* **Khả năng tương thích:** Đáp ứng tốt trên mọi kích thước màn hình từ Desktop, Tablet đến Smartphone (Responsive Design & Mobile PWA).

---

## CHƯƠNG 3: KIẾN TRÚC KỸ THUẬT & CÔNG NGHỆ

### 3.1. Ngôn ngữ & Công nghệ sử dụng
1. **Frontend:**
   * **Ngôn ngữ:** JavaScript hiện đại (ES Modules, JSX thuần túy, không dùng TypeScript để tối giản build time).
   * **Framework:** **React 19**, bundler **Vite**.
   * **State Management:** **Zustand** (lưu trữ tập trung, tự động lưu xuống `localStorage` và đồng bộ ngầm lên server).
   * **Đa nền tảng:** **Capacitor** đóng gói thành ứng dụng native cho Android và iOS.
2. **Backend:**
   * **Ngôn ngữ:** **Node.js** (chạy trên module chuẩn `node:http`, không dùng framework trung gian như Express giúp tăng tối đa tốc độ xử lý và giảm nhẹ RAM).
   * **Xác thực:** `@simplewebauthn/server` (tiêu chuẩn FIDO2 WebAuthn).
   * **Lưu trữ dữ liệu:** Lưu trữ trực tiếp dạng các tệp JSON cấu trúc theo từng người dùng (File-based JSON storage) kèm cơ chế ghi bền vững chống mất dữ liệu (`durable.js`).
3. **Nền tảng Thiết bị đeo (Wearables):**
   * **Swift:** Dành cho ứng dụng Apple Watch (`WatchCore`, `WatchWidgets`).
   * **Kotlin / Jetpack Compose:** Dành cho đồng hồ Android Wear OS.
   * **Monkey C:** Dành cho đồng hồ Garmin Connect IQ.
   * **JavaScript:** Dành cho hệ điều hành Zepp OS (Amazfit).
4. **Triển khai & Môi trường:**
   * Docker & Docker Compose (Container `web` đóng vai trò Nginx phục vụ frontend & media, Container `api` xử lý backend).
   * Hỗ trợ triển khai trên Kubernetes và Helm chart.

---

## CHƯƠNG 4: CÁC THUẬT TOÁN & NGHIỆP VỤ CỐT LÕI

### 4.1. Thuật toán tăng tiến mức tạ (Progression Engine)
Hệ thống cài đặt các chiến lược tăng tải khoa học trong thể thao:
* **Linear Progression:** Tự động cộng một lượng tạ cố định (ví dụ: +2.5kg cho bài thân trên, +5kg cho bài thân dưới) khi hoàn thành đủ số hiệp và rep của buổi trước.
* **Double Progression:** Cố định mức tạ, yêu cầu người tập tăng số rep cho đến khi chạm cận trên của dải mục tiêu (ví dụ: dải 8-12 reps; khi đạt 12 reps ở toàn bộ các hiệp mới tăng mức tạ lên và quay về mốc 8 reps).
* **Greyskull LP:** Tích hợp hiệp cuối cùng chạm ngưỡng thất bại (AMRAP - As Many Reps As Possible). Nếu vượt số rep tối thiểu sẽ tăng tạ nhanh hơn; nếu thất bại 3 buổi liên tiếp hệ thống tự kích hoạt chu kỳ giảm tải (**Deload** giảm 10% tạ).

### 4.2. Thuật toán tính toán bánh tạ (Plate Math Algorithm)
* **Bài toán:** Cho mức tạ mục tiêu $W$, khối lượng thanh đòn $W_{bar}$ (thường là 20kg), và danh sách các bánh tạ hiện có trong phòng gym $P = [25, 20, 15, 10, 5, 2.5, 1.25]$.
* **Xử lý:**
  $$\text{Tạ mỗi bên đòn} = \frac{W - W_{bar}}{2}$$
* Thuật toán tham lam (Greedy Algorithm) kết hợp bảng cấu hình thiết bị để chọn tổ hợp bánh tạ có số lượng đĩa ít nhất và cân đối hai bên đòn.

### 4.3. Thuật toán ước tính sức mạnh 1RM (One Rep Max)
Sử dụng công thức kinh điển để quy đổi mức tạ $w$ nâng được $r$ lần về mức tạ tối đa có thể nâng 1 lần duy nhất ($r \le 10$):
* **Công thức Epley:**
  $$1RM = w \times \left(1 + \frac{r}{30}\right)$$
* **Công thức Brzycki:**
  $$1RM = w \times \frac{36}{37 - r}$$

### 4.4. Mô hình tính toán hồi phục cơ bắp (Fatigue & Muscle Recovery Model)
Dựa trên khối lượng tập luyện (Volume = Số hiệp $\times$ Số lần $\times$ Mức tạ), chỉ số RPE/RIR và thời gian nghỉ tính từ buổi tập gần nhất. Mỗi nhóm cơ được gán hằng số thời gian phân rã mệt mỏi (Fatigue Half-life: nhóm cơ lớn như Đùi/Lưng cần 48-72 giờ, nhóm cơ nhỏ như Tay/Bụng cần 24-48 giờ) để tô màu trên bản đồ cơ thể theo 3 trạng thái:
* **Xanh lá (Recovered):** Cơ đã hồi phục hoàn toàn, sẵn sàng nhận kích thích mới.
* **Vàng (Recovering):** Cơ đang trong giai đoạn hồi phục, có thể tập nhẹ.
* **Đỏ (Fatigued):** Cơ bị mỏi nghiêm trọng, cần nghỉ ngơi để tránh quá tải chấn thương.

---

## CHƯƠNG 5: ĐÁNH GIÁ KẾT QUẢ & KẾT LUẬN

### 5.1. Kết quả đạt được
1. Đã triển khai và làm chủ toàn bộ hệ thống VietFit (openGym) từ Frontend đến Backend trên môi trường thực tế.
2. Đã tích hợp thành công gói ngôn ngữ **Tiếng Việt (`vi.js`)** cho toàn bộ các màn hình chính của ứng dụng.
3. Ứng dụng đáp ứng đầy đủ chu trình khép kín: Lên lịch giáo án ➡️ Thực hiện buổi tập trực tiếp ➡️ Phân tích thể trạng và tiến độ.
4. Đảm bảo triết lý bảo mật, tôn trọng quyền riêng tư (Self-hosted) và hoạt động mượt mà offline.

### 5.2. Hướng phát triển trong tương lai
* Mở rộng thêm gói bài tập tiếng Việt chuyên biệt cho các bài tập thể thao đường phố (Calisthenics).
* Tích hợp sâu hơn mô hình trí tuệ nhân tạo AI Coach bằng các mô hình mã nguồn mở chạy trực tiếp tại cục bộ (Local LLM qua Ollama).
* Tối ưu hóa giao diện ứng dụng trên các thiết bị máy tính bảng (iPad / Android Tablet) để lắp đặt cố định tại các phòng tập thể hình chuyên nghiệp.
