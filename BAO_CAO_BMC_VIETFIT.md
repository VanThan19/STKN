# 📄 BÁO CÁO MÔ HÌNH KINH DOANH CANVAS (BUSINESS MODEL CANVAS)
## DỰ ÁN: VIETFIT – NỀN TẢNG THEO DÕI TẬP LUYỆN, PHỤC HỒI & DINH DƯỠNG THÔNG MINH

---

### THÔNG TIN CHUNG
* **Tên dự án:** VietFit (Phát triển & Việt hóa chuyên sâu trên nền mã nguồn mở openGym – Smart Workout, Recovery & Nutrition Platform)
* **Kho mã nguồn dự án:** [https://github.com/VanThan19/STKN.git](https://github.com/VanThan19/STKN.git)
* **Tài liệu báo cáo Word đi kèm:** [`BAO_CAO_BMC_VIETFIT.docx`](./BAO_CAO_BMC_VIETFIT.docx)
* **Phạm vi báo cáo:** Phân tích chuyên sâu **04 trụ cột đầu tiên** của mô hình Business Model Canvas theo cấu trúc chuẩn:
  1. **Customer Segments** *(Khách hàng mục tiêu)*
  2. **Value Propositions** *(Tuyên ngôn giá trị)*
  3. **Channels** *(Kênh phân phối & Kênh truyền thông)*
  4. **Customer Relationships** *(Quan hệ khách hàng: Love & Loyalty)*

---

### SƠ ĐỒ LIÊN KẾT 4 TRỤ CỘT BMC CỦA VIETFIT *(Tham chiếu mô hình đối chiếu đa phân khúc)*

| Phân khúc khách hàng (Customer Segments) | Tuyên ngôn giá trị tương ứng (Value Propositions) | Kênh tiếp cận & phân phối (Channels) | Quan hệ khách hàng (Customer Relationships) |
| :--- | :--- | :--- | :--- |
| **1.1. Người mới & Tự tập tại nhà**<br>*(Home Workout & Beginners)* | • **Onboarding 2 bước** tạo đồng bộ giáo án + thực đơn 7 ngày trong < 1 phút.<br>• **Body Map 3D + Curated Combos 1 chạm**, lọc dụng cụ tại nhà, 5.600+ ảnh động tránh sai form.<br>• **Dinh dưỡng BMR/TDEE/Macro** sẵn thực đơn mẫu, **100% Miễn phí cốt lõi**. | • **Phân phối:** Web PWA (chạy ngay không cần cài), Google Play / App Store.<br>• **Truyền thông:** TikTok/Reels ngắn, Group Tự tập tại nhà, từ khóa tìm kiếm hướng dẫn cho người mới. | • **Self-Service thân thiện:** Tự động hóa thiết lập ban đầu.<br>• **Love:** Không quảng cáo, không ép mua gói VIP, hướng dẫn Tiếng Việt dễ hiểu.<br>• **Loyalty:** Chuỗi ngày tập (Streaks), Thử thách tháng, nhắc giờ tập & giờ ăn. |
| **1.2. Gymer phòng tập phổ thông**<br>*(Intermediate Gymers)* | • **Trợ lý Live Workout:** Tự điền tạ cũ, **Plate Math** chia bánh tạ trực quan, **Rest Timer** tự động.<br>• **Swap Exercise 1 chạm** khi kẹt máy; **Adaptive Schedule** tự dời lịch ngày bận.<br>• **100% Offline-First** dùng mượt trong phòng gym tầng hầm mất sóng 4G. | • **Phân phối:** PWA, App Android/iOS (Capacitor), **Standee mã QR** tại quầy lễ tân phòng gym.<br>• **Truyền thông:** Facebook Fanpage + Group Gym Seeding, video hài/mẹo phòng gym theo từ khóa công cụ. | • **Self-Service tốc độ cao:** Thao tác < 3 giây mỗi hiệp.<br>• **Love:** Trải nghiệm mượt mà không bị pop-up quảng cáo ngắt quãng buổi tập.<br>• **Loyalty:** Progression Engine tăng tạ đều đặn, Weekly Recap tổng kết volume tuần. |
| **1.3. Gymer nâng cao, VĐV & PT**<br>*(Advanced Athletes & Coaches)* | • **Khoa học dữ liệu sâu:** Ước tính 1RM, Structural Balance, **Muscle Recovery Heatmap** & điểm sẵn sàng liên miền *(Tập luyện + Dinh dưỡng)*.<br>• **AI Coach (BYOK/Local Ollama)** phân tích lịch sử & điều chỉnh giáo án.<br>• **Self-Hosted, Passkey FIDO2 & Đồng bộ Wearable** *(Apple Watch, Wear OS, Garmin, Zepp OS)*. | • **Phân phối:** GitHub Open-Source, **Docker Hub / Helm** (Self-host), APK trực tiếp & App Store.<br>• **Truyền thông:** Cộng đồng Fitness chuyên sâu, Tech/HomeLab groups, từ khóa phân tích thể hình & bảo mật. | • **Co-Creation & Toàn quyền dữ liệu:** Tự host, tự xuất/nhập JSON & CSV bất kỳ lúc nào.<br>• **Love:** Cam kết Zero Telemetry, bảo vệ ảnh Body Check & sinh trắc học tuyệt đối.<br>• **Loyalty:** Lịch sử tập dài hạn (Heatmap 365 ngày, 1RM curve), định hướng gói **AI Coach Pro / B2B Gym Hub**. |

---

# CHƯƠNG 1: CUSTOMER SEGMENTS (KHÁCH HÀNG MỤC TIÊU)

VietFit chia thị trường người tập thể chất tại Việt Nam thành **03 nhóm khách hàng mục tiêu (Target Groups)** rõ rệt. Mỗi nhóm được phân tích đầy đủ theo 4 yếu tố: **Customer Persona** *(Chân dung)*, **Observable Behaviors & Survey Insights** *(Hành vi quan sát được & kết quả khảo sát)*, **Painpoints** *(Nỗi đau thực tế — đặc biệt nhấn mạnh yếu tố **tốn thời gian / takes time**)* và **Goals** *(Mục tiêu kỳ vọng)*.

---

## 1.1. Nhóm 1 (TG No.1): Người mới bắt đầu & Tự tập tại nhà *(Home Workout & Beginners)*

### a. Customer Persona *(Chân dung khách hàng)*
* **Độ tuổi:** 18 – 26 tuổi.
* **Nghề nghiệp & Thu nhập:** Học sinh, sinh viên đại học, người mới đi làm; thu nhập trung bình dưới 8 triệu VNĐ/tháng, ngân sách chi cho tập luyện rất hạn chế (< 300.000 VNĐ/tháng).
* **Bối cảnh & Tâm lý:** Thường tự tập tại phòng trọ, nhà riêng hoặc công viên. Có tâm lý tự ti về ngoại hình (quá gầy, thừa cân, bụng mỡ), ngại ánh nhìn tại phòng gym đông người và dễ bị choáng ngợp trước quá nhiều thuật ngữ thể hình bằng tiếng Anh.

### b. Observable Behaviors *(Hành vi quan sát được & Cơ sở khảo sát)*
* **Hành vi quan sát thực tế:**
  * Lướt TikTok, YouTube Shorts, Reels để xem các video "tập bụng 10 phút", "giảm mỡ toàn thân" và tập theo ngẫu hứng, không có chu kỳ hay ghi chép.
  * Dụng cụ rất tối giản: 1 thảm tập, 1 cặp tạ đơn nhẹ (2–5kg) hoặc chỉ tập bằng trọng lượng cơ thể (Bodyweight).
  * Thường bỏ cuộc sau **2 – 3 tuần đầu** do đau mỏi cơ quá mức, tập không đúng nhóm cơ mong muốn hoặc không thấy sự thay đổi cân nặng/vóc dáng.
* **Cơ sở khảo sát định hướng *(Survey Focus)*:** Khảo sát nhanh nhóm sinh viên/nhân viên văn phòng mới tập cho thấy phần lớn từng tải ít nhất 1 app gym nước ngoài nhưng xóa sau vài ngày vì toàn tiếng Anh, bắt trả phí mở khóa giáo án hoặc đề xuất toàn bài máy phòng gym mà ở nhà không có. *(Nhóm có thể chèn tỷ lệ % khảo sát thực tế từ Google Form của lớp vào mục này).*

### c. Painpoints *(Nỗi đau thực tế — Nhấn mạnh yếu tố "Takes Time")*
* **Mất rất nhiều thời gian tìm kiếm & tự lắp ghép lộ trình *(Takes time)*:** Phải mất hàng giờ lướt hàng chục clip rời rạc trên mạng để ghép thành một buổi tập mà vẫn không biết tập bao nhiêu hiệp, nghỉ bao lâu, sắp xếp thứ tự bài tập ra sao.
* **Tốn thời gian tự tính toán dinh dưỡng & thực đơn *(Takes time)*:** Không biết mình cần ăn bao nhiêu calo, bao nhiêu gram đạm mỗi ngày; việc tra cứu bảng thành phần dinh dưỡng từng món ăn để tính TDEE/Macro quá rườm rà nên nhanh chóng bỏ cuộc.
* **Sợ tập sai kỹ thuật dẫn đến chấn thương:** Không hiểu tên bài tập tiếng Anh, không biết động tác đó tác động vào cơ nào, lo đau lưng dưới, đau khớp vai hoặc khớp gối khi tự tập một mình.
* **Rào cản tài chính lớn:** Chi phí thuê Huấn luyện viên cá nhân (PT) dao động 400.000 – 800.000 VNĐ/buổi nằm ngoài khả năng; các ứng dụng quốc tế phổ biến yêu cầu thẻ thanh toán quốc tế với mức phí $50 – $100/năm.

### d. Goals *(Mục tiêu kỳ vọng)*
* Khởi tạo được thói quen vận động đều đặn 3–4 buổi/tuần, cải thiện thể lực, giảm mỡ hoặc tăng cân lành mạnh.
* Có ngay một **lộ trình trọn gói (cả lịch tập tại nhà lẫn thực đơn ăn uống)** thiết lập trong vài chục giây, giao diện Tiếng Việt trực quan, có video/ảnh động hướng dẫn từng động tác và **miễn phí sử dụng các tính năng cốt lõi**.

---

## 1.2. Nhóm 2 (TG No.2): Gymer phòng tập phổ thông *(Intermediate Gymers)*

### a. Customer Persona *(Chân dung khách hàng)*
* **Độ tuổi:** 22 – 35 tuổi.
* **Nghề nghiệp & Thu nhập:** Nhân viên văn phòng, kỹ sư, nhân sự trẻ, người kinh doanh tự do; thu nhập ổn định (10 – 25 triệu VNĐ/tháng), đã có thẻ hội viên tại các phòng gym bình dân hoặc Fitness Center.
* **Kinh nghiệm tập luyện:** Tập liên tục từ **6 tháng đến 2 năm**, nắm được các bài tập nền tảng (*Bench Press, Squat, Deadlift, Lat Pulldown...*) và có ý thức theo đuổi tăng cơ – giảm mỡ bài bản.

### b. Observable Behaviors *(Hành vi quan sát được & Cơ sở khảo sát)*
* **Hành vi quan sát thực tế:**
  * Đi tập đều đặn **3 – 5 buổi/tuần** vào khung giờ cao điểm (17h30 – 20h30 sau giờ làm).
  * Luôn cầm điện thoại suốt buổi tập: ghi tạm mức tạ vào ứng dụng Ghi chú (Notes), chat Zalo hoặc lướt mạng xã hội trong lúc nghỉ giữa hiệp.
  * Khi đến phòng tập đông người, thường phải đi loanh quanh tìm máy trống hoặc đứng chờ người khác tập xong.
* **Cơ sở khảo sát định hướng *(Survey Focus)*:** Quan sát thực tế và khảo sát người tập phổ thông cho thấy thói quen dùng Notes điện thoại hoặc nhớ nhẩm khiến người tập không theo dõi được tiến trình tăng tạ theo tuần; đồng thời mất nhiều phút chết mỗi buổi do quên giờ nghỉ và loay hoay đổi bài khi kẹt máy.

### c. Painpoints *(Nỗi đau thực tế — Nhấn mạnh yếu tố "Takes Time")*
* **Mất thời gian tra cứu lại mức tạ cũ & ghi chép thủ công *(Takes time)*:** Mỗi lần vào bài mới lại phải kéo cuộn ứng dụng Notes tìm xem tuần trước đẩy bao nhiêu kg, bao nhiêu rep, dẫn đến ghi chép lộn xộn hoặc bỏ ghi luôn giữa buổi.
* **Đơ não & tốn thời gian tính nhẩm bánh tạ *(Takes time)*:** Sau hiệp nặng thở dốc, đứng trước đòn Olympic 20kg phải chia nhẩm xem để đạt mức 67.5kg hay 72.5kg cần lắp những bánh 20kg, 10kg, 5kg, 2.5kg, 1.25kg nào cho cân hai bên — rất dễ lắp nhầm gây lệch lực.
* **Lãng phí thời gian vì kẹt máy giờ cao điểm & nghỉ quá giờ *(Takes time)*:** Máy tập yêu thích bị người khác chiếm khiến buổi tập bị đứt mạch, không biết đổi sang bài nào cùng nhóm cơ; lướt điện thoại giữa hiệp không có đồng hồ nhắc khiến thời gian nghỉ kéo dài 4–5 phút làm nguội cơ.
* **Mất thời gian xử lý khi lịch làm việc thay đổi:** Khi đột xuất bận tăng ca hoặc thiếu ngủ/ăn thiếu bữa, không biết nên dời lịch tập sang ngày nào để không trùng nhóm cơ chưa hồi phục.
* **Mất kết nối mạng ở phòng gym tầng hầm:** Nhiều phòng tập đặt tại tầng hầm tòa nhà bị mất sóng 4G/Wi-Fi, khiến các app phụ thuộc server bị treo, không tải được lịch sử hoặc bài tập.

### d. Goals *(Mục tiêu kỳ vọng)*
* Duy trì kỷ luật **Quá tải tăng tiến (Progressive Overload)** đều đặn để bứt phá mức tạ và kích thước cơ bắp.
* Rút ngắn thời gian thao tác trên điện thoại xuống còn vài giây mỗi hiệp; buổi tập diễn ra trơn tru, không bị gián đoạn bởi mất sóng, chờ máy hay tính nhẩm tạ.

---

## 1.3. Nhóm 3 (TG No.3): Gymer nâng cao, Vận động viên & Huấn luyện viên *(Advanced Athletes & Coaches)*

### a. Customer Persona *(Chân dung khách hàng)*
* **Độ tuổi:** 24 – 40 tuổi.
* **Nghề nghiệp & Đặc điểm:** Người tập chuyên sâu trên **2 năm**, vận động viên Powerlifting / Bodybuilding bán chuyên, Huấn luyện viên cá nhân (PT) hoặc người làm công nghệ yêu thích phân tích dữ liệu cá nhân (*Quantified Self*).
* **Thiết bị sử dụng:** Thường trang bị phụ kiện chuyên dụng và thiết bị đeo thông minh (*Apple Watch, Wear OS, Garmin, Amazfit/Zepp OS*).

### b. Observable Behaviors *(Hành vi quan sát được & Cơ sở khảo sát)*
* **Hành vi quan sát thực tế:**
  * Theo dõi chi tiết các chỉ số khoa học: tổng khối lượng tạ (*Volume*), mức độ gắng sức (*RPE / RIR*), ước tính sức mạnh tối đa 1 lần (*1RM*), tỷ lệ cân bằng cơ (*Structural Balance*) và lượng calo/protein nạp vào hằng ngày.
  * Định kỳ chụp ảnh *Body Check* và đo số đo các vòng cơ thể để theo dõi biến đổi hình thể.
  * Có xu hướng dùng nhiều công cụ rời rạc (Excel/Google Sheets cho giáo án, app riêng cho cân nặng, app riêng cho calo, đồng hồ thông minh để bấm giờ).
* **Cơ sở khảo sát định hướng *(Survey Focus)*:** Nhóm tập lâu năm và PT thường phàn nàn rằng các ứng dụng phổ thông quá sơ sài về chỉ số phục hồi/1RM, trong khi các phần mềm chuyên nghiệp lại khóa dữ liệu trên server hãng (vendor lock-in) và thu phí thuê bao cao.

### c. Painpoints *(Nỗi đau thực tế — Nhấn mạnh yếu tố "Takes Time" & Bảo mật)*
* **Tốn nhiều thời gian tổng hợp dữ liệu từ nhiều ứng dụng rời rạc *(Takes time)*:** Phải nhập liệu hoặc đối chiếu thủ công giữa bảng tính giáo án, nhật ký ăn uống và chỉ số mệt mỏi để quyết định hôm nay có nên *Deload* hay giảm tải hay không.
* **Rủi ro quyền riêng tư & mất quyền kiểm soát dữ liệu:** Không muốn hình ảnh vóc dáng (*Progress Photos*), cân nặng, lịch sử sinh trắc học và giáo án độc quyền bị lưu trên đám mây bên thứ ba để khai thác quảng cáo hoặc bị mất nếu dịch vụ đóng cửa.
* **Thiếu công cụ phân tích phục hồi & cân bằng cơ bắp chuyên sâu:** Nhiều app chỉ ghi nhận số set/rep thô mà không tính độ mỏi theo nhóm cơ, không hỗ trợ chu kỳ hóa (*Periodization / Programmes*) hay đồng bộ trực tiếp lên đồng hồ đeo tay.
* **Chi phí bản quyền phần mềm phân tích/quản lý cao:** Đặc biệt với PT tự do hoặc phòng gym nhỏ khi cần công cụ theo dõi chuẩn xác.

### d. Goals *(Mục tiêu kỳ vọng)*
* Sở hữu một **hệ thống hợp nhất (All-in-one)** vừa đo lường sâu *Volume, RPE/RIR, 1RM, Structural Balance, Recovery* vừa liên kết trực tiếp với *Dinh dưỡng* và *Đồng hồ thông minh*.
* **Toàn quyền làm chủ dữ liệu (Self-hosted / Local-first)**, bảo mật sinh trắc học bằng *Passkey*, không quảng cáo, có thể xuất toàn bộ dữ liệu ra file tiêu chuẩn bất kỳ lúc nào.

---

## 1.4. Ma trận Tổng hợp 03 Nhóm Khách Hàng

| Tiêu chí | 1.1. Home & Beginners | 1.2. Intermediate Gymers | 1.3. Advanced, Athletes & PT |
| :--- | :--- | :--- | :--- |
| **Chân dung (Persona)** | 18–26 tuổi, HSSV/Newbie, ngân sách < 300k/tháng | 22–35 tuổi, dân văn phòng/kỹ sư, tập 6 tháng–2 năm | 24–40 tuổi, Lifter > 2 năm, VĐV, PT, người yêu dữ liệu |
| **Hành vi quan sát (Behaviors)** | Tập theo clip TikTok/YouTube ngẫu hứng; hay bỏ cuộc sau 2–3 tuần | Tập 3–5 buổi/tuần; ghi chú Notes; hay lướt điện thoại giữa hiệp | Đo Volume, RPE/RIR, 1RM; dùng Smartwatch; chụp ảnh Body Check |
| **Nỗi đau chính (Painpoints & Takes Time)** | Mất hàng giờ tìm bài tập & tính calo; sợ sai form chấn thương; không đủ tiền thuê PT | Tốn thời gian tìm mức tạ cũ, nhẩm chia bánh tạ, chờ kẹt máy; mất mạng 4G tầng hầm | Tốn công tổng hợp dữ liệu đa app; sợ lộ ảnh/dữ liệu cá nhân; thiếu phân tích phục hồi sâu |
| **Mục tiêu (Goals)** | Lộ trình tập + ăn uống trọn gói trong 1 phút, tập đúng kỹ thuật, miễn phí | Buổi tập trơn tru không ngắt quãng, tăng tạ đều đặn (Progressive Overload) | Làm chủ dữ liệu (Self-hosted), phân tích chuyên sâu & đồng bộ Smartwatch |

---

# CHƯƠNG 2: VALUE PROPOSITIONS (TUYÊN NGÔN GIÁ TRỊ)

Định vị giá trị cốt lõi của VietFit:
> **"VietFit — Trợ lý Tập luyện, Dinh dưỡng & Phục hồi Toàn diện: Cá nhân hóa tức thì, Tiết kiệm thời gian trong phòng tập, 100% Offline & Làm chủ dữ liệu."**

Theo chuẩn cấu trúc BMC, mỗi tính năng (**Function 1 → Function 6**) dưới đây được thiết kế để giải quyết trực tiếp nỗi đau (đặc biệt là các tác vụ **tốn thời gian**) cho từng phân khúc khách hàng tương ứng, kèm minh họa trực quan từ giao diện thực tế của hệ thống.

---

### Bảng Khớp nối Giá trị theo Phân khúc *(Problem – Solution Fit Mapping)*

| Chức năng cốt lõi (Functions) | Nhóm 1.1 *(Beginners & Home)* | Nhóm 1.2 *(Intermediate Gymers)* | Nhóm 1.3 *(Advanced & PT)* | Giá trị mang lại & Tiết kiệm thời gian |
| :--- | :---: | :---: | :---: | :--- |
| **Function 1:** Goal Onboarding 2 bước & Giáo án + Thực đơn 7 ngày | ✅ Trọng tâm | ⭕ Hỗ trợ | ⭕ Hỗ trợ | Rút ngắn thời gian khởi tạo lộ trình từ vài giờ xuống **< 60 giây**. |
| **Function 2:** Bản đồ cơ bắp 3D, 5.600+ bài tập & Combo 1 chạm | ✅ Trọng tâm | ✅ Trọng tâm | ⭕ Tra cứu | Không mất công nhớ tên tiếng Anh, lọc ngay bài đúng cơ & đúng dụng cụ có sẵn. |
| **Function 3:** Trợ lý Live Workout *(Plate Math, Rest Timer, Swap)* | ⭕ Hỗ trợ | ✅ Trọng tâm | ✅ Trọng tâm | Triệt tiêu thời gian tính nhẩm bánh tạ, tìm tạ cũ và chờ máy giờ cao điểm. |
| **Function 4:** Module Dinh dưỡng chuẩn USDA *(BMR, TDEE, Macro, Lịch ăn)* | ✅ Trọng tâm | ✅ Trọng tâm | ✅ Trọng tâm | Loại bỏ việc tính calo thủ công; tự điều chỉnh khẩu phần theo 5 mục tiêu. |
| **Function 5:** Progression Engine, Adaptive Schedule & AI Coach | ⭕ Hỗ trợ | ✅ Trọng tâm | ✅ Trọng tâm | Tự động tăng tạ, phân tích hồi phục, tự dời lịch ngày bận & cảnh báo quá tải. |
| **Function 6:** Offline-First, Self-Hosted, Passkey FIDO2 & Smartwatch | ⭕ Nền tảng | ✅ Trọng tâm | ✅ Trọng tâm | Chạy mượt ở tầng hầm mất 4G, đăng nhập 1 chạm, toàn quyền sở hữu dữ liệu. |

---

## Function 1: Goal Onboarding Wizard 2 Bước — Khởi tạo Đồng bộ Tập luyện & Ăn uống Tức thì
* **Phân khúc phục vụ chính:** **Nhóm 1.1** *(Người mới & Tự tập tại nhà)*
* **Nỗi đau giải quyết:** Người mới tốn hàng ngày trời để tự hỏi "nên tập lịch nào, ăn bao nhiêu calo", dễ bỏ cuộc trước khi bắt đầu.
* **Mô tả chức năng trong hệ thống:**
  * Thông qua quy trình 2 bước ngắn gọn (`GoalOnboardingWizard.jsx` & `starter-onboarding.js`), người dùng chỉ cần chọn 1 trong 5 mục tiêu (*Giảm mỡ nhanh, Giảm mỡ nhẹ, Duy trì sức khỏe, Tăng cơ nạc, Tăng cân tăng sức mạnh*), trình độ kinh nghiệm, số ngày tập/tuần (2–6 ngày) và nhập chiều cao/cân nặng/mục tiêu cân nặng.
  * Hệ thống tự động tính ngay **BMI, BMR, TDEE, Macro (Protein/Carbs/Fat)** và khởi tạo đồng bộ **Giáo án tập chuẩn** (*Full Body, Upper/Lower, PPL, 5×5*) cùng **Thực đơn mẫu 7 ngày** vào tài khoản chỉ với 1 lần bấm.
* **Hình ảnh minh họa *(Pictures illustrate)*:**
  * *Ảnh minh họa thiết kế chiến dịch & giao diện trang chủ khởi tạo lộ trình:* `report_assets/ui_plan_settings.png` & `frontend/public/banners/banner-meal-plan.svg` *(Gợi ý bổ sung ảnh chụp màn hình modal `GoalOnboardingWizard` bước 1 & bước 2 khi xuất bản báo cáo Word).*

## Function 2: Bản đồ Cơ bắp Giải phẫu Tương tác, Kho 5.600+ Bài tập & Bộ lọc Tinh gọn / Combo 1 chạm
* **Phân khúc phục vụ chính:** **Nhóm 1.1** *(Home & Beginners)* & **Nhóm 1.2** *(Intermediate Gymers)*
* **Nỗi đau giải quyết:** Không biết tên tiếng Anh chuyên ngành, bối rối giữa hàng nghìn biến thể bài tập, sợ tập sai kỹ thuật và không có máy móc phòng gym khi tập ở nhà.
* **Mô tả chức năng trong hệ thống:**
  * **Interactive Body Map (`BodyMap.jsx`, `Library.jsx`):** Chạm trực tiếp vào từng nhóm cơ trên mô hình giải phẫu để lọc ra các bài tập tác động đúng vào cơ đó, kèm ảnh động/video mô phỏng kỹ thuật, cơ chính và cơ phụ.
  * **Curated Exercises & Muscle Combo Card (`curated-exercises.js`, `MuscleComboCard.jsx`):** Thay vì để người mới lạc giữa 5.600+ bài tập, VietFit gắn nhãn độ khó (*Người mới / Trung bình / Nâng cao*), loại động tác (*Compound / Isolation / Mobility*), bộ lọc bài **Cốt lõi (Essential)**, ngữ cảnh nhanh (**Quick Scenes**: *Tại nhà / Tạ đơn / Phòng gym*) và đề xuất sẵn **Combo 1 chạm theo từng nhóm cơ** kèm mẹo giữ form an toàn khớp — bấm 1 nút là lưu thành buổi tập hoàn chỉnh.
  * **Hồ sơ thiết bị (Equipment Profile):** Tự động ẩn toàn bộ bài máy móc khi chuyển sang chế độ tập tại nhà hoặc đổi giữa các phòng gym khác nhau.
* **Hình ảnh minh họa *(Pictures illustrate)*:**
  * `report_assets/ui_body_map_exercises.png` *(Giao diện Bản đồ cơ bắp giải phẫu & danh sách 5.600+ bài tập).*
  * *(Gợi ý chụp bổ sung card `MuscleComboCard` và chip lọc Cốt lõi/Quick Scenes trong tab Bài tập).*

## Function 3: Trợ lý Thực chiến Trong Buổi tập *(Plate Math, Rest Timer, Auto-Fill & Swap 1 chạm)*
* **Phân khúc phục vụ chính:** **Nhóm 1.2** *(Intermediate Gymers)* & **Nhóm 1.3** *(Advanced)*
* **Nỗi đau giải quyết:** Tốn thời gian nhớ mức tạ cũ, đơ não tính nhẩm bánh tạ hai bên đòn, lướt điện thoại quên giờ nghỉ và bị gián đoạn khi kẹt máy giờ cao điểm.
* **Mô tả chức năng trong hệ thống:**
  * **Auto-Filled Metrics:** Tự động điền mờ mức tạ và số rep của buổi gần nhất làm mốc tham chiếu cho từng hiệp.
  * **Plate Math Calculator:** Nhập mức tạ mục tiêu (ví dụ `67.5 kg`), hệ thống trừ trọng lượng đòn (Olympic 20kg, EZ bar, Trap bar, Smith machine) dựa trên chính danh sách bánh tạ của phòng gym đang tập và vẽ trực quan số đĩa cần lắp mỗi bên.
  * **Smart Rest Timer:** Tự động đếm ngược thời gian nghỉ ngay khi đánh dấu hoàn thành hiệp, hỗ trợ rung/chuông/nháy màn hình trong phòng gym ồn ào.
  * **Swap Exercise (1 chạm):** Khi máy tập bị chiếm, bấm Đổi bài để chọn ngay bài thay thế tương đương cùng nhóm cơ mà vẫn giữ nguyên số hiệp, số rep của slot tập đó.
  * **Ghi nhận RPE/RIR, Superset, Warm-up ramp, Drop set & PR:** Phát hiện kỷ lục cá nhân mới và quy đổi **1RM** tức thì theo công thức khoa học (Epley / Brzycki).
* **Hình ảnh minh họa *(Pictures illustrate)*:**
  * `report_assets/plate_math_calculator.jpg` *(Công cụ Plate Math tự động chia và vẽ trực quan bánh tạ hai bên đòn).*
  * `report_assets/ui_history_workout.png` *(Màn hình theo dõi buổi tập & lịch sử tập luyện chi tiết).*

## Function 4: Module Quản lý Dinh dưỡng Chuẩn Quốc tế (USDA) & Nhắc Lịch Ăn Uống
* **Phân khúc phục vụ chính:** Cả **3 nhóm** *(1.1 giảm cân/tăng cân tại nhà, 1.2 tối ưu tăng cơ, 1.3 siết/xả cân chuyên sâu)*
* **Nỗi đau giải quyết:** Tốn thời gian cân đo tính toán calo/protein thủ công; phải cài thêm ứng dụng ăn kiêng riêng (như MyFitnessPal) có nhiều quảng cáo và thực đơn không đồng bộ với lịch tập.
* **Mô tả chức năng trong hệ thống (`Nutrition.jsx`, `HomeNutritionHub.jsx`, `nutrition.js`, `foods-data.js`):**
  * **Tính BMR & TDEE tự động:** Áp dụng chuẩn phương trình *Mifflin-St Jeor* kết hợp hệ số vận động và 5 ngưỡng mục tiêu (`cut -500 kcal`, `gentle_cut -300 kcal`, `maintain`, `lean_bulk +250 kcal`, `bulk +450 kcal`).
  * **Nhật ký dinh dưỡng & Cơ sở dữ liệu song ngữ Anh–Việt:** Theo dõi 4 bữa (*Sáng, Trưa, Phụ/Shake, Tối*), lượng nước uống hằng ngày, phân loại thực phẩm chuẩn USDA, tự động **lọc chất gây dị ứng** (sữa, trứng, đậu phộng, hải sản, gluten...).
  * **Áp dụng thực đơn 7 ngày & Nhắc giờ ăn:** Chọn combo bữa ăn cho người mới hoặc áp dụng nhanh thực đơn cả tuần chỉ với 1 chạm, kèm hệ thống nhắc lịch ăn theo khung giờ cấu hình riêng.
* **Hình ảnh minh họa *(Pictures illustrate)*:**
  * `frontend/public/banners/banner-meal-plan.svg` & `frontend/public/banners/banner-whey-pro.svg` *(Minh họa tính năng thực đơn 7 ngày & combo giàu đạm trên HomeNutritionHub — gợi ý chụp bổ sung ảnh màn hình tab `Dinh dưỡng / Nutrition`).*

## Function 5: Động cơ Tăng tiến (Progression Engine), Thích ứng Liên miền (Adaptive Engine) & AI Coach
* **Phân khúc phục vụ chính:** **Nhóm 1.2** *(Intermediate)* & **Nhóm 1.3** *(Advanced Athletes & PT)*
* **Nỗi đau giải quyết:** Tập lâu năm bị chững tạ do không có kế hoạch tăng tải bài bản; tốn công tự tổng hợp dữ liệu giữa lịch tập – dinh dưỡng – sức khỏe để điều chỉnh buổi tập khi bận hoặc mệt mỏi.
* **Mô tả chức năng trong hệ thống:**
  * **Progression Engine & Programmes:** Hỗ trợ *Linear, Double, Triple Progression, Greyskull LP* và chu kỳ hóa *Programmes 1–16 tuần*, tự động đề xuất tăng tạ khi đạt ngưỡng hoặc kích hoạt *Deload* khi chững tạ.
  * **Thống kê & Phục hồi chuyên sâu (`Stats.jsx`):** Bản đồ hồi phục cơ bắp (*Muscle Recovery Heatmap*: Xanh/Vàng/Đỏ theo thời gian phân rã mệt mỏi), đường cong *Estimated 1RM*, *Structural Balance* (tỷ lệ cân bằng cơ), *Activity Heatmap 365 ngày*, biểu đồ cân nặng theo đường mục tiêu và thư viện ảnh *Before/After Slider*.
  * **Cross-Domain Adaptive Engine (`adaptive-schedule.js`, `AdaptiveScheduleCard.jsx`):** Kết nối dữ liệu **Mật độ tập 72h + Năng lượng/Protein từ Module Dinh dưỡng + Ghi chú thể trạng (`sick`/`injury`)** để tính điểm sẵn sàng (**Readiness 0–100**), cho phép tích chọn ngày bận trong tuần để tự động sắp xếp lại lịch tập tối ưu. Mọi thay đổi đều tuân thủ quy trình **User Approval + Undo** (không bao giờ tự ý sửa ngầm).
  * **AI Coach Đa nhiệm (`api/coach/`, `CoachChat.jsx`):** Tạo giáo án, rà soát (review), thích ứng ngay giữa buổi tập khi đau/bận/kẹt máy và trò chuyện hỏi đáp (hỗ trợ cả tạo thực đơn `nutritionPlan` phù hợp dị ứng), chạy an toàn qua bộ kiểm tra hợp lệ (`validate.js`), hỗ trợ kết nối API riêng của người dùng (*Gemini, OpenAI, Anthropic* hoặc *Ollama* chạy local).
* **Hình ảnh minh họa *(Pictures illustrate)*:**
  * `report_assets/ui_admin_coach.png` *(Giao diện quản trị & AI Coach)*.
  * `frontend/public/banners/banner-ai-coach.svg` *(Gợi ý chụp bổ sung ảnh màn hình `AdaptiveScheduleCard` & `Stats` Recovery Heatmap).*

## Function 6: Kiến trúc 100% Offline-First, Self-Hosted, Bảo mật Passkey FIDO2 & Hệ sinh thái Wearable
* **Phân khúc phục vụ chính:** Toàn bộ **3 nhóm**, đặc biệt là **Nhóm 1.2** *(tầng hầm mất sóng)* & **Nhóm 1.3** *(bảo mật & smartwatch)*
* **Nỗi đau giải quyết:** App bị đơ ở phòng gym tầng hầm; nỗi lo bị lộ ảnh vóc dáng và dữ liệu sức khỏe lên máy chủ bên thứ ba; phiền toái khi phải gõ mật khẩu dài bằng tay dính mồ hôi.
* **Mô tả chức năng trong hệ thống:**
  * **Offline-First & Sync Merge thông minh:** Mọi thao tác ghi chép buổi tập và dinh dưỡng được lưu ngay trên thiết bị (`localStorage`), hoạt động hoàn chỉnh không cần Internet và tự động đồng bộ hợp nhất từng trường (*field-level sync merge*) khi có mạng trở lại.
  * **Self-Hosted & Zero Telemetry:** Mã nguồn mở (AGPL-3.0), có thể tự triển khai chỉ với 1 lệnh `docker compose up`, không chứa mã theo dõi hành vi hay quảng cáo. Khi tải ảnh cá nhân, hệ thống tự động xóa thông tin vị trí GPS/EXIF ngay trên thiết bị.
  * **Passkey FIDO2/WebAuthn & Toàn quyền dữ liệu:** Đăng nhập 1 chạm bằng vân tay / Face ID; hỗ trợ Export/Import toàn bộ dữ liệu dạng JSON & CSV, cũng như nhập dữ liệu từ *Hevy, Strong, FitNotes, Apple Health*.
  * **Đồng bộ Thiết bị đeo (Wearables):** Mở rộng trên *Apple Watch (Swift), Wear OS (Kotlin), Garmin Connect IQ (Monkey C), Zepp OS (Amazfit)* cùng tích hợp *Apple Health / Health Connect*.
* **Hình ảnh minh họa *(Pictures illustrate)*:**
  * `report_assets/vietfit_promo_poster.jpg` & `report_assets/ui_plan_settings.png` *(Poster tổng quan tính năng Offline, Passkey, Self-hosted & màn hình cài đặt bảo mật).*

---

# CHƯƠNG 3: CHANNELS (KÊNH PHÂN PHỐI & TRUYỀN THÔNG)

Bám sát cấu trúc 2 nhánh của khối **Channels** trên bảng (*3.1 Distribution Channels* và *3.2 Promotion Channels*), VietFit triển khai đồng bộ kênh phân phối **Trực tiếp / Gián tiếp** và chiến lược truyền thông **16 bài viết tối ưu Từ khóa Tự nhiên (Organic Keywords)** để đạt mốc $\ge 1.000$ người tiếp cận với chi phí quảng cáo bằng 0.

---

## 3.1. Kênh Phân phối Sản phẩm *(Distribution Channels — Direct & Indirect)*

| Nhóm kênh | Hình thức | Kênh phân phối cụ thể | Phân khúc tiếp cận chính | Lợi thế chiến lược |
| :--- | :--- | :--- | :--- | :--- |
| **Kênh Trực tiếp (Direct)** | **Virtual (Web)** | **Web App PWA (Progressive Web App)** | Nhóm 1.1 & 1.2 | Mở trình duyệt là dùng ngay trong 3 giây, cài trực tiếp ra màn hình chính iOS/Android mà không chờ duyệt Store hay tốn dung lượng nặng. |
| **Kênh Trực tiếp (Direct)** | **Virtual (File/Repo)** | **GitHub Repository & File cài đặt APK Android** | Nhóm 1.2 & 1.3 | Tải trực tiếp file APK cho Android hoặc clone mã nguồn để cài đặt/tùy biến ngay cho cộng đồng sinh viên và dân công nghệ. |
| **Kênh Gián tiếp (Indirect)** | **Virtual (App Stores)** | **Google Play Store & Apple App Store** *(qua Capacitor)* | Nhóm 1.1 & 1.2 | Tiếp cận đại chúng theo thói quen tìm kiếm ứng dụng di động chính thống, tận dụng đánh giá sao (ASO) và độ tin cậy của Store. |
| **Kênh Gián tiếp (Indirect)** | **Virtual (Container/Cloud)** | **Docker Hub & Kubernetes / Helm Chart** | Nhóm 1.3 *(Tech / PT / Gym Studio)* | Triển khai server tự lưu trữ (HomeLab, NAS, VPS riêng) chỉ bằng một lệnh Docker, phục vụ cá nhân nâng cao hoặc phòng gym nội bộ. |
| **Kênh Gián tiếp / Điểm chạm (Physical Touchpoint)** | **Physical (Offline)** | **Standee / Bảng mica mã QR tại quầy lễ tân phòng gym** | Nhóm 1.1 & 1.2 | Gymer đến phòng tập quét mã QR ngay tại quầy hoặc khu vực giá tạ để mở Web PWA dùng thử Plate Math & Body Map ngay tại chỗ. |

---

## 3.2. Kênh Truyền thông & Quảng bá *(Promotion Channels: 16 Posts ~ 1.000+ Organic Reach & Keywords)*

### a. Lựa chọn nền tảng truyền thông trọng tâm
* **Kênh chính:** **Facebook (Fanpage chính thức + Seeding các Hội nhóm Gym/Fitness/Sinh viên)** kết hợp **TikTok / Instagram Reels** (tận dụng định dạng video ngắn & photo carousel để kéo hiển thị tự nhiên).
* **Mục tiêu chiến dịch:** Triển khai **16 bài đăng** phân bổ đều theo 4 giai đoạn của phễu **AIDA** (*Awareness → Interest → Decision → Action*), đạt **tổng lượt tiếp cận tự nhiên (Organic Reach) $\ge 1.000$ người** mà không chạy quảng cáo trả phí.

### b. Chiến lược Từ khóa Tự nhiên *(Organic → Keywords Strategy)*
Để bài viết và trang tải ứng dụng được thuật toán tìm kiếm (Facebook Search, TikTok Search, Google Search, GitHub) phân phối tự nhiên đúng tệp khách hàng, toàn bộ 16 bài đăng và mô tả ứng dụng được neo quanh **04 cụm từ khóa tìm kiếm (Search Intent Keywords)**:

1. **Cụm từ khóa Nỗi đau Người mới & Tại nhà *(Nhắm Nhóm 1.1)*:**
   * *Từ khóa:* `tập gym tại nhà cho người mới`, `lịch tập cho người mới`, `cách tính TDEE giảm cân`, `thực đơn tăng cơ giảm mỡ cho sinh viên`, `hướng dẫn tập đúng form`.
   * *Hashtag cốt lõi:* `#TapTaiNha #GiaoAnNguoiMoi #TinhTDEE #GiamMoTangCo #VietFit`
2. **Cụm từ khóa Tiện ích Phòng tập *(Nhắm Nhóm 1.2)*:**
   * *Từ khóa:* `app theo dõi tập gym miễn phí`, `cách tính bánh tạ barbell`, `lịch tập Push Pull Legs`, `app gym dùng offline`, `tăng tiến mức tạ progressive overload`.
   * *Hashtag cốt lõi:* `#AppTapGym #PlateMath #PushPullLegs #TapGymKhoaHoc #GymVietNam`
3. **Cụm từ khóa Dinh dưỡng & AI Thích ứng *(Cập nhật theo module mới)*:**
   * *Từ khóa:* `tính macro tăng cơ`, `thực đơn 7 ngày eat clean`, `AI tạo lịch tập gym`, `quản lý calo miễn phí không quảng cáo`.
   * *Hashtag cốt lõi:* `#DinhDuongTheHinh #MacroTracking #AICoach #ThucDon7Ngay`
4. **Cụm từ khóa Công nghệ, Bảo mật & Mã nguồn mở *(Nhắm Nhóm 1.3)*:**
   * *Từ khóa:* `self-hosted workout tracker`, `passkey fitness app`, `open source gym tracker`, `đo 1RM và hồi phục cơ bắp`.
   * *Hashtag cốt lõi:* `#SelfHosted #PrivacyFirst #OpenSource #Passkey #1RM`

### c. Kế hoạch 16 Bài đăng Chi tiết *(Cập nhật đồng bộ các tính năng mới của dự án)*

| STT | Giai đoạn (Phễu AIDA) | Chủ đề & Tiêu đề bài đăng | Định dạng (Format) | Kênh & Từ khóa trọng tâm | KPI Reach mục tiêu |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **01** | **Awareness** *(Nhận thức)* | **Nỗi ám ảnh ghi chép sổ tay & quên mức tạ cũ trong phòng gym** | Ảnh Meme / Short Video | Fanpage + Group Gym (`app theo dõi tập gym miễn phí`) | 1.500+ |
| **02** | **Awareness** *(Nhận thức)* | **Bài toán khó nhất phòng gym: Đẩy 67.5kg lắp mấy bánh tạ mỗi bên?** | TikTok Photo Carousel + Ảnh | TikTok + Group (`cách tính bánh tạ`, `#PlateMath`) | 2.000+ |
| **03** | **Awareness** *(Nhận thức)* | **Tập 3 tháng không lên cơ: 3 sai lầm từ nghỉ quá lâu đến ăn thiếu đạm** | Infographic kiến thức | Fanpage + Groups (`tăng cơ giảm mỡ`, `#GymTips`) | 1.200+ |
| **04** | **Awareness** *(Nhận thức)* | **Dữ liệu cân nặng & ảnh Body Check của bạn có đang bị app thu thập?** | Infographic so sánh | Fanpage + Tech Group (`privacy first`, `#NoAds`) | 1.000+ |
| **05** | **Interest** *(Quan tâm)* | **Ra mắt VietFit: Trợ lý tập gym & dinh dưỡng Tiếng Việt 100% miễn phí** | Mockup UI + Video giới thiệu | TikTok + Fanpage (`VietFit`, `#MadeInVietnam`) | 1.800+ |
| **06** | **Interest** *(Quan tâm)* | **Thiết lập lộ trình tập + thực đơn 7 ngày trong 60 giây với Onboarding 2 bước** | Video quay màn hình | TikTok + Group Newbie (`lịch tập cho người mới`, `tính TDEE`) | 1.600+ |
| **07** | **Interest** *(Quan tâm)* | **Chạm vào cơ nào — Ra bài tập & Combo người mới cho cơ đó (Body Map 3D)** | Video UI tương tác | TikTok + Seeding Group (`tập gym tại nhà`, `#BodyMap`) | 2.500+ |
| **08** | **Interest** *(Quan tâm)* | **Thử thách phòng gym tầng hầm mất sóng 4G: VietFit vẫn chạy mượt Offline** | Video test thực tế | TikTok + Reels (`app gym dùng offline`) | 1.600+ |
| **09** | **Interest** *(Quan tâm)* | **Tính BMR, TDEE, Macro chuẩn USDA & lọc món dị ứng ngay trong app tập** | Carousel màn hình Nutrition | Fanpage + Group Eat Clean (`tính macro tăng cơ`, `#DinhDuong`) | 1.400+ |
| **10** | **Decision** *(Quyết định)* | **Kẹt máy giờ cao điểm? Đổi bài tương đương 1 chạm với Swap Exercise** | Tiểu phẩm ngắn + UI | TikTok + Seeding Group (`mẹo tập gym`, `#SwapExercise`) | 2.200+ |
| **11** | **Decision** *(Quyết định)* | **Tăng tạ tự động (Progression Engine) & Bản đồ hồi phục cơ Xanh – Vàng – Đỏ** | Đồ họa biểu đồ + UI Stats | Fanpage + Groups (`progressive overload`, `#1RM`) | 1.300+ |
| **12** | **Decision** *(Quyết định)* | **Đột xuất bận việc hay ăn thiếu calo? Adaptive Engine & AI Coach gợi ý dời lịch** | Video demo Adaptive Card | Fanpage + TikTok (`AI tạo lịch tập gym`, `#AICoach`) | 1.200+ |
| **13** | **Decision** *(Quyết định)* | **Đăng nhập 1 chạm bằng Passkey vân tay & tự lưu trữ dữ liệu (Self-Hosted)** | Infographic công nghệ | Fanpage + Group Tech (`self-hosted workout tracker`, `#Passkey`) | 900+ |
| **14** | **Action** *(Hành động)* | **Tặng trọn bộ giáo án Push/Pull/Legs & Combo 1 chạm tích hợp sẵn trong app** | Bài viết Lead Magnet + QR | Seeding 5 Group Gym (`lịch tập Push Pull Legs`) | 3.500+ |
| **15** | **Action** *(Hành động)* | **Minigame "Đoán 1RM & Thử thách 30 ngày kiên trì" nhận cẩm nang dinh dưỡng** | Minigame tương tác comment | Fanpage + TikTok (`tính 1RM`, `#ThuThachGym`) | 2.500+ |
| **16** | **Action** *(Hành động)* | **Tổng kết cột mốc 1.000+ người dùng & Lời cảm ơn cộng đồng đóng góp** | Poster tổng kết thành tích | Toàn bộ các kênh (`#VietFit`, `#GymCommunity`) | 2.000+ |

*Ghi chú hình ảnh bìa truyền thông đã thiết kế sẵn trong repo:* `report_assets/vietfit_promo_poster.jpg` & `report_assets/vietfit_tiktok_cover.jpg`.

---

# CHƯƠNG 4: CUSTOMER RELATIONSHIPS (QUAN HỆ KHÁCH HÀNG)

Học hỏi cách tổ chức quan hệ khách hàng tinh gọn kiểu **Self-Service & Community** (như mô hình Google BMC: hệ thống tự phục vụ thông minh làm nòng cốt, kết hợp hỗ trợ cộng đồng và tùy chọn hỗ trợ chuyên sâu cho nhóm chuyên nghiệp), VietFit thiết kế các chính sách chăm sóc khách hàng xoay quanh **02 trụ cột cốt lõi trên bảng: Tạo Tình cảm (Love) và Xây dựng Lòng trung thành (Loyalty)**, gắn kết xuyên suốt chu trình **Get – Keep – Grow**.

---

## 4.1. Mô hình Vận hành Quan hệ Khách hàng *(Relationship Type)*
* **Tự phục vụ thông minh (Automated Self-Service):** Người dùng tự đăng nhập bằng Passkey, tự khởi tạo giáo án + thực đơn qua *Goal Onboarding Wizard*, tự theo dõi tiến độ và sử dụng *AI Coach / Adaptive Engine* ngay trong ứng dụng mà không cần nhân sự hỗ trợ thủ công.
* **Cộng đồng & Đồng sáng tạo (Community & Co-creation):** Tiếp nhận góp ý bài tập mới, món ăn Việt, bản dịch và phản hồi lỗi trực tiếp qua Fanpage, Group Facebook và GitHub Issues.
* **Hỗ trợ chuyên biệt cho đối tác B2B/PT (Dedicated Support — Định hướng mở rộng):** Hỗ trợ thiết lập không gian tự lưu trữ (*Self-hosted*) hoặc bảng quản lý nhiều học viên cho Huấn luyện viên cá nhân và chủ phòng gym đối tác.

---

## 4.2. Chính sách Xây dựng "LOVE" *(Thiện cảm, Tin tưởng & Yêu thích)*
Mục tiêu của **LOVE** là khiến người dùng có ấn tượng tích cực ngay từ lần chạm đầu tiên *(tương ứng giai đoạn **GET**)* và sẵn sàng giới thiệu bạn bè vì sự tử tế của sản phẩm:

1. **Cam kết 100% Miễn phí cốt lõi & Không Quảng cáo Rác (Zero Ads):**
   * Tuyệt đối không chèn video quảng cáo pop-up giữa hiệp tập, không khóa sau tường thu phí (*paywall*) các tính năng thiết yếu như ghi chép tạ, *Plate Math*, *Rest Timer* hay *Nutrition logging*.
2. **Tôn trọng Quyền riêng tư Tuyệt đối (Privacy-First & Zero Telemetry):**
   * Dữ liệu cân nặng, số đo các vòng và ảnh *Progress Photos* thuộc quyền sở hữu hoàn toàn của người dùng; tự động xóa dữ liệu định vị EXIF trước khi lưu ảnh; không bán hay chia sẻ dữ liệu sức khỏe cho bên quảng cáo.
3. **Thấu hiểu & Xóa bỏ Rào cản Cho Người Mới (Beginner Empathy):**
   * Giao diện **100% Tiếng Việt** tự nhiên, kết hợp *Goal Onboarding 2 bước* và *Muscle Combo 1 chạm* giúp người mới có ngay lộ trình dễ hiểu chỉ trong 1 phút, không bị bỏ rơi giữa kho 5.600 bài tập.
4. **Minh bạch & Tôn trọng Quyền kiểm soát của Người tập (Human-in-the-loop):**
   * *Cross-Domain Adaptive Engine* và *AI Coach* chỉ đưa ra **đề xuất kèm lý do rõ ràng** (ví dụ: thiếu ngủ, ăn thiếu đạm hoặc bận việc) và luôn chờ người dùng bấm **Duyệt (Approve)**, kèm nút **Hoàn tác (Undo)** bất kỳ lúc nào — tạo cảm giác có một người bạn đồng hành đáng tin cậy thay vì bị máy móc áp đặt.

---

## 4.3. Chính sách Xây dựng "LOYALTY" *(Giữ chân, Thói quen & Gắn bó dài hạn)*
Mục tiêu của **LOYALTY** là biến VietFit thành thói quen không thể thiếu mỗi ngày *(giai đoạn **KEEP**)* và mở rộng giá trị vòng đời cộng đồng *(giai đoạn **GROW**)*:

1. **Cơ chế Tạo thói quen & Gamification (Habit Loop):**
   * **Workout Streaks & Monthly Challenges:** Ghi nhận chuỗi ngày tập đều đặn và các thử thách tháng tự động ngay tại màn hình Trang chủ để tạo động lực duy trì kỷ luật.
   * **Nhắc nhở Thông minh Đa chiều:** Nhắc lịch tập khi bỏ quá lịch dự kiến (*Smart Workout Nudge*), nhắc giờ ăn theo lịch 4 bữa/ngày (*Meal Schedule Reminders*) và nhắc lịch tập theo địa điểm phòng gym (*Gym Reminder*, tùy chọn bật/tắt).
2. **Tích lũy Giá trị Dữ liệu Cá nhân nhưng KHÔNG Khóa Người dùng (Zero Lock-in Loyalty):**
   * Càng dùng lâu, người dùng càng sở hữu kho tài sản cá nhân vô giá: *Activity Heatmap 365 ngày, biểu đồ 1RM, Structural Balance, Muscle Recovery, chuỗi cân nặng & thanh trượt Before/After*.
   * Ngược lại với các app khóa dữ liệu để ép trả tiền, VietFit cho phép **Xuất / Nhập toàn bộ dữ liệu (JSON / CSV)** bất cứ lúc nào — chính sự tự do và minh bạch này tạo ra **lòng trung thành bền vững** cao nhất.
3. **Đồng hành Thích ứng Dài hạn (Weekly Recap & Adaptive Support):**
   * Tổng kết khối lượng tập và xu hướng dinh dưỡng hằng tuần giúp người dùng nhìn thấy thành quả rõ rệt; đồng thời hỗ trợ điều chỉnh lịch tập khi bận rộn hoặc ốm/chấn thương nhẹ để không bị đứt gãy động lực dài hạn.
4. **Phát triển Cộng đồng & Lộ trình Mở rộng (Grow & Community Loyalty):**
   * **Thử thách Cộng đồng 30 ngày & Member-Get-Member:** Khuyến khích người tập chia sẻ biểu đồ tiến độ/kỷ lục 1RM lên Group để nhận quà hoặc mở khóa huy hiệu thành tích.
   * **Đồng sáng tạo kho bài tập & món ăn Việt:** Người dùng có thể tự tạo bài tập/món ăn riêng và đề xuất đóng góp vào kho chung của cộng đồng.
   * **Định hướng nâng cấp tự nguyện cho nhóm chuyên sâu:** Gói mở rộng tiện ích đám mây/AI Coach Pro (cho người không muốn tự quản lý API key) hoặc giải pháp quản trị học viên dành cho PT/Phòng gym đối tác (*VietFit Gym Hub*), trong khi vẫn giữ vững lời hứa miễn phí cốt lõi cho người dùng cá nhân.

---

### Bảng Ma trận Tổng hợp Chính sách Quan hệ Khách hàng *(Love & Loyalty ↔ Get – Keep – Grow)*

| Trục giá trị | Giai đoạn | Chính sách & Cơ chế trong VietFit | Tác động tâm lý khách hàng | Chỉ số đo lường (KPI) |
| :--- | :---: | :--- | :--- | :--- |
| **LOVE** *(Thiện cảm & Tin cậy)* | **GET** | • Miễn phí cốt lõi & **Zero Ads**<br>• **Onboarding 2 bước** ra lịch tập + thực đơn 7 ngày trong 1 phút<br>• **Privacy-First**, xóa EXIF ảnh, **Passkey FIDO2**<br>• Giao diện 100% Tiếng Việt, mẹo tập an toàn khớp | Cảm thấy được giúp đỡ thật lòng, không bị "lùa gà" trả phí, an tâm về dữ liệu cá nhân, dễ bắt đầu ngay | Lượt truy cập/cài đặt mới, Reach bài viết ($\ge 1.000$), Tỷ lệ hoàn tất Onboarding |
| **LOYALTY** *(Gắn bó & Trung thành)* | **KEEP** | • **Workout Streaks**, Thử thách tháng & Nhắc giờ ăn/giờ tập<br>• **Adaptive Schedule + Undo** giữ nhịp tập khi bận/mệt<br>• Hệ thống biểu đồ **1RM, Heatmap 365 ngày, Before/After**<br>• Tự do **Export/Import JSON & CSV** (không khóa dữ liệu) | Hình thành thói quen tập đều 3–5 buổi/tuần, thấy rõ tiến bộ bản thân và gắn bó lâu dài với hệ dữ liệu cá nhân | Tỷ lệ giữ chân sau 30 ngày (**Retention Rate > 45%**), Tần suất mở app **3–5 lần/tuần** |
| **LOVE + LOYALTY** *(Lan tỏa & Đồng hành)* | **GROW** | • Thử thách cộng đồng 30 ngày & chia sẻ thành tích<br>• Cộng đồng đóng góp bài tập/món ăn Việt<br>• Hướng mở rộng **AI Coach Pro / Self-hosted PT Hub** | Tự hào giới thiệu VietFit cho bạn tập cùng phòng gym, đồng hành phát triển sản phẩm Việt | Tỷ lệ giới thiệu tự nhiên (**Referral Rate**), Số đóng góp/feedback cộng đồng |
