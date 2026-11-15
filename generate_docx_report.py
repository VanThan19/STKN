# -*- coding: utf-8 -*-
import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_full_report():
    doc = Document()
    
    # Page setup: Margins 1 inch
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
        # Header & Footer
        footer = section.footer
        p_ft = footer.paragraphs[0]
        p_ft.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_ft = p_ft.add_run("Báo cáo Mô hình Kinh doanh VietFit | Trang ")
        r_ft.font.size = Pt(9)
        r_ft.font.color.rgb = RGBColor(128, 128, 128)
        # Add page number
        fldSimple = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
        p_ft._p.append(fldSimple)
        
    def set_cell_bg(cell, hex_color):
        tc_pr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        tc_pr.append(shd)

    def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
        tc_pr = cell._tc.get_or_add_tcPr()
        tc_mar = parse_xml(
            f'<w:tcMar {nsdecls("w")}>'
            f'<w:top w:w="{top}" w:type="dxa"/>'
            f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
            f'<w:left w:w="{left}" w:type="dxa"/>'
            f'<w:right w:w="{right}" w:type="dxa"/>'
            f'</w:tcMar>'
        )
        tc_pr.append(tc_mar)

    def style_table(table, col_widths, headers, data, header_bg="1B4F72", alt_bg="F2F4F4"):
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        # Header row
        hdr_cells = table.rows[0].cells
        for i, h_text in enumerate(headers):
            hdr_cells[i].text = h_text
            set_cell_bg(hdr_cells[i], header_bg)
            set_cell_margins(hdr_cells[i], top=140, bottom=140, left=150, right=150)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.bold = True
                r.font.size = Pt(10)
                r.font.color.rgb = RGBColor(255, 255, 255)
                
        # Data rows
        for r_idx, row_data in enumerate(data):
            row_cells = table.add_row().cells
            bg = alt_bg if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, val in enumerate(row_data):
                row_cells[c_idx].text = str(val)
                set_cell_bg(row_cells[c_idx], bg)
                set_cell_margins(row_cells[c_idx], top=100, bottom=100, left=120, right=120)
                p = row_cells[c_idx].paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for r in p.runs:
                    r.font.size = Pt(9.5)
                    r.font.color.rgb = RGBColor(40, 40, 40)
                    
        # Apply column widths
        for row in table.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = width

    def add_h1(text):
        h = doc.add_heading(text, level=1)
        r = h.runs[0]
        r.font.size = Pt(18)
        r.font.bold = True
        r.font.color.rgb = RGBColor(27, 79, 114) # Navy Blue
        h.paragraph_format.space_before = Pt(20)
        h.paragraph_format.space_after = Pt(8)
        return h

    def add_h2(text):
        h = doc.add_heading(text, level=2)
        r = h.runs[0]
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = RGBColor(41, 128, 185) # Blue
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(6)
        return h

    def add_h3(text):
        h = doc.add_heading(text, level=3)
        r = h.runs[0]
        r.font.size = Pt(11.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(39, 174, 96) # Emerald Green
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(4)
        return h

    def add_p(text, bold_prefix="", italic=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.font.bold = True
            rb.font.size = Pt(10.5)
            rb.font.color.rgb = RGBColor(33, 33, 33)
        r = p.add_run(text)
        r.font.size = Pt(10.5)
        r.font.italic = italic
        r.font.color.rgb = RGBColor(45, 45, 45)
        return p

    def add_bullet(text, bold_prefix=""):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.font.bold = True
            rb.font.size = Pt(10)
            rb.font.color.rgb = RGBColor(33, 33, 33)
        r = p.add_run(text)
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(45, 45, 45)
        return p

    def add_callout(title, text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_bg(cell, "EBF5FB")
        set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(4)
        rt = p.add_run(f"📌 {title}\n")
        rt.font.bold = True
        rt.font.size = Pt(10.5)
        rt.font.color.rgb = RGBColor(27, 79, 114)
        rc = p.add_run(text)
        rc.font.size = Pt(10)
        rc.font.italic = True
        p_space = doc.add_paragraph()
        p_space.paragraph_format.space_after = Pt(4)

    def add_img(img_path, caption, width=Inches(5.5)):
        if os.path.exists(img_path):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            r = p.add_run()
            r.add_picture(img_path, width=width)
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(12)
            rcap = p_cap.add_run(f"Hình: {caption}")
            rcap.font.italic = True
            rcap.font.size = Pt(9.5)
            rcap.font.color.rgb = RGBColor(110, 110, 110)
        else:
            print(f"File missing: {img_path}")

    # ==========================
    # TRANG BÌA (COVER PAGE)
    # ==========================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p_inst.add_run("BỘ GIÁO DỤC VÀ ĐÀO TẠO — TRƯỜNG ĐẠI HỌC VINH\nKHOA KINH TẾ & QUẢN TRỊ KINH DOANH\n")
    r.font.bold = True
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(100, 100, 100)
    
    p_div = doc.add_paragraph()
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_div.paragraph_format.space_before = Pt(30)
    p_div.paragraph_format.space_after = Pt(20)
    r_bar = p_div.add_run("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    r_bar.font.color.rgb = RGBColor(41, 128, 185)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t1 = p_title.add_run("BÁO CÁO MÔ HÌNH KINH DOANH CANVAS (BMC)\n")
    r_t1.font.bold = True
    r_t1.font.size = Pt(22)
    r_t1.font.color.rgb = RGBColor(27, 79, 114)
    
    r_t2 = p_title.add_run("DỰ ÁN VIETFIT: NỀN TẢNG THEO DÕI TẬP LUYỆN THỂ HÌNH THÔNG MINH\n(SMART WORKOUT COMPANION & RECOVERY PLATFORM)")
    r_t2.font.bold = True
    r_t2.font.size = Pt(14)
    r_t2.font.color.rgb = RGBColor(39, 174, 96)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(15)
    p_sub.paragraph_format.space_after = Pt(40)
    r_sub = p_sub.add_run("Phân tích chuyên sâu 4 Trụ cột Chiến lược:\n1. Target Customer — 2. Value Proposition — 3. Channels — 4. Customer Relationships")
    r_sub.font.italic = True
    r_sub.font.size = Pt(11.5)
    r_sub.font.color.rgb = RGBColor(80, 80, 80)

    # Info box on cover
    p_info = doc.add_paragraph()
    p_info.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_info.paragraph_format.space_before = Pt(80)
    p_info.paragraph_format.space_after = Pt(20)
    r_info = p_info.add_run(
        "Môn học: Khởi sự Doanh nghiệp & Đổi mới Sáng tạo\n"
        "Nhóm thực hiện: Nhóm Phát triển Dự án VietFit\n"
        "Mã nguồn dự án: https://github.com/VanThan19/STKN.git\n"
        "Năm học: 2026 - 2027"
    )
    r_info.font.size = Pt(11)
    r_info.font.color.rgb = RGBColor(70, 70, 70)

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 1: TARGET CUSTOMER (KHÁCH HÀNG MỤC TIÊU)
    # ==========================================
    add_h1("CHƯƠNG 1: TARGET CUSTOMER (KHÁCH HÀNG MỤC TIÊU)")
    add_p(
        "Trong khuôn khổ mô hình kinh doanh Canvas (BMC), Khách hàng mục tiêu là điểm khởi đầu quyết định mọi chiến lược "
        "về sản phẩm và phân phối. Dựa trên nghiên cứu thực tế tại thị trường Việt Nam và thói quen rèn luyện thể chất của người trẻ, "
        "VietFit phân khúc thị trường thành 03 nhóm khách hàng trọng tâm. Mỗi nhóm sở hữu đặc điểm nhân khẩu học, chân dung (Persona), "
        "hành vi quan sát được (Observable Behaviors), nỗi đau nhức nhối (Painpoints) và mục tiêu mong muốn (Goals) riêng biệt."
    )

    # 1.1 NHÓM 1
    add_h2("1.1. Nhóm 1: Người mới bắt đầu & Tự tập tại nhà (Home Workout & Beginners)")
    add_bullet("Tuổi từ 18 – 26 (sinh viên, học sinh, nhân viên văn phòng mới đi làm). Thu nhập dưới 8 triệu/tháng, ngân sách dành cho thể thao rất eo hẹp (< 300.000 VNĐ/tháng). Thường có tâm lý tự ti về vóc dáng, ngại tiếp xúc nơi phòng gym đông người hoặc chưa đủ điều kiện mua thẻ tập hàng năm.", "Customer Persona (Chân dung): ")
    add_bullet("Lướt xem video bài tập ngẫu hứng trên TikTok, YouTube Shorts, Reels; tập theo không có kế hoạch bài bản. Chỉ sở hữu trang bị thô sơ: thảm yoga, 1 đôi tạ đơn nhỏ (2-5kg) hoặc chỉ tập Bodyweight (chống đẩy, gập bụng). Rất dễ bỏ cuộc chỉ sau 2-3 tuần vì mỏi cơ, không thấy kết quả hoặc chán nản.", "Observable Behaviors (Hành vi quan sát được): ")
    add_bullet("Mù mờ kiến thức: không biết hôm nay nên tập nhóm cơ nào, tập bao nhiêu hiệp/lần. Sợ tập sai kỹ thuật (sai form) dẫn đến đau cột sống, chấn thương khớp gối. Không có tiền thuê Huấn luyện viên cá nhân (PT gym có giá từ 400.000 - 800.000 VNĐ/buổi). Tải app nước ngoài thì bị rào cản tiếng Anh và bắt buộc trả phí 50$ - 100$/năm sau khi hết 7 ngày dùng thử.", "Painpoints (Nỗi đau thực tế): ")
    add_bullet("Xây dựng thói quen vận động mỗi ngày, giảm mỡ bụng, tăng cường thể lực cơ bản. Cần một lộ trình tập luyện tại nhà bài bản, trực quan, có video hướng dẫn chuyển động chi tiết và hoàn toàn MIỄN PHÍ.", "Goals (Mục tiêu kỳ vọng): ")

    # 1.2 NHÓM 2
    add_h2("1.2. Nhóm 2: Gymer phòng tập phổ thông (Intermediate Gymers)")
    add_bullet("Tuổi từ 22 – 35 (dân văn phòng, kinh doanh, kỹ sư, nhân sự trẻ). Đã tập gym liên tục từ 6 tháng đến 2 năm. Có kiến thức nền tảng về các bài tập Compound (Bench Press, Squat, Deadlift), tự chủ về mặt thời gian và ngân sách đi tập.", "Customer Persona (Chân dung): ")
    add_bullet("Đi tập đều đặn 3 – 5 buổi/tuần tại các phòng gym thương mại hoặc bình dân. Luôn mang theo điện thoại thông minh vào phòng tập để bấm giờ hoặc ghi chú mức tạ vào ứng dụng Notes. Thường xuyên lướt mạng xã hội trong lúc nghỉ giữa hiệp dẫn đến việc nghỉ quá thời gian quy định.", "Observable Behaviors (Hành vi quan sát được): ")
    add_bullet("Hay quên mức tạ của buổi tập trước (không nhớ đã đẩy 50kg hay 55kg). Não mệt mỏi sau giờ làm việc nên lúng túng khi tính nhẩm số bánh tạ cần lắp mỗi bên thanh đòn. Giờ cao điểm máy tập thường bị người khác chiếm mất, gây bối rối không biết đổi sang bài nào thay thế có cùng tác dụng cơ. Phòng gym đặt tại tầng hầm hoặc góc khuất thường xuyên mất sóng 4G/Wifi khiến các ứng dụng phụ thuộc Internet bị tê liệt.", "Painpoints (Nỗi đau thực tế): ")
    add_bullet("Duy trì nguyên lý quá tải tăng tiến (Progressive Overload) để tăng cơ bắp liên tục. Tối ưu hóa thời gian trong phòng gym (buổi tập diễn ra liền mạch, không lãng phí thời gian tính toán thủ công hay chờ đợi máy tập).", "Goals (Mục tiêu kỳ vọng): ")

    # 1.3 NHÓM 3
    add_h2("1.3. Nhóm 3: Gymer nâng cao, Vận động viên & Huấn luyện viên cá nhân (Advanced Athletes & Coaches)")
    add_bullet("Tuổi từ 24 – 40. Người tập gym chuyên sâu trên 2 năm, vận động viên thể hình/powerlifting bán chuyên hoặc các Huấn luyện viên cá nhân (PT). Đam mê các chỉ số khoa học vận động và dinh dưỡng.", "Customer Persona (Chân dung): ")
    add_bullet("Ghi chép cực kỳ chi tiết từng chỉ số: Khối lượng Volume (Tập bao nhiêu tấn tạ/buổi), RPE (Tỷ lệ gắng sức), 1RM (Mức tạ tối đa 1 lần). Thường xuyên sử dụng thiết bị đeo thông minh (Apple Watch, Garmin, Zepp OS). Định kỳ chụp ảnh Body Check để theo dõi tỷ lệ mỡ và cơ bắp.", "Observable Behaviors (Hành vi quan sát được): ")
    add_bullet("Các app thương mại phổ thông quá sơ sài, thiếu công cụ phân tích tải trọng và khả năng phục hồi cơ bắp. Nỗi lo ngại lớn về quyền riêng tư và an toàn dữ liệu: không muốn dữ liệu thể trạng, hình ảnh cá nhân và lịch sử sinh trắc học bị gửi lên máy chủ đám mây của bên thứ ba để trục lợi quảng cáo. Mức phí bản quyền các phần mềm chuyên nghiệp quá cao.", "Painpoints (Nỗi đau thực tế): ")
    add_bullet("Một hệ thống dữ liệu tự lưu trữ (Self-hosted) an toàn tuyệt đối 100%, bảo mật Passkey sinh trắc học. Khả năng tùy biến giáo án không giới hạn, phân tích biểu đồ hồi phục cơ bắp đa chiều và đồng bộ mượt mà với đồng hồ thông minh.", "Goals (Mục tiêu kỳ vọng): ")

    # Bảng Ma trận tổng hợp Customer
    add_h2("1.4. Ma trận So sánh & Tổng hợp 3 Nhóm Khách Hàng Mục Tiêu")
    headers_c1 = ["Tiêu chí phân tích", "Nhóm 1: Home & Beginners", "Nhóm 2: Intermediate Gymers", "Nhóm 3: Advanced & Coaches"]
    data_c1 = [
        ["Độ tuổi & Nghề nghiệp", "18 - 26 tuổi (HSSV, Newbie văn phòng)", "22 - 35 tuổi (Nhân viên, Kỹ sư, Kinh doanh)", "24 - 40 tuổi (PT, Vận động viên, Lifter lâu năm)"],
        ["Địa điểm rèn luyện", "Tại nhà, công viên, phòng trọ", "Phòng gym thương mại, Fitness Center", "Phòng gym chuyên nghiệp, Private Gym Studio"],
        ["Trang bị sẵn có", "Tạ đơn mini, thảm tập, Bodyweight", "Đầy đủ máy móc phòng gym, thanh đòn Olympic", "Đai lưng, dây quấn cổ tay, Smartwatch, đòn chuyên dụng"],
        ["Nỗi đau chí mạng (Painpoints)", "Mù kiến thức, sợ sai form chấn thương, không có tiền thuê PT", "Hay quên mức tạ cũ, đơ não tính đĩa tạ, máy bị chiếm, mất mạng 4G", "Lo ngại lộ dữ liệu thể trạng, thiếu phân tích phục hồi chuyên sâu, phí app đắt"],
        ["Mục tiêu cốt lõi (Goals)", "Khởi tạo thói quen, tập đúng form, tiết kiệm 100% chi phí", "Tăng tiến tạ đều đặn (Overload), buổi tập trơn tru không ngắt quãng", "Làm chủ dữ liệu (Self-host), bảo mật cao, đo lường Volume/RPE chuẩn xác"]
    ]
    style_table(doc.add_table(rows=1, cols=4), [Inches(1.5), Inches(1.6), Inches(1.7), Inches(1.7)], headers_c1, data_c1)

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 2: VALUE PROPOSITION (TUYÊN NGÔN GIÁ TRỊ)
    # ==========================================
    add_h1("CHƯƠNG 2: VALUE PROPOSITION (TUYÊN NGÔN GIÁ TRỊ)")
    add_p(
        "Tuyên ngôn giá trị của VietFit được xây dựng dựa trên triết lý: 'Smart Workout Companion — Tự lưu trữ, Bảo mật tuyệt đối & Tối ưu hóa hiệu suất thể hình'. "
        "VietFit không chỉ đơn thuần là một cuốn sổ tay ghi chú điện tử, mà là một hệ sinh thái hỗ trợ thông minh từ lúc chuẩn bị lịch tập, "
        "trong suốt quá trình nâng tạ, cho đến khâu phân tích phục hồi sau buổi tập."
    )

    # 2.1 Bản đồ cơ bắp 3D
    add_h2("2.1. Bản đồ Cơ bắp Giải phẫu Tương tác (Interactive Body Map) & Thư viện 5.600+ Bài tập")
    add_p("Giải quyết triệt để nỗi đau của Nhóm 1 và Nhóm 2 về rào cản thuật ngữ và kỹ thuật:", "Vấn đề giải quyết: ")
    add_bullet("Người dùng không cần nhớ tên bài tập tiếng Anh phức tạp (như Bulgarian Split Squat hay Incline Dumbbell Press). Chỉ cần chạm trực tiếp vào vùng cơ mong muốn trên Bản đồ cơ thể (Ngực, Lưng xô, Vai, Tay sau, Đùi trước, Bắp chân...), hệ thống sẽ lập tức lọc ra các bài tập chuyên biệt tác động vào nhóm cơ đó.", "Bản đồ giải phẫu học trực quan: ")
    add_bullet("Kho dữ liệu đồ sộ hơn 5.600 bài tập kèm hình ảnh động (Animated WebP/GIF) chuẩn xác từng nhịp chuyển động và nhịp hít thở, giúp người mới tự tin tập đúng kỹ thuật, loại bỏ hoàn toàn nguy cơ chấn thương khớp.", "Hình ảnh động giải phẫu chuẩn xác: ")
    add_bullet("Bộ lọc thông minh cho phép người tập lọc theo dụng cụ có sẵn (Chỉ tạ đơn, Tập tại nhà, Thanh xà, hoặc Máy phòng gym).", "Tự động lọc theo thiết bị: ")
    
    assets_dir = os.path.join(os.getcwd(), 'report_assets')
    add_img(os.path.join(assets_dir, 'ui_body_map_exercises.png'), "Giao diện Bản đồ cơ bắp tương tác và danh mục bài tập giải phẫu trong ứng dụng VietFit")

    # 2.2 Plate Math & Timer
    add_h2("2.2. Trợ lý Số trong Buổi tập: Máy tính Bánh tạ (Plate Math) & Bộ đếm Giờ nghỉ (Rest Timer)")
    add_p("Giải quyết triệt để nỗi đau của Nhóm 2 (Gymer phòng tập phổ thông) khi phải tính nhẩm bánh tạ và lướt điện thoại quên giờ:", "Vấn đề giải quyết: ")
    add_bullet("Chỉ cần nhập tổng mức tạ mục tiêu (ví dụ: 67.5 kg), hệ thống tự động trừ đi trọng lượng thanh đòn chuẩn (20kg) và vẽ trực quan hình ảnh chính xác các đĩa tạ cần lắp vào mỗi bên (ví dụ: 1 đĩa 20kg + 1 đĩa 2.5kg + 1 đĩa 1.25kg). Không còn tình trạng đứng đơ não hay tính sai lệch làm lệch đòn.", "Công cụ tính đĩa tạ thông minh (Plate Math Calculator): ")
    add_bullet("Ngay khi bấm tích hoàn thành hiệp, đồng hồ đếm ngược tự động kích hoạt (60s, 90s hoặc tùy chỉnh). Khi hết giờ nghỉ, ứng dụng phát âm thanh chuông và rung thiết bị để nhắc nhở người tập bước vào hiệp tiếp theo, triệt tiêu thói quen bấm điện thoại làm nguội cơ.", "Đồng hồ bấm giờ nghỉ tự động (Smart Rest Timer): ")
    add_bullet("Mỗi bài tập tự động điền sẵn mức tạ và số rep của lần tập thành công gần nhất, loại bỏ hoàn toàn việc phải lật sổ ghi chép hay lục lại bộ nhớ.", "Tự động điền dữ liệu buổi trước (Auto-Filled Metrics): ")

    add_img(os.path.join(assets_dir, 'plate_math_calculator.jpg'), "Tính năng Tính bánh tạ (Plate Math Calculator) và Bộ đếm giờ nghỉ tự động của VietFit")

    # 2.3 Progressive Overload & Swap
    add_h2("2.3. Động cơ Quá tải Tăng tiến (Progression Engine) & Đổi bài tập 1 chạm (Swap Exercise)")
    add_p("Đảm bảo cơ bắp liên tục phát triển và khắc phục sự cố máy tập bị chiếm giờ cao điểm:", "Vấn đề giải quyết: ")
    add_bullet("Hệ thống tích hợp sẵn các thuật toán khoa học thể thao nổi tiếng (Linear Progression, Double Progression, Greyskull LP). Khi người dùng đạt đủ số hiệp và rep mục tiêu, hệ thống tự động tính toán tăng mức tạ ở buổi sau (ví dụ: +2.5kg cho bài thân trên, +5kg cho bài thân dưới).", "Progression Engine tự động: ")
    add_bullet("Trong giờ cao điểm, nếu máy tập ghế dốc đang có người sử dụng, người tập chỉ cần ấn nút 'Swap Exercise', VietFit lập tức đề xuất bài tập thay thế tương đương sinh cơ học (ví dụ: chuyển từ Incline Barbell Bench Press sang Incline Dumbbell Press).", "Đổi bài tương đương 1 chạm: ")
    add_bullet("Cơ thể được tô màu trực quan theo tình trạng hồi phục: Màu xanh (Đã sẵn sàng tập), Màu cam (Đang hồi phục nhẹ), Màu đỏ (Đang quá tải/mỏi cơ), giúp người tập biết chính xác ngày nào nên tập gì để tránh Over-training.", "Bản đồ nhiệt phục hồi cơ bắp (Muscle Recovery Heatmap): ")

    add_img(os.path.join(assets_dir, 'ui_history_workout.png'), "Lịch sử tập luyện trực quan, ghi nhận kỷ lục cá nhân (PR) và theo dõi thể lực")

    # 2.4 Offline-first & Privacy
    add_h2("2.4. Kiến trúc Ngoại tuyến (Offline-First), Tự lưu trữ (Self-Hosted) & Bảo mật Passkey")
    add_p("Giải quyết triệt để nỗi lo ngại của Nhóm 3 về quyền riêng tư và sự cố mất sóng mạng tại phòng tập tầng hầm:", "Vấn đề giải quyết: ")
    add_bullet("VietFit được xây dựng theo chuẩn Progressive Web App (PWA) với Local Storage Cache. Ứng dụng hoạt động mượt mà 100% ngay cả khi tắt dữ liệu di động, bật chế độ máy bay hoặc tập ở các phòng gym tầng hầm không có sóng 4G/Wifi.", "Hoạt động không phụ thuộc Internet (100% Offline): ")
    add_bullet("Toàn bộ dữ liệu bài tập, lịch sử tập, số đo cơ thể và hình ảnh cá nhân được lưu trữ trực tiếp trên thiết bị của người dùng hoặc máy chủ riêng (Self-hosted cá nhân). VietFit cam kết ZERO TELEMETRY — không có mã theo dõi, không bán dữ liệu cho bên thứ ba.", "Bảo mật riêng tư tuyệt đối: ")
    add_bullet("Đăng nhập bằng vân tay/FaceID qua chuẩn WebAuthn Passkeys, an toàn hơn mọi hình thức mật khẩu truyền thống.", "Bảo mật Passkey sinh trắc học: ")

    add_img(os.path.join(assets_dir, 'ui_admin_coach.png'), "Giao diện Huấn luyện viên AI và Bảng quản trị cá nhân hóa của VietFit")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 3: CHANNELS (KÊNH PHÂN PHỐI & TRUYỀN THÔNG)
    # ==========================================
    add_h1("CHƯƠNG 3: CHANNELS (KÊNH PHÂN PHỐI & TRUYỀN THÔNG)")
    add_p(
        "Kênh là phương thức doanh nghiệp tiếp cận, giao tiếp và chuyển giao giá trị đến từng phân khúc khách hàng. "
        "Chiến lược Kênh của VietFit bao gồm 2 mảng chính: Kênh phân phối sản phẩm (Distribution Channels) và Kênh truyền thông quảng bá (Promotion Channels)."
    )

    # 3.1 Distribution
    add_h2("3.1. Kênh Phân phối Sản phẩm (Distribution Channels)")
    add_p(
        "VietFit áp dụng mô hình phân phối đa kênh kết hợp Trực tiếp (Direct) và Gián tiếp (Indirect), "
        "trên nền tảng Kỹ thuật số (Virtual) là trọng tâm kết hợp Điểm chạm Vật lý (Physical Touchpoints) để tối ưu chi phí vận hành."
    )
    
    headers_c3 = ["Loại hình kênh", "Hình thức triển khai", "Kênh cụ thể", "Đặc điểm & Lợi thế chiến lược"]
    data_c3 = [
        ["Kênh Trực tiếp (Direct Channel)", "Virtual (Kỹ thuật số trực tiếp)", "Web PWA (Progressive Web App)", "Khách hàng truy cập trực tiếp qua đường link trên trình duyệt, có thể cài đặt ngay ra màn hình chính điện thoại (Add to Home Screen) mà không cần qua xét duyệt chợ ứng dụng."],
        ["Kênh Trực tiếp (Direct Channel)", "Virtual (Mã nguồn mở & Tệp tin)", "GitHub Repository & Direct APK", "Phân phối trực tiếp bộ mã nguồn tại https://github.com/VanThan19/STKN.git và tệp APK Android đóng gói sẵn cho cộng đồng công nghệ."],
        ["Kênh Gián tiếp (Indirect Channel)", "Virtual (Chợ ứng dụng trực tuyến)", "Google Play Store & Apple App Store", "Đóng gói ứng dụng thông qua Capacitor/Cordova đưa lên kho ứng dụng chính thống, giúp tăng độ uy tín và tiếp cận tệp người dùng đại trà."],
        ["Kênh Gián tiếp (Indirect Channel)", "Virtual (Máy chủ tự lưu trữ)", "Docker Hub Registry", "Cung cấp Docker Image chuẩn giúp các Gymer am hiểu công nghệ tự dựng máy chủ riêng tại nhà (NAS/HomeLab) chỉ với 1 dòng lệnh."],
        ["Kênh Điểm chạm (Touchpoints)", "Physical (Vật lý trực tiếp)", "Mã QR tại quầy tiếp tân phòng gym", "Đặt Standee hoặc bảng mica in mã QR tại quầy lễ tân các phòng gym đối tác và khu vực tạ tự do để gymer quét tải app dùng thử ngay tại chỗ."]
    ]
    style_table(doc.add_table(rows=1, cols=4), [Inches(1.5), Inches(1.4), Inches(1.6), Inches(2.0)], headers_c3, data_c3)

    # 3.2 Promotion
    add_h2("3.2. Kênh Truyền thông & Quảng bá (Promotion Channels)")
    add_p(
        "Kênh truyền thông được lựa chọn trọng tâm là: **TikTok (Video ngắn & Chuỗi ảnh Carousel)** kết hợp **Facebook (Fanpage + Seeding Group Gym)**. "
        "Đây là hai nền tảng có lượng người dùng đam mê thể hình đông đảo nhất tại Việt Nam, sở hữu thuật toán phân phối nội dung tự nhiên (Organic Distribution) "
        "mạnh mẽ nhất, giúp chiến dịch dễ dàng vượt mốc KPI tiếp cận tối thiểu **1.000 người (Reach $\\ge 1.000$)** hoàn toàn miễn phí."
    )

    add_img(os.path.join(assets_dir, 'vietfit_promo_poster.jpg'), "Bộ nhận diện truyền thông đa kênh của chiến dịch VietFit", width=Inches(5.0))

    # Kế hoạch 16 bài
    add_h2("3.3. Kế hoạch Chi tiết 16 Bài Đăng Truyền thông (16 Posts / Ads Strategy)")
    add_p(
        "Chiến dịch 16 bài được thiết kế theo phễu chuyển đổi AIDA (Awareness — Interest — Decision — Action), "
        "đăng tải đều đặn trong 4 tuần (4 bài/tuần) vào các khung giờ vàng tập thể hình (11h30 - 12h30 trưa và 19h30 - 21h00 tối):"
    )

    # Bảng tổng hợp 16 bài
    headers_p16 = ["STT", "Giai đoạn (Phễu)", "Tiêu đề bài viết", "Định dạng", "Kênh đăng", "KPI Reach"]
    data_p16 = [
        ["01", "Giai đoạn 1: Nhận thức (Awareness)", "Ra mắt VietFit: Ứng dụng tập gym của người Việt", "TikTok Video / Ảnh Poster", "TikTok & Fanpage", "1.500+ Reach"],
        ["02", "Giai đoạn 1: Nhận thức (Awareness)", "Cơn ác mộng 'não đơ' tính bánh tạ mỗi bên đòn", "TikTok Photo Carousel", "TikTok & Seeding Group", "2.000+ Reach"],
        ["03", "Giai đoạn 1: Nhận thức (Awareness)", "Mẹo tập ngực không đau khớp vai cho người mới", "Video ngắn 45s", "TikTok & Reels", "1.200+ Reach"],
        ["04", "Giai đoạn 1: Nhận thức (Awareness)", "Top 3 sai lầm khiến gymer tập 1 năm không lên cơ", "Infographic / Ảnh bài viết", "Fanpage & Groups", "1.000+ Reach"],
        ["05", "Giai đoạn 2: Quan tâm (Interest)", "Hướng dẫn tính đĩa tạ 1 chạm với Plate Calculator", "Video màn hình thực tế", "TikTok & Fanpage", "1.800+ Reach"],
        ["06", "Giai đoạn 2: Quan tâm (Interest)", "Bản đồ cơ bắp 3D: Chạm vào cơ nào, ra bài tập đó", "Video UI trực quan", "TikTok & Seeding Group", "2.500+ Reach"],
        ["07", "Giai đoạn 2: Quan tâm (Interest)", "Nghỉ giữa hiệp bao lâu là chuẩn khoa học?", "Carousel ảnh kiến thức", "TikTok & Instagram", "1.100+ Reach"],
        ["08", "Giai đoạn 2: Quan tâm (Interest)", "Tập tầng hầm mất 4G? VietFit chạy mượt 100% Offline", "Video thử nghiệm thực tế", "TikTok & Reels", "1.600+ Reach"],
        ["09", "Giai đoạn 3: Quyết định (Decision)", "So sánh VietFit vs Các App trả phí quốc tế", "Bảng so sánh Infographic", "Fanpage & Groups", "1.400+ Reach"],
        ["10", "Giai đoạn 3: Quyết định (Decision)", "Giờ cao điểm máy bị chiếm? Đổi bài tương đương 1 chạm", "Video mẹo phòng gym", "TikTok & Seeding Group", "2.200+ Reach"],
        ["11", "Giai đoạn 3: Quyết định (Decision)", "Người dùng chia sẻ: Tăng 10kg mức Squat sau 4 tuần", "Feedback & Biểu đồ tiến độ", "Fanpage & TikTok", "1.300+ Reach"],
        ["12", "Giai đoạn 3: Quyết định (Decision)", "Bảo mật dữ liệu tuyệt đối với Passkey vân tay", "Infographic công nghệ", "Fanpage & Group Tech", "900+ Reach"],
        ["13", "Giai đoạn 4: Hành động (Action)", "Thử thách '30 Ngày Bứt Phá Vóc Dáng' cùng VietFit", "Video phát động sự kiện", "TikTok & Fanpage", "3.000+ Reach"],
        ["14", "Giai đoạn 4: Hành động (Action)", "Tặng miễn phí 10 Giáo án Push-Pull-Legs chuẩn quốc tế", "Bài viết tặng quà / Link tải", "Seeding 5 Group Gym", "3.500+ Reach"],
        ["15", "Giai đoạn 4: Hành động (Action)", "Livestream / Q&A: Giải đáp thắc mắc tập luyện cùng AI", "Livestream ngắn / Video Q&A", "TikTok Live & Fanpage", "1.000+ Reach"],
        ["16", "Giai đoạn 4: Hành động (Action)", "Tổng kết cột mốc 1.000+ Người dùng & Tri ân cộng đồng", "Poster vinh danh thành tích", "Toàn bộ các kênh", "2.000+ Reach"]
    ]
    style_table(doc.add_table(rows=1, cols=6), [Inches(0.5), Inches(1.5), Inches(2.2), Inches(1.2), Inches(1.1), Inches(0.9)], headers_p16, data_p16)

    add_h3("Chi tiết Nội dung Từng Bài đăng (Kèm Kịch bản & Hashtags)")
    
    # 16 detailed posts
    posts_detail = [
        ("Bài 1: Ra mắt Ứng dụng VietFit", "Awareness", "Gặp khó khăn khi nhớ mức tạ hay không biết tập gì hôm nay? VietFit - Ứng dụng tập gym thông minh tự phát triển cho người Việt đã chính thức có mặt! 100% Tiếng Việt, hơn 5.600 bài tập có hình minh họa giải phẫu, tự tính bánh tạ và hoàn toàn miễn phí trọn đời! Trải nghiệm ngay tại link bio!", "Hình ảnh Poster giới thiệu giao diện điện thoại với phông nền phòng gym hiện đại.", "#VietFit #GymApp #TuTapGym #FitnessVietNam #KhoiNghiep"),
        ("Bài 2: Nỗi đau tính bánh tạ mỗi bên đòn", "Awareness", "Ai từng đứng ngơ ngác trước thanh đòn tạ 67.5kg mà não đơ không biết mỗi bên lắp mấy cái đĩa 20kg, 10kg hay 2.5kg giơ tay? Với tính năng Plate Math của VietFit, chỉ cần gõ số kg, app tự vẽ hình từng bánh tạ cho bạn lắp chuẩn từng milimet! Không còn cảnh tính nhầm lệch đòn nữa nhé!", "Bộ ảnh Carousel: Slide 1: Meme mặt đơ khi nhìn đòn tạ; Slide 2: Ảnh chụp màn hình Plate Math của VietFit trực quan.", "#PlateMath #TinhDiaTa #GymMeme #DoTa #VietFit"),
        ("Bài 3: Mẹo tập ngực không đau khớp vai", "Awareness", "Tập ngực mà chỉ thấy mỏi vai và đau khớp trước? Rất có thể bạn đã dang cùi chỏ quá rộng 90 độ! Xem ngay video mô phỏng góc chuyển động 75 độ chuẩn xác trên Bản đồ giải phẫu của VietFit để sửa ngay hôm nay!", "Video ngắn 45s: Đoạn đầu chỉ ra lỗi sai phổ biến, đoạn sau mở app VietFit zoom cận cảnh hình động giải phẫu bài Bench Press.", "#SuaForm #TapNguc #BenchPress #ChanhChanThuong #VietFit"),
        ("Bài 4: Top 3 sai lầm khiến tập 1 năm không tiến bộ", "Awareness", "1. Không ghi chép mức tạ (tập ngẫu hứng). 2. Nghỉ giữa hiệp quá lâu (lướt điện thoại 5 phút làm nguội cơ). 3. Không áp dụng nguyên tắc Quá tải tăng tiến (Progressive Overload). VietFit giải quyết cả 3 vấn đề trên trong 1 chạm!", "Ảnh Infographic chia 3 cột trực quan với phông màu xanh navy chuyên nghiệp.", "#GiaoAnGym #SaiLamKhiTap #GymTips #VietFit"),
        ("Bài 5: Hướng dẫn sử dụng Plate Math trong 10 giây", "Interest", "Làm sao để lắp tạ chuẩn chỉ trong 3 bước? Bước 1: Mở app VietFit. Bước 2: Nhập số kg mục tiêu. Bước 3: Nhìn hình bánh tạ và lắp vào thanh đòn. Không cần máy tính bỏ túi, không cần nhẩm!", "Video màn hình quay thao tác thực tế trên app mượt mà.", "#HuongDanVietFit #TienIchGym #GymWorkout #AppMienPhi"),
        ("Bài 6: Chạm vào cơ nào – Ra bài tập cơ đó", "Interest", "Bạn muốn tập dầy cơ lưng xô nhưng chỉ biết mỗi bài kéo cáp? Mở ngay Bản đồ cơ bắp 3D trên VietFit, chạm vào vùng cơ Lats, hơn 50 biến thể bài tập từ tạ đơn đến đòn tạ sẽ hiện ra kèm video chi tiết!", "Video ngắn quay màn hình tương tác chạm vào cơ bắp 3D và bung danh sách bài tập.", "#BodyMap #GiaiPhauTheHinh #TapLungXo #VietFitApp"),
        ("Bài 7: Nghỉ giữa hiệp bao lâu để cơ bắp phát triển tối đa?", "Interest", "Nghỉ 30 giây hay 3 phút? Khoa học chứng minh: Bài tập đa khớp nặng cần 2-3 phút, bài tập cô lập cần 60-90 giây. Tính năng Smart Rest Timer của VietFit sẽ tự động đếm ngược và rung báo khi đến giờ!", "Ảnh Carousel 4 trang giải thích cơ chế ATP-CP và ứng dụng đồng hồ bấm giờ thông minh.", "#KhoaHocTheHinh #NghiGiuaHiep #RestTimer #VietFit"),
        ("Bài 8: Phòng gym tầng hầm mất 4G? Không thành vấn đề!", "Interest", "Nhiều app xịn sò của Tây cứ vào tầng hầm mất mạng là đơ vòng quay vô tận. VietFit là ứng dụng Offline-first, tắt mạng chạy phà phà, lưu trọn vẹn lịch tập không mất 1 byte dữ liệu!", "Video thực tế cầm điện thoại bật chế độ máy bay (Airplane mode) nhưng mở VietFit log tạ mượt mà.", "#OfflineApp #GymTangHam #NoInternetNeeded #VietFit"),
        ("Bài 9: So sánh VietFit với các App Gym Quốc Tế", "Decision", "Tại sao bạn phải trả 1.500.000 VNĐ/năm cho app nước ngoài đầy quảng cáo trong khi VietFit mang lại trải nghiệm tương đương: 100% Tiếng Việt, 5.600+ bài tập, không quảng cáo, miễn phí trọn đời!", "Bảng so sánh Infographic: VietFit vs Strong App vs Hevy.", "#SoSanhApp #AppGymMienPhi #UngDungViet #VietFit"),
        ("Bài 10: Máy tập bị chiếm? Đổi bài 1 chạm với Swap Exercise", "Decision", "Đang hăng say tập thì ghế đẩy tạ bị người khác mượn set? Đừng bỏ về! Ấn ngay nút 'Swap Exercise', VietFit sẽ gợi ý bài tập thay thế cùng tác động vào cơ ngực trên mà không cần chờ đợi!", "Video tiểu phẩm hài ngắn: Gymer ngơ ngác khi máy bị chiếm -> Bấm VietFit đổi bài tập tiếp cực ngầu.", "#MẹoPhongGym #SwapExercise #GymHumor #VietFit"),
        ("Bài 11: Feedback người dùng: Tăng 10kg Squat sau 1 tháng", "Decision", "Nhờ tính năng Progression Engine tự động tính mức tăng tạ mỗi tuần, bạn Tuấn Anh (21 tuổi) đã phá vỡ mức tạ dậm chân tại chỗ để đạt mốc 100kg Squat! Hãy để dữ liệu khoa học dẫn lối thể hình của bạn!", "Ảnh chụp biểu đồ tăng tiến mức tạ (Line Chart) đi lên kèm tin nhắn cảm ơn từ người dùng thử.", "#ReviewVietFit #TienBoMoiNgay #ProgressiveOverload #PR"),
        ("Bài 12: Dữ liệu thể trạng của bạn có thực sự an toàn?", "Decision", "Hình ảnh cơ thể và cân nặng của bạn có bị bán cho các công ty quảng cáo? VietFit tiên phong kiến trúc Self-hosted và bảo mật sinh trắc học Passkey. Dữ liệu của bạn thuộc về chính bạn!", "Poster đồ họa bảo mật công nghệ cao với biểu tượng khiên bảo vệ và vân tay.", "#BaoMatDuLieu #SelfHosted #Passkey #PrivacyFirst #VietFit"),
        ("Bài 13: Phát động Thử thách '30 Ngày Bứt Phá Vóc Dáng'", "Action", "Chào đón mùa hè cùng Thử thách 30 ngày tập luyện liên tục trên VietFit! Check-in duy trì chuỗi Streak để nhận ngay bộ tài liệu giáo án dinh dưỡng tăng cơ giảm mỡ chuẩn khoa học!", "Banner sự kiện thể thao rực rỡ sắc cam - xanh khích lệ tinh thần.", "#Challenge30Ngay #ThuThachVietFit #KienTri #ThayDoiVocDang"),
        ("Bài 14: Tặng trọn bộ 10 Giáo án tập Push-Pull-Legs chuẩn quốc tế", "Action", "Comment 'VIETFIT' ngay dưới bài viết hoặc nhắn tin cho Fanpage để nhận miễn phí trọn bộ 10 file giáo án PPL từ 3 đến 6 buổi/tuần, đã được tích hợp sẵn vào ứng dụng!", "Hình ảnh mockup 10 cuốn sổ giáo án điện tử hiện đại, chuyên nghiệp.", "#TangGiaoAn #PushPullLegs #LichTapGym #FreeDownload #VietFit"),
        ("Bài 15: Q&A trực tiếp: Giải đáp thắc mắc tập luyện và ứng dụng AI", "Action", "Tối nay 20h00, tham gia buổi hỏi đáp trực tuyến cùng nhóm phát triển VietFit: Cách lên lịch tập cho người bận rộn và cách trợ lý AI Coach đề xuất thực đơn tăng cơ hiệu quả!", "Ảnh thông báo lịch Livestream có ảnh đại diện của Host và giao diện app.", "#LivestreamGym #HoiDapTheHinh #AICoach #VietFit"),
        ("Bài 16: Cột mốc 1.000+ Người dùng: Lời cảm ơn từ VietFit", "Action", "Chính thức vượt mốc 1.000 lượt tiếp cận và người dùng đồng hành! VietFit cam kết sẽ luôn giữ vững tinh thần mã nguồn mở, miễn phí và liên tục cập nhật vì cộng đồng thể hình Việt Nam!", "Poster ăn mừng cột mốc 1.000+ với ruy băng và pháo hoa rực rỡ.", "#Milestone #1000Users #CamOn #DongHanh #VietFitCommunity")
    ]

    for title, phase, caption, visual, tags in posts_detail:
        p_item = doc.add_paragraph()
        p_item.paragraph_format.space_before = Pt(8)
        p_item.paragraph_format.space_after = Pt(2)
        r_num = p_item.add_run(f"📌 {title} ")
        r_num.font.bold = True
        r_num.font.size = Pt(11)
        r_num.font.color.rgb = RGBColor(27, 79, 114)
        
        r_ph = p_item.add_run(f"[{phase}]")
        r_ph.font.italic = True
        r_ph.font.size = Pt(10)
        r_ph.font.color.rgb = RGBColor(39, 174, 96)
        
        add_bullet(caption, "Nội dung bài đăng (Caption): ")
        add_bullet(visual, "Ý tưởng hình ảnh / Video: ")
        add_bullet(tags, "Hashtags chiến dịch: ")

    add_callout(
        "CHIẾN THUẬT ĐẠT CHỈ TIÊU KPI REACH ≥ 1.000 NGƯỜI (ORGANIC)",
        "1. Seeding Group Đòn Bẩy: Đăng các bài viết chia sẻ giá trị (Bài 2, 6, 10, 14) vào 5 nhóm Gym lớn nhất Facebook "
        "(Hội Gymer Việt Nam, Nghiện Gym, Hội Tập Gym Tại Nhà). Mỗi nhóm mang lại tự nhiên 300 - 800 reach.\n"
        "2. Đòn bẩy Khung giờ vàng: Đăng vào 11h30 trưa hoặc 20h00 tối (sau giờ tập) kết hợp TikTok Reels thuật toán đẩy xu hướng.\n"
        "3. Tương tác kích hoạt ban đầu: Kêu gọi sinh viên trong lớp và bạn bè like/share trong 15 phút đầu để thuật toán phân phối mạnh."
    )

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 4: CUSTOMER RELATIONSHIPS (QUAN HỆ KHÁCH HÀNG)
    # ==========================================
    add_h1("CHƯƠNG 4: CUSTOMER RELATIONSHIPS (QUAN HỆ KHÁCH HÀNG)")
    add_p(
        "Quan hệ khách hàng trong mô hình Canvas mô tả các loại mối quan hệ mà doanh nghiệp thiết lập với từng phân khúc khách hàng "
        "để đạt 3 mục tiêu cốt lõi: Thu hút khách hàng mới (Get), Giữ chân khách hàng trung thành (Keep) và Phát triển gia tăng giá trị (Grow). "
        "Dưới đây là các chính sách chiến lược được minh họa trực quan:"
    )

    # 4.1 GET
    add_h2("4.1. Chính sách Thu hút Khách hàng Mới (Get Customers - Customer Acquisition)")
    add_bullet("Sản xuất các video ngắn hài hước về những 'nỗi đau phòng tập' (tính nhầm tạ, bị tranh máy) và các clip chia sẻ kiến thức giải phẫu sửa form. Lồng ghép khéo léo giải pháp của VietFit để người xem tải app ngay từ phần bình luận.", "Viral Content trên TikTok & Reels: ")
    add_bullet("Tặng miễn phí 10 giáo án tập luyện chuẩn quốc tế (PPL, Upper-Lower, Arnold Split) đã được nạp sẵn vào app. Khách hàng chỉ cần quét mã QR hoặc bấm link là có ngay giáo án để tập.", "Tặng trọn bộ Giáo án mẫu (Free Value Lead Magnet): ")
    add_bullet("Hợp tác đặt Standee và bảng mica in mã QR tại quầy lễ tân của các phòng gym tư nhân đối tác. Người đăng ký tập mới được tặng kèm mã quét app VietFit để tự theo dõi buổi tập.", "Đối tác Phòng Gym Cục bộ (Local Gym Partnership): ")
    add_bullet("Áp dụng cơ chế 'Mời 1 bạn cùng tập — Nhận ngay huy hiệu Cặp Đôi Gymer và mở khóa bộ giáo án chuyên sâu'.", "Chương trình Giới thiệu Bạn bè (Member-Get-Member): ")

    add_img(os.path.join(assets_dir, 'vietfit_tiktok_cover.jpg'), "Chiến dịch Thu hút khách hàng (Get Customers) qua chuỗi bài đăng truyền thông TikTok", width=Inches(5.0))

    # 4.2 KEEP
    add_h2("4.2. Chính sách Giữ chân Khách hàng (Keep Customers - Customer Retention)")
    add_bullet("Ứng dụng hiển thị chuỗi ngày tập liên tục (Streak Flame) và hệ thống danh hiệu (Tân binh, Lực sĩ, Kiên trì vô hạn). Thúc đẩy tâm lý không muốn làm đứt chuỗi để gymer duy trì tập luyện mỗi ngày.", "Cơ chế Gamification & Chuỗi ngày tập (Workout Streaks): ")
    add_bullet("Nếu phát hiện người dùng bỏ tập quá 3 ngày theo lịch đã đăng ký, hệ thống sẽ gửi một thông báo đẩy ngắn gọn, khích lệ tinh thần: 'Cơ bắp đang nhớ bạn đấy! Hôm nay ghé phòng gym 30 phút nhé!'.", "Thông báo Nhắc nhở Thông minh (Smart Workout Nudge): ")
    add_bullet("Không bao giờ chèn quảng cáo video toàn màn hình, không banner gây rối mắt lúc đang nâng tạ. Trải nghiệm tập luyện luôn nhanh, mượt và tôn trọng sự tập trung cao nhất.", "Cam kết 100% Không Quảng cáo Rác (Zero Ads Guarantee): ")
    add_bullet("Vào sáng Chủ nhật hàng tuần, VietFit tự động xuất bản một biểu đồ trực quan tóm tắt: Tổng số buổi tập, Tổng khối lượng Volume (tấn tạ đã nâng), Nhóm cơ đã phát triển nhiều nhất trong tuần.", "Báo cáo Tổng kết Tiến độ Hàng tuần (Weekly Workout Debrief): ")

    # 4.3 GROW
    add_h2("4.3. Chính sách Phát triển Khách hàng (Grow Customers - Customer Upselling & Expansion)")
    add_bullet("Tổ chức các cuộc thi online hàng tháng: '30 Ngày Đốt Mỡ', 'Ai Đẩy Ngực Tiến Bộ Nhất'. Người dùng chia sẻ ảnh chụp biểu đồ tiến độ từ VietFit lên mạng xã hội để nhận các phần quà thiết thực (Bình lắc thể thao, Găng tay tập, Dây kháng lực).", "Thử thách Cộng đồng Thể thao (Community Fitness Challenge): ")
    add_bullet("Cung cấp gói đăng ký nâng cao cho phép người dùng kích hoạt Huấn luyện viên AI chuyên biệt (phân tích video quay động tác để chỉnh sửa form tạ, tự động lập thực đơn Macro dinh dưỡng theo ngày).", "Mô hình Nâng cấp AI Coach Pro (Feature Upselling): ")
    add_bullet("Cung cấp phiên bản quản lý nhiều người dùng (Multi-tenant) dành cho các Huấn luyện viên cá nhân (PT) và Chủ phòng gym tư nhân để theo dõi chỉ số của 20 - 50 học viên trên cùng một hệ thống.", "Gói Giải pháp VietFit Gym Hub (B2B Expansion): ")
    add_bullet("Cung cấp các phụ kiện tập luyện mang thương hiệu VietFit (Dây kéo lưng Lifting Straps, Bình nước giữ nhiệt, Áo thun Oversize tập gym) được thiết kế đồng bộ với nhận diện thương hiệu.", "Phụ kiện Thể thao Thương hiệu (Brand Merchandise): ")

    # Bảng tổng kết Get Keep Grow
    add_h2("4.4. Bảng Tổng kết Chiến lược Quan hệ Khách hàng (Get — Keep — Grow Matrix)")
    headers_c4 = ["Trụ cột quan hệ", "Mục tiêu trọng tâm", "Chính sách & Hành động cụ thể", "Công cụ đo lường (KPI)"]
    data_c4 = [
        ["GET (Thu hút)", "Gia tăng lượng người dùng mới tự nhiên", "Viral clip TikTok, Tặng giáo án PPL miễn phí, Đặt mã QR tại quầy tiếp tân phòng gym, Chương trình Member-Get-Member", "Lượt tải app, Lượt tiếp cận (Reach ≥ 1.000), Tỷ lệ chuyển đổi quét mã QR"],
        ["KEEP (Giữ chân)", "Duy trì thói quen tập & giảm tỷ lệ rời bỏ (Churn)", "Chuỗi ngày tập liên tục (Streak), Thông báo thông minh khích lệ, Cam kết không quảng cáo, Báo cáo tiến bộ hàng tuần", "Tỷ lệ giữ chân sau 30 ngày (Retention Rate > 45%), Tần suất mở app (3-5 lần/tuần)"],
        ["GROW (Phát triển)", "Mở rộng giá trị vòng đời & lan tỏa cộng đồng", "Thử thách 30 ngày tập luyện, Gói AI Coach Pro thông minh, Giải pháp VietFit Gym Hub cho PT, Merchandise phụ kiện", "Số lượng người tham gia thử thách, Tỷ lệ giới thiệu bạn bè thành công (Referral Rate)"]
    ]
    style_table(doc.add_table(rows=1, cols=4), [Inches(1.4), Inches(1.5), Inches(2.2), Inches(1.4)], headers_c4, data_c4)

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 5: KẾT LUẬN & ĐÁNH GIÁ TÍNH KHẢ THI
    # ==========================================
    add_h1("CHƯƠNG 5: KẾT LUẬN & ĐÁNH GIÁ TÍNH KHẢ THI")
    add_p(
        "Báo cáo Mô hình Kinh doanh Canvas của dự án VietFit đã làm sáng tỏ 4 cấu phần quan trọng nhất trong việc định hình "
        "và đưa sản phẩm ra thị trường thể thao - thể hình Việt Nam:"
    )
    add_bullet("Xác định chính xác 3 nhóm khách hàng với các nỗi đau thực tế (Newbie sợ sai form, Gymer lúng túng tính đĩa tạ, VĐV lo ngại bảo mật dữ liệu).", "1. Về Khách hàng mục tiêu: ")
    add_bullet("Bộ tính năng chuyên sâu (Body Map 5.600+ bài tập, Plate Math, Rest Timer, 100% Offline, Passkeys) giải quyết trực diện và triệt để các vấn đề của người tập.", "2. Về Tuyên ngôn giá trị: ")
    add_bullet("Kết hợp linh hoạt giữa Web PWA trực tiếp, Chợ ứng dụng gián tiếp và kế hoạch 16 bài đăng mạng xã hội bài bản, đảm bảo đạt chỉ tiêu tiếp cận trên 1.000 người tự nhiên.", "3. Về Kênh phân phối & Truyền thông: ")
    add_bullet("Mô hình Get - Keep - Grow rõ ràng, ứng dụng Gamification chuỗi ngày tập để giữ chân người dùng và tạo đòn bẩy phát triển cộng đồng vững mạnh.", "4. Về Quan hệ khách hàng: ")
    add_p(
        "Dự án VietFit sở hữu tính khả thi kỹ thuật cao nhờ nền tảng mã nguồn đã hoàn thiện, giao diện tiếng Việt thân thiện "
        "và chiến lược truyền thông thực chiến, sẵn sàng bước vào giai đoạn thương mại hóa và phục vụ cộng đồng."
    )

    output_path = os.path.join(os.getcwd(), 'BAO_CAO_BMC_VIETFIT.docx')
    doc.save(output_path)
    print(f"Report generated successfully at: {output_path}")

if __name__ == '__main__':
    create_full_report()
