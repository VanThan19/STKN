// Curated exercise guidance for beginners and intermediate lifters:
// - Highlights foundational, high-ROI, joint-friendly exercises per muscle so newcomers aren't lost
//   in 5,600+ raw catalogue variations.
// - Provides difficulty & mechanic metadata, quick training-environment filters, and 1-tap starter
//   workout combos per muscle group.

import { EXIDX } from './exercises.js'
import { MUSCLES, MUSCLE_NAME, musclesOf } from './muscles.js'

const CORE_STAPLES = [
  '0025', '0047', '0289', '0314', '0251', '0155', '0308', '0662', '0596', '0576', // chest
  '0652', '1326', '0198', '0027', '0861', '0032', '0292', '0293', '0606', '0017', // back
  '0043', '3593', '0739', '0585', '0586', '0599', '0085', '0336', '1060', '0605', '1372', // legs/glutes/calves
  '1162', '0405', '0334', '0178', '11060', '2487', '0041', // shoulders
  '0031', '0294', '0313', '0318', '0868', '0070', '2249', '0060', '0061', '0194', '0200', '0030', '0019', // arms
  '0274', '0463', '0472', '0175', '0872', // abs
  '0095', '0406', '0220', '1018', '0329', // traps
  '5813', '4455', '1314', '4702', // lower back
]

export const CURATED_BY_MUSCLE = {
  trapezius: {
    essentialIds: ['0406', '0095', '0220', '0329', '1018', '11060'],
    combo: {
      titleVi: 'Combo Cầu Vai Dày & Vững (Người mới)',
      titleEn: 'Starter Traps & Upper-Back Combo',
      tipVi: 'Giữ cổ thẳng, kéo vai lên hướng tai và giữ 1 giây ở đỉnh; tránh xoay vai tròn gây đau khớp vai.',
      tipEn: 'Pull shoulders straight up toward your ears and pause 1s at the top; avoid rolling shoulders.',
      items: [
        { id: '0406', sets: 3, reps: 12, noteVi: 'Nhún vai tạ đơn — dễ giữ form nhất cho người mới', noteEn: 'Easy form control with dumbbells' },
        { id: '0220', sets: 3, reps: 12, noteVi: 'Kéo cáp giữ lực căng đều toàn biên độ', noteEn: 'Constant tension via cable stack' },
        { id: '11060', sets: 3, reps: 15, noteVi: 'Face Pull — cân bằng vai sau & cầu vai giữa', noteEn: 'Balances rear delts & middle traps' },
      ],
    },
  },
  deltoids: {
    essentialIds: ['0405', '1162', '0334', '0178', '2487', '11060', '0041', '0997'],
    combo: {
      titleVi: 'Combo Vai Tròn Đều 3 Bó Cơ',
      titleEn: 'Balanced 3-Head Shoulder Combo',
      tipVi: 'Ưu tiên tạ nhẹ kiểm soát đường đi thay vì vung lưng; ép nhẹ cùi chỏ ra trước ~30° khi đẩy vai.',
      tipEn: 'Use light-to-moderate weight with strict control; keep elbows ~30° forward on overhead presses.',
      items: [
        { id: '0405', sets: 3, reps: 10, noteVi: 'Đẩy vai ngồi — phát triển toàn bộ cơ vai trước & giữa', noteEn: 'Main compound press for overall shoulders' },
        { id: '0334', sets: 3, reps: 15, noteVi: 'Dang vai tạ đơn — mở rộng bề ngang bờ vai', noteEn: 'Side delt width builder' },
        { id: '11060', sets: 3, reps: 15, noteVi: 'Kéo cáp mặt (Face Pull) — bảo vệ khớp vai & vai sau', noteEn: 'Rear delts & rotator cuff health' },
      ],
    },
  },
  chest: {
    essentialIds: ['0576', '0289', '0314', '0025', '0047', '0662', '0596', '0155', '0308', '0251'],
    combo: {
      titleVi: 'Combo Ngực Nền Tảng Cho Người Mới',
      titleEn: 'Starter Chest Foundation Combo',
      tipVi: 'Hạ bả vai xuống và ưỡn nhẹ ngực khi đẩy; cùi chỏ mở góc ~45–60° (không bành ngang 90°).',
      tipEn: 'Keep shoulder blades retracted and elbows tucked ~45–60° to protect your shoulders.',
      items: [
        { id: '0576', sets: 3, reps: 10, noteVi: 'Đẩy ngực trên máy — an toàn, dễ cảm nhận cơ ngực', noteEn: 'Guided machine path, beginner safe' },
        { id: '0314', sets: 3, reps: 10, noteVi: 'Đẩy tạ đơn ghế dốc trên — làm đầy phần ngực trên', noteEn: 'Upper chest mass with natural wrist path' },
        { id: '0596', sets: 3, reps: 12, noteVi: 'Ép ngực máy (Pec Deck) — cô lập & kéo giãn cơ ngực', noteEn: 'Controlled chest squeeze on machine' },
        { id: '0662', sets: 2, reps: 12, noteVi: 'Hít đất — kết thúc buổi hoặc tập tại nhà', noteEn: 'Bodyweight finisher / at-home staple' },
      ],
    },
  },
  'upper-back': {
    essentialIds: ['0198', '0861', '0017', '0292', '0027', '0293', '0606', '0652', '1326'],
    combo: {
      titleVi: 'Combo Lưng Xô Rộng & Khỏe',
      titleEn: 'Starter Lats & Mid-Back Combo',
      tipVi: 'Hãy tưởng tượng kéo bằng cùi chỏ thay vì gồng tay trước; ép chặt hai bả vai vào nhau ở cuối nhịp.',
      tipEn: 'Lead the pull with your elbows and squeeze shoulder blades together at peak contraction.',
      items: [
        { id: '0198', sets: 3, reps: 10, noteVi: 'Kéo xô cáp (Lat Pulldown) — mở rộng lưng chữ V', noteEn: 'Vertical pull for lat width' },
        { id: '0861', sets: 3, reps: 12, noteVi: 'Kéo cáp ngồi (Seated Row) — làm dày lưng giữa', noteEn: 'Horizontal pull for posture & thickness' },
        { id: '0292', sets: 3, reps: 10, noteVi: 'Chèo tạ đơn 1 tay — sửa lệch hai bên lưng', noteEn: 'Unilateral row to fix imbalances' },
      ],
    },
  },
  serratus: {
    essentialIds: ['3021', '3011', '5025', '0328', '0050', '0759'],
    combo: {
      titleVi: 'Combo Cơ Răng Cưa & Ổn Định Bả Vai',
      titleEn: 'Serratus & Scapular Stability Combo',
      tipVi: 'Đẩy bả vai vươn hết cỡ ra trước (protraction) khi giữ thẳng tay; bài nhỏ nhưng rất tốt cho khớp vai.',
      tipEn: 'Push shoulder blades forward smoothly with straight arms for healthier pressing mechanics.',
      items: [
        { id: '3021', sets: 3, reps: 12, noteVi: 'Hít đất bả vai — dễ tập ở mọi nơi', noteEn: 'Foundational scapular push-up' },
        { id: '5025', sets: 3, reps: 10, noteVi: 'Trượt tay trên tường — cải thiện biên độ vai', noteEn: 'Wall slide for shoulder mobility' },
        { id: '0328', sets: 3, reps: 12, noteVi: 'Nâng vai ghế nghiêng — tăng lực cơ răng cưa', noteEn: 'Loaded serratus reach' },
      ],
    },
  },
  biceps: {
    essentialIds: ['0294', '0313', '0868', '0031', '0318', '0070', '0080'],
    combo: {
      titleVi: 'Combo Tay Trước Đầy Đặn',
      titleEn: 'Starter Biceps & Brachialis Combo',
      tipVi: 'Giữ chặt cùi chỏ sát thân người, không đung đưa lưng; hạ tạ chậm 2 giây.',
      tipEn: 'Pin elbows to your sides without swinging your torso; lower the weight with a 2s negative.',
      items: [
        { id: '0294', sets: 3, reps: 12, noteVi: 'Cuốn tạ đơn — bài nền tảng cho cả hai tay cân đối', noteEn: 'Classic dumbbell curl for symmetry' },
        { id: '0313', sets: 3, reps: 12, noteVi: 'Cuốn tạ kiểu búa (Hammer) — giúp cánh tay dày hơn', noteEn: 'Hits brachialis & forearms' },
        { id: '0868', sets: 3, reps: 15, noteVi: 'Cuốn cáp đứng — giữ lực căng liên tục', noteEn: 'Constant cable tension finisher' },
      ],
    },
  },
  triceps: {
    essentialIds: ['2249', '0200', '0194', '0019', '0060', '0030', '0394'],
    combo: {
      titleVi: 'Combo Tay Sau Săn Chắc',
      titleEn: 'Starter Triceps 3-Head Combo',
      tipVi: 'Khóa cố định phần cánh tay trên, chỉ gập và duỗi khớp khuỷu tay; tay sau chiếm tới 2/3 kích thước bắp tay.',
      tipEn: 'Keep upper arms locked in place; triceps make up two-thirds of total arm size.',
      items: [
        { id: '0200', sets: 3, reps: 12, noteVi: 'Đẩy cáp dây thừng — cực kỳ thân thiện với khớp khuỷu', noteEn: 'Joint-friendly rope pushdown' },
        { id: '0194', sets: 3, reps: 12, noteVi: 'Duỗi tay qua đầu bằng cáp — đánh vào đầu dài tay sau', noteEn: 'Stretches the long head of triceps' },
        { id: '0019', sets: 3, reps: 10, noteVi: 'Xà kép trợ lực máy — tăng sức mạnh toàn khối tay sau', noteEn: 'Assisted compound dip for beginners' },
      ],
    },
  },
  forearm: {
    essentialIds: ['1412', '1411', '0082', '1016', '0994', '0080'],
    combo: {
      titleVi: 'Combo Cẳng Tay & Lực Nắm',
      titleEn: 'Forearm & Grip Strength Combo',
      tipVi: 'Bắt đầu với tạ rất nhẹ để tránh quá tải gân cổ tay; kiểm soát mượt ở điểm uốn cuối.',
      tipEn: 'Start with light weight to protect wrist tendons and control every rep smoothly.',
      items: [
        { id: '1412', sets: 3, reps: 15, noteVi: 'Cuốn cổ tay ngửa lòng bàn tay', noteEn: 'Wrist flexor builder' },
        { id: '1411', sets: 3, reps: 15, noteVi: 'Cuốn cổ tay úp lòng bàn tay', noteEn: 'Wrist extensor balance' },
        { id: '0313', sets: 3, reps: 12, noteVi: 'Hammer Curl — tăng đồng thời cẳng tay & bắp tay', noteEn: 'Builds brachioradialis mass' },
      ],
    },
  },
  abs: {
    essentialIds: ['0463', '0274', '0872', '0175', '0472', '0003'],
    combo: {
      titleVi: 'Combo Cơ Bụng & Lõi Core Vững Chắc',
      titleEn: 'Beginner Core & Abs Combo',
      tipVi: 'Cuộn xương sống và gồng bụng thở ra ở cuối nhịp thay vì giật cổ hoặc gập hông bằng lưng dưới.',
      tipEn: 'Curl your ribcage toward your pelvis and exhale at peak squeeze instead of pulling on your neck.',
      items: [
        { id: '0463', sets: 3, reps: 30, noteVi: 'Plank giữ thẳng lưng ~30–45 giây', noteEn: 'Core stability foundation (hold seconds)' },
        { id: '0274', sets: 3, reps: 15, noteVi: 'Gập bụng trên thảm — chậm và cảm nhận cơ bụng', noteEn: 'Controlled floor crunch' },
        { id: '0872', sets: 3, reps: 12, noteVi: 'Gập bụng ngược — tác động tốt vào bụng dưới', noteEn: 'Lower abs focus' },
      ],
    },
  },
  obliques: {
    essentialIds: ['3544', '0014', '0223', '0222', '0002', '0985'],
    combo: {
      titleVi: 'Combo Cơ Liên Sườn Thon Gọn',
      titleEn: 'Starter Obliques & Waist Stability Combo',
      tipVi: 'Không dùng tạ quá nặng nếu muốn giữ eo gọn; ưu tiên các bài Plank nghiêng và xoay thân có kiểm soát.',
      tipEn: 'Favor anti-rotation holds and controlled twists over heavy loaded side bends for waist aesthetics.',
      items: [
        { id: '3544', sets: 3, reps: 25, noteVi: 'Side Plank giữ thăng bằng mỗi bên', noteEn: 'Lateral core endurance' },
        { id: '0014', sets: 3, reps: 16, noteVi: 'Xoay thân Russian Twist nhẹ nhàng', noteEn: 'Rotational oblique work' },
        { id: '0223', sets: 3, reps: 15, noteVi: 'Kéo cáp chéo sườn', noteEn: 'Guided cable oblique crunch' },
      ],
    },
  },
  'lower-back': {
    essentialIds: ['5813', '4455', '4702', '1314', '0085', '0032'],
    combo: {
      titleVi: 'Combo Lưng Dưới Khỏe & Hết Đau Lưng',
      titleEn: 'Healthy Lower Back & Posterior Combo',
      tipVi: 'Giữ cột sống trung tính (không ưỡn quá mức ở đỉnh); siết cơ mông cùng lúc để bảo vệ thắt lưng.',
      tipEn: 'Keep a neutral spine without hyperextending at the top; squeeze glutes to support your lower back.',
      items: [
        { id: '5813', sets: 3, reps: 12, noteVi: 'Gập lưng trên ghế 45° — an toàn nhất để làm khỏe lưng dưới', noteEn: 'Safest lower-back & glute builder' },
        { id: '4702', sets: 3, reps: 12, noteVi: 'Superman trên thảm — không cần dụng cụ', noteEn: 'At-home spinal erector drill' },
        { id: '0085', sets: 3, reps: 10, noteVi: 'RDL tạ nhẹ — học cách gập hông chuẩn (Hip Hinge)', noteEn: 'Teaches proper hip-hinge mechanics' },
      ],
    },
  },
  gluteal: {
    essentialIds: ['1060', '1409', '0336', '0085', '0431', '0739', '0043', '0032'],
    combo: {
      titleVi: 'Combo Cơ Mông Săn Chắc & Khỏe',
      titleEn: 'Starter Glutes Strength & Shape Combo',
      tipVi: 'Đẩy lực qua gót chân, cằm hơi cúi về trước và giữ hông không võng lưng dưới khi siết mông.',
      tipEn: 'Drive through your heels, keep ribs tucked down, and lock out with your glutes rather than arching your lower back.',
      items: [
        { id: '1409', sets: 3, reps: 12, noteVi: 'Đẩy hông (Glute Bridge) — dễ học kỹ thuật siết mông', noteEn: 'Beginner-friendly glute isolation' },
        { id: '1060', sets: 3, reps: 10, noteVi: 'Hip Thrust — vua của các bài tăng vòng 3', noteEn: 'Top overall glute developer' },
        { id: '0336', sets: 3, reps: 10, noteVi: 'Chùng chân tạ đơn (Lunge) — siết sâu mông & đùi', noteEn: 'Unilateral glute & leg builder' },
      ],
    },
  },
  quadriceps: {
    essentialIds: ['0739', '10191', '0585', '3593', '0043', '4442', '0336'],
    combo: {
      titleVi: 'Combo Đùi Trước Vững Chắc Cho Người Mới',
      titleEn: 'Beginner Quads Strength Combo',
      tipVi: 'Đầu gối hướng thẳng theo mũi bàn chân, không để hai gối sụp vào trong khi đứng lên.',
      tipEn: 'Track knees in line with your toes and keep your full foot planted throughout each rep.',
      items: [
        { id: '0739', sets: 3, reps: 10, noteVi: 'Đạp chân máy 45° (Leg Press) — tăng tạ an toàn không lo đau lưng', noteEn: 'Safe heavy quad loading on sled' },
        { id: '10191', sets: 3, reps: 12, noteVi: 'Squat tạ đơn ôm ngực — học form Squat chuẩn xác', noteEn: 'Teaches upright squat posture' },
        { id: '0585', sets: 3, reps: 15, noteVi: 'Đá đùi trước trên máy — cô lập cơ đùi trước rõ nét', noteEn: 'Controlled machine quad isolation' },
      ],
    },
  },
  hamstring: {
    essentialIds: ['0599', '0586', '1459', '0085', '0044', '1409'],
    combo: {
      titleVi: 'Combo Đùi Sau & Gân Khoeo Cân Đối',
      titleEn: 'Starter Hamstrings Combo',
      tipVi: 'Gập hông đẩy mông ra sau khi tập RDL; không gù lưng và giữ thanh tạ/tạ đơn trượt sát đùi.',
      tipEn: 'Push hips back with a flat spine on hinges and control the return on leg curls.',
      items: [
        { id: '0599', sets: 3, reps: 12, noteVi: 'Cuốn đùi sau ngồi máy — dễ làm quen & lực căng chuẩn', noteEn: 'Seated curl provides optimal stretch' },
        { id: '1459', sets: 3, reps: 10, noteVi: 'Romanian Deadlift tạ đơn — tập cả đùi sau lẫn mông', noteEn: 'Dumbbell hip hinge for hams & glutes' },
        { id: '0586', sets: 3, reps: 12, noteVi: 'Nằm sấp cuốn đùi sau', noteEn: 'Alternative machine hamstring curl' },
      ],
    },
  },
  adductors: {
    essentialIds: ['0598', '0168', '3667', '1775', '1494'],
    combo: {
      titleVi: 'Combo Đùi Trong Vững Khớp Hông',
      titleEn: 'Starter Inner Thigh / Adductors Combo',
      tipVi: 'Khép chân dứt khoát và thả ra chậm rãi trong 2 giây; giúp Squat ổn định hơn rất nhiều.',
      tipEn: 'Use smooth tempo and full stretch; strong adductors stabilize squats and protect your knees.',
      items: [
        { id: '0598', sets: 3, reps: 15, noteVi: 'Máy ép đùi trong — trực quan & dễ chỉnh tạ', noteEn: 'Machine adduction for steady progression' },
        { id: '3667', sets: 3, reps: 15, noteVi: 'Nằm nghiêng nâng chân tại nhà', noteEn: 'Bodyweight adductor activation' },
        { id: '1494', sets: 2, reps: 30, noteVi: 'Tư thế cánh bướm — giãn mềm khớp háng sau tập', noteEn: 'Post-workout hip & groin mobility' },
      ],
    },
  },
  'hip-flexors': {
    essentialIds: ['8191', '8876', '4287', '1507', '1021'],
    combo: {
      titleVi: 'Combo Cơ Gập Hông Linh Hoạt',
      titleEn: 'Hip Flexor Strength & Mobility Combo',
      tipVi: 'Dân văn phòng ngồi nhiều rất dễ yếu và cứng cơ gập hông; tập nhẹ để chạy và Squat mượt hơn.',
      tipEn: 'Essential for desk workers: strengthens weak hip flexors and improves squat/sprint mechanics.',
      items: [
        { id: '8191', sets: 3, reps: 12, noteVi: 'Kéo cáp gập hông đứng', noteEn: 'Controlled resistance hip flexion' },
        { id: '4287', sets: 3, reps: 12, noteVi: 'Nâng gối nhẹ kiểm soát khớp hông', noteEn: 'Bodyweight hip mobility & activation' },
        { id: '1021', sets: 3, reps: 12, noteVi: 'Nâng chân với dây kháng lực', noteEn: 'Elastic band resistance drill' },
      ],
    },
  },
  calves: {
    essentialIds: ['0605', '0417', '1372', '0088', '1370'],
    combo: {
      titleVi: 'Combo Bắp Chân Săn Chắc',
      titleEn: 'Starter Calves Combo',
      tipVi: 'Đừng nhún nhanh bật gân gót! Hãy hạ gót sâu hết cỡ giữ 1 giây ở đáy rồi mới nhón lên cao nhất.',
      tipEn: 'Pause for 1 full second in the bottom stretch on every rep to avoid bouncing off the Achilles tendon.',
      items: [
        { id: '0605', sets: 4, reps: 15, noteVi: 'Nhón bắp chân máy đứng — biên độ sâu tối ưu', noteEn: 'Full-range standing machine calf raise' },
        { id: '0417', sets: 3, reps: 15, noteVi: 'Nhón bắp chân tạ đơn — tập mọi nơi với bục kê', noteEn: 'Single- or double-leg dumbbell raise' },
        { id: '0088', sets: 3, reps: 15, noteVi: 'Nhón bắp chân ngồi — kích thích cơ dép sâu bên trong', noteEn: 'Seated angle targets the soleus' },
      ],
    },
  },
  tibialis: {
    essentialIds: ['8536', '9509', '10294', '2761', '10367'],
    combo: {
      titleVi: 'Combo Ống Đồng — Bảo Vệ Đầu Gối Khi Chạy',
      titleEn: 'Knee-Health & Shin (Tibialis) Combo',
      tipVi: 'Rất hiệu quả để phòng ngừa đau khớp gối khi chạy bộ, đá bóng hoặc tập chân nặng.',
      tipEn: 'Strengthening the tibialis reduces shin splints and protects the knees during running & squats.',
      items: [
        { id: '8536', sets: 3, reps: 15, noteVi: 'Tựa lưng tường nhấc mũi chân — bài tập dễ nhất không cần máy', noteEn: 'Wall tibialis raise — zero gear needed' },
        { id: '10294', sets: 2, reps: 20, noteVi: 'Đi bộ bằng gót chân ~20 bước', noteEn: 'Simple warm-up heel walk' },
        { id: '9509', sets: 3, reps: 15, noteVi: 'Đẩy mũi chân bằng máy', noteEn: 'Loaded machine tibialis raise' },
      ],
    },
  },
}

export const CURATED_ID_SET = new Set([
  ...CORE_STAPLES,
  ...Object.values(CURATED_BY_MUSCLE).flatMap(m => m.essentialIds || []),
])

const ADVANCED_CATS = new Set(['olympic', 'plyometrics'])
const MOBILITY_CATS = new Set(['stretching', 'mobility', 'yoga', 'pilates', 'rehab'])
const BEGINNER_EQ = new Set(['leverage machine', 'cable', 'sled machine', 'smith machine', 'assisted'])
const ADVANCED_NAME = /\b(snatch|clean|jerk|pistol|muscle[\s-]up|planche|human flag|bosu|one arm.*pull-?up|single arm.*barbell|zercher)\b/i
const COMPOUND_NAME = /\b(press|squat|deadlift|row|pull-?up|chin-?up|dip|lunge|pulldown|thrust|push-?up|step-up|hyperextension)\b/i

/**
 * Classifies an exercise for beginners: whether it's an essential staple, its difficulty tier,
 * and its movement mechanic (compound vs isolation vs mobility).
 */
export function exerciseMetaOf(ex) {
  if (!ex) return { isEssential: false, difficulty: 'beginner', mechanic: 'isolation' }
  const isEssential = CURATED_ID_SET.has(ex.id)
  const name = ex.n || ''
  const cat = ex.cat || 'strength'
  const eq = ex.eq || ''

  let difficulty = 'intermediate'
  if (ADVANCED_CATS.has(cat) || ADVANCED_NAME.test(name)) {
    difficulty = 'advanced'
  } else if (
    BEGINNER_EQ.has(eq) ||
    MOBILITY_CATS.has(cat) ||
    (isEssential && ['body weight', 'dumbbell', 'band', 'resistance band'].includes(eq))
  ) {
    difficulty = 'beginner'
  }

  let mechanic = 'isolation'
  if (MOBILITY_CATS.has(cat)) {
    mechanic = 'mobility'
  } else if ((Array.isArray(ex.sm) && ex.sm.length >= 1) && COMPOUND_NAME.test(name)) {
    mechanic = 'compound'
  }

  return { isEssential, difficulty, mechanic }
}

/**
 * Returns true when `ex` is part of the curated essentials for `muscle` (or global staples if no muscle).
 */
export function isEssentialForMuscle(ex, muscle) {
  if (!ex) return false
  if (!muscle) return CURATED_ID_SET.has(ex.id)
  const group = CURATED_BY_MUSCLE[muscle]
  if (group?.essentialIds?.includes(ex.id)) return true
  const m = musclesOf(ex)
  return CURATED_ID_SET.has(ex.id) && m[muscle] === 1
}

/**
 * Quick training environment filters to save beginners from scrolling through 20+ equipment tags.
 */
export const QUICK_SCENES = [
  { id: 'all', icon: 'sparkles', labelKey: 'All setups', match: () => true },
  { id: 'home', icon: 'house', labelKey: 'At home (No gear)', match: e => ['body weight', 'band', 'resistance band', 'assisted', ''].includes(e?.eq || '') },
  { id: 'dumbbell', icon: 'dumbbell', labelKey: 'Dumbbells only', match: e => ['dumbbell', 'kettlebell'].includes(e?.eq) },
  { id: 'machine', icon: 'slider', labelKey: 'Machines & Cable', match: e => ['leverage machine', 'cable', 'sled machine', 'smith machine'].includes(e?.eq) },
  { id: 'barbell', icon: 'barbell', labelKey: 'Barbell & Strength', match: e => ['barbell', 'ez barbell', 'trap bar', 'olympic barbell'].includes(e?.eq) },
]

/**
 * Counts exercises targeting `muscleSlug` cleanly by separating primary-target exercises (weight 1)
 * from secondary-only exercises, and curated beginner essentials.
 */
export function muscleCountsOf(catalog, muscleSlug) {
  let primary = 0
  let total = 0
  let essential = 0
  for (const e of catalog) {
    const w = musclesOf(e)[muscleSlug]
    if (!w) continue
    total++
    if (w === 1) primary++
    if (isEssentialForMuscle(e, muscleSlug)) essential++
  }
  return { primary, total, essential }
}

/**
 * Returns resolved starter combo data (with real EXIDX objects) for a given muscle slug.
 */
export function muscleComboFor(muscleSlug) {
  const cfg = CURATED_BY_MUSCLE[muscleSlug]
  if (!cfg?.combo) return null
  const items = cfg.combo.items
    .map(it => {
      const ex = EXIDX[it.id]
      return ex ? { ...it, ex } : null
    })
    .filter(Boolean)
  if (!items.length) return null
  return { ...cfg.combo, items }
}

/**
 * Saves the muscle's beginner starter combo as a reusable Routine in user state `S.routines`.
 */
export function buildRoutineFromCombo(muscleSlug, lang = 'vi') {
  const combo = muscleComboFor(muscleSlug)
  if (!combo) return null
  const title = lang.startsWith('vi') ? combo.titleVi : combo.titleEn
  const muscleName = MUSCLE_NAME[muscleSlug] || muscleSlug
  const now = Date.now()
  return {
    id: 'starter_' + muscleSlug + '_' + now.toString(36),
    name: title || `${muscleName} Starter`,
    ex: combo.items.map(it => ({
      id: it.ex.id,
      sets: it.sets,
      reps: it.reps,
      note: lang.startsWith('vi') ? it.noteVi : it.noteEn,
    })),
    _ts: now,
  }
}

export { MUSCLES }
