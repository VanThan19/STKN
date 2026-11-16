// International-standard nutrition database (USDA / standard fitness macros per serving).
// Each food carries both international English and Vietnamese names for seamless search and display.

export const FOOD_CATEGORIES = [
  { id: 'all', label: 'All foods' },
  { id: 'protein', label: 'Lean Protein' },
  { id: 'carbs', label: 'Complex Carbs & Grains' },
  { id: 'fats', label: 'Healthy Fats & Nuts' },
  { id: 'dairy', label: 'Dairy & Alternatives' },
  { id: 'produce', label: 'Vegetables & Fruits' },
  { id: 'supplements', label: 'Supplements & Shakes' },
  { id: 'meals', label: 'Balanced Meals' }
]

export const ALLERGEN_LIST = [
  { id: 'dairy', label: 'Dairy / Lactose' },
  { id: 'egg', label: 'Eggs' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree_nuts', label: 'Tree Nuts' },
  { id: 'soy', label: 'Soy' },
  { id: 'gluten', label: 'Gluten / Wheat' }
]

export const FOODS_DB = [
  // --- LEAN PROTEIN ---
  {
    id: 'f_chicken_breast',
    name: 'Chicken Breast, Cooked (Ức gà chín)',
    category: 'protein',
    servingLabel: '100 g',
    grams: 100,
    kcal: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    allergens: [],
    tags: ['high_protein', 'low_carb', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_salmon',
    name: 'Atlantic Salmon, Cooked (Cá hồi áp chảo)',
    category: 'protein',
    servingLabel: '100 g',
    grams: 100,
    kcal: 206,
    protein: 22.1,
    carbs: 0,
    fat: 12.4,
    fiber: 0,
    allergens: ['fish'],
    tags: ['high_protein', 'low_carb', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_beef_sirloin',
    name: 'Lean Beef Sirloin, Cooked (Thịt bò thăn)',
    category: 'protein',
    servingLabel: '100 g',
    grams: 100,
    kcal: 201,
    protein: 29.5,
    carbs: 0,
    fat: 8.3,
    fiber: 0,
    allergens: [],
    tags: ['high_protein', 'low_carb', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_pork_tenderloin',
    name: 'Pork Tenderloin, Cooked (Thịt heo thăn)',
    category: 'protein',
    servingLabel: '100 g',
    grams: 100,
    kcal: 143,
    protein: 26.2,
    carbs: 0,
    fat: 3.5,
    fiber: 0,
    allergens: [],
    tags: ['high_protein', 'low_carb', 'whole_food']
  },
  {
    id: 'f_whole_egg',
    name: 'Whole Egg, Large (Trứng gà nguyên quả)',
    category: 'protein',
    servingLabel: '1 large (50 g)',
    grams: 50,
    kcal: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 4.8,
    fiber: 0,
    allergens: ['egg'],
    tags: ['high_protein', 'low_carb', 'vegetarian', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_egg_whites',
    name: 'Liquid Egg Whites (Lòng trắng trứng)',
    category: 'protein',
    servingLabel: '100 g (~3 whites)',
    grams: 100,
    kcal: 52,
    protein: 10.9,
    carbs: 0.7,
    fat: 0.2,
    fiber: 0,
    allergens: ['egg'],
    tags: ['high_protein', 'low_carb', 'vegetarian', 'whole_food']
  },
  {
    id: 'f_tuna_water',
    name: 'Canned Tuna in Water (Cá ngừ ngâm nước)',
    category: 'protein',
    servingLabel: '1 can drained (120 g)',
    grams: 120,
    kcal: 139,
    protein: 30.6,
    carbs: 0,
    fat: 1,
    fiber: 0,
    allergens: ['fish'],
    tags: ['high_protein', 'low_carb', 'beginner_friendly']
  },
  {
    id: 'f_shrimp',
    name: 'Shrimp, Cooked (Tôm hấp/luộc)',
    category: 'protein',
    servingLabel: '100 g',
    grams: 100,
    kcal: 99,
    protein: 24,
    carbs: 0.2,
    fat: 0.3,
    fiber: 0,
    allergens: ['shellfish'],
    tags: ['high_protein', 'low_carb', 'whole_food']
  },
  {
    id: 'f_tofu_firm',
    name: 'Firm Tofu (Đậu hũ trắng)',
    category: 'protein',
    servingLabel: '100 g',
    grams: 100,
    kcal: 144,
    protein: 15.8,
    carbs: 2.8,
    fat: 8.7,
    fiber: 2.3,
    allergens: ['soy'],
    tags: ['high_protein', 'vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_white_fish',
    name: 'Tilapia / White Fish Fillet (Phi lê cá trắng)',
    category: 'protein',
    servingLabel: '100 g',
    grams: 100,
    kcal: 128,
    protein: 26,
    carbs: 0,
    fat: 2.7,
    fiber: 0,
    allergens: ['fish'],
    tags: ['high_protein', 'low_carb', 'whole_food']
  },

  // --- DAIRY & ALTERNATIVES ---
  {
    id: 'f_greek_yogurt_0',
    name: 'Greek Yogurt, 0% Nonfat (Sữa chua Hy Lạp tách béo)',
    category: 'dairy',
    servingLabel: '1 cup (170 g)',
    grams: 170,
    kcal: 100,
    protein: 17,
    carbs: 6,
    fat: 0.7,
    fiber: 0,
    allergens: ['dairy'],
    tags: ['high_protein', 'vegetarian', 'beginner_friendly']
  },
  {
    id: 'f_cottage_cheese',
    name: 'Low-Fat Cottage Cheese (Phô mai tươi ít béo)',
    category: 'dairy',
    servingLabel: '100 g',
    grams: 100,
    kcal: 82,
    protein: 11.1,
    carbs: 4.3,
    fat: 2.3,
    fiber: 0,
    allergens: ['dairy'],
    tags: ['high_protein', 'vegetarian']
  },
  {
    id: 'f_milk_skim',
    name: 'Low-Fat / Skim Milk (Sữa tươi tách béo)',
    category: 'dairy',
    servingLabel: '1 glass (240 ml)',
    grams: 240,
    kcal: 83,
    protein: 8.3,
    carbs: 12.2,
    fat: 0.2,
    fiber: 0,
    allergens: ['dairy'],
    tags: ['vegetarian', 'beginner_friendly']
  },
  {
    id: 'f_soy_milk',
    name: 'Unsweetened Soy Milk (Sữa đậu nành không đường)',
    category: 'dairy',
    servingLabel: '1 glass (240 ml)',
    grams: 240,
    kcal: 80,
    protein: 7,
    carbs: 4,
    fat: 4,
    fiber: 1,
    allergens: ['soy'],
    tags: ['vegetarian', 'vegan', 'beginner_friendly']
  },

  // --- COMPLEX CARBS & GRAINS ---
  {
    id: 'f_oats_rolled',
    name: 'Rolled Oats, Dry (Yến mạch cán dẹt)',
    category: 'carbs',
    servingLabel: '1/2 cup (40 g)',
    grams: 40,
    kcal: 152,
    protein: 5.3,
    carbs: 27,
    fat: 2.6,
    fiber: 4,
    allergens: ['gluten'],
    tags: ['vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_white_rice',
    name: 'White Rice, Cooked (Cơm trắng)',
    category: 'carbs',
    servingLabel: '1 bowl (150 g)',
    grams: 150,
    kcal: 195,
    protein: 4.1,
    carbs: 42.3,
    fat: 0.4,
    fiber: 0.6,
    allergens: [],
    tags: ['vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_brown_rice',
    name: 'Brown Rice, Cooked (Cơm gạo lứt)',
    category: 'carbs',
    servingLabel: '1 bowl (150 g)',
    grams: 150,
    kcal: 168,
    protein: 3.9,
    carbs: 35.3,
    fat: 1.4,
    fiber: 2.7,
    allergens: [],
    tags: ['vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_sweet_potato',
    name: 'Sweet Potato, Baked/Boiled (Khoai lang chín)',
    category: 'carbs',
    servingLabel: '1 medium (150 g)',
    grams: 150,
    kcal: 135,
    protein: 3,
    carbs: 31.1,
    fat: 0.2,
    fiber: 4.5,
    allergens: [],
    tags: ['vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_potato_boiled',
    name: 'White Potato, Boiled (Khoai tây luộc)',
    category: 'carbs',
    servingLabel: '150 g',
    grams: 150,
    kcal: 130,
    protein: 2.8,
    carbs: 30.2,
    fat: 0.2,
    fiber: 2.7,
    allergens: [],
    tags: ['vegetarian', 'vegan', 'whole_food']
  },
  {
    id: 'f_quinoa',
    name: 'Quinoa, Cooked (Hạt diêm mạch chín)',
    category: 'carbs',
    servingLabel: '1 cup (185 g)',
    grams: 185,
    kcal: 222,
    protein: 8.1,
    carbs: 39.4,
    fat: 3.6,
    fiber: 5.2,
    allergens: [],
    tags: ['vegetarian', 'vegan', 'whole_food']
  },
  {
    id: 'f_whole_wheat_bread',
    name: 'Whole Wheat Bread (Bánh mì nguyên cám)',
    category: 'carbs',
    servingLabel: '1 slice (32 g)',
    grams: 32,
    kcal: 81,
    protein: 4,
    carbs: 13.8,
    fat: 1.1,
    fiber: 1.9,
    allergens: ['gluten'],
    tags: ['vegetarian', 'vegan', 'beginner_friendly']
  },
  {
    id: 'f_pasta_cooked',
    name: 'Pasta / Spaghetti, Cooked (Mì Ý luộc)',
    category: 'carbs',
    servingLabel: '1 cup (140 g)',
    grams: 140,
    kcal: 221,
    protein: 8.1,
    carbs: 43.2,
    fat: 1.3,
    fiber: 2.5,
    allergens: ['gluten'],
    tags: ['vegetarian', 'vegan']
  },

  // --- HEALTHY FATS & NUTS ---
  {
    id: 'f_avocado',
    name: 'Hass Avocado (Quả bơ sáp)',
    category: 'fats',
    servingLabel: '1/2 medium (100 g)',
    grams: 100,
    kcal: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    allergens: [],
    tags: ['low_carb', 'vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_olive_oil',
    name: 'Extra Virgin Olive Oil (Dầu ô liu nguyên chất)',
    category: 'fats',
    servingLabel: '1 tbsp (14 g)',
    grams: 14,
    kcal: 119,
    protein: 0,
    carbs: 0,
    fat: 13.5,
    fiber: 0,
    allergens: [],
    tags: ['low_carb', 'vegetarian', 'vegan', 'whole_food']
  },
  {
    id: 'f_almonds',
    name: 'Raw Almonds (Hạt hạnh nhân)',
    category: 'fats',
    servingLabel: '1 oz (28 g)',
    grams: 28,
    kcal: 164,
    protein: 6,
    carbs: 6.1,
    fat: 14.2,
    fiber: 3.5,
    allergens: ['tree_nuts'],
    tags: ['low_carb', 'vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_peanut_butter',
    name: 'Natural Peanut Butter (Bơ đậu phộng tự nhiên)',
    category: 'fats',
    servingLabel: '2 tbsp (32 g)',
    grams: 32,
    kcal: 188,
    protein: 8,
    carbs: 6.4,
    fat: 16,
    fiber: 1.9,
    allergens: ['peanuts'],
    tags: ['vegetarian', 'vegan', 'beginner_friendly']
  },
  {
    id: 'f_chia_seeds',
    name: 'Chia Seeds (Hạt chia)',
    category: 'fats',
    servingLabel: '1 tbsp (15 g)',
    grams: 15,
    kcal: 73,
    protein: 2.5,
    carbs: 6.3,
    fat: 4.6,
    fiber: 5.2,
    allergens: [],
    tags: ['vegetarian', 'vegan', 'whole_food']
  },

  // --- VEGETABLES & FRUITS ---
  {
    id: 'f_broccoli',
    name: 'Broccoli, Steamed (Bông cải xanh hấp)',
    category: 'produce',
    servingLabel: '1 cup (150 g)',
    grams: 150,
    kcal: 53,
    protein: 3.6,
    carbs: 10.8,
    fat: 0.6,
    fiber: 5,
    allergens: [],
    tags: ['low_carb', 'vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_spinach',
    name: 'Spinach / Leafy Greens (Rau bina / Rau xanh)',
    category: 'produce',
    servingLabel: '100 g',
    grams: 100,
    kcal: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    allergens: [],
    tags: ['low_carb', 'vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_banana',
    name: 'Banana, Medium (Chuối chín)',
    category: 'produce',
    servingLabel: '1 medium (118 g)',
    grams: 118,
    kcal: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    allergens: [],
    tags: ['vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_apple',
    name: 'Apple, Medium (Táo tươi)',
    category: 'produce',
    servingLabel: '1 medium (182 g)',
    grams: 182,
    kcal: 95,
    protein: 0.5,
    carbs: 25.1,
    fat: 0.3,
    fiber: 4.4,
    allergens: [],
    tags: ['vegetarian', 'vegan', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_blueberries',
    name: 'Blueberries / Berries (Việt quất / Dâu tây)',
    category: 'produce',
    servingLabel: '1 cup (148 g)',
    grams: 148,
    kcal: 84,
    protein: 1.1,
    carbs: 21.5,
    fat: 0.5,
    fiber: 3.6,
    allergens: [],
    tags: ['vegetarian', 'vegan', 'whole_food']
  },

  // --- SUPPLEMENTS & SHAKES ---
  {
    id: 'f_whey_isolate',
    name: 'Whey Protein Isolate (1 Scoop)',
    category: 'supplements',
    servingLabel: '1 scoop (30 g)',
    grams: 30,
    kcal: 115,
    protein: 25,
    carbs: 1.5,
    fat: 0.5,
    fiber: 0,
    allergens: ['dairy'],
    tags: ['high_protein', 'low_carb', 'vegetarian', 'beginner_friendly']
  },
  {
    id: 'f_casein',
    name: 'Micellar Casein Protein (1 Scoop)',
    category: 'supplements',
    servingLabel: '1 scoop (33 g)',
    grams: 33,
    kcal: 120,
    protein: 24,
    carbs: 3,
    fat: 1,
    fiber: 0,
    allergens: ['dairy'],
    tags: ['high_protein', 'low_carb', 'vegetarian']
  },
  {
    id: 'f_protein_bar',
    name: 'High-Protein Bar (Thanh Protein)',
    category: 'supplements',
    servingLabel: '1 bar (60 g)',
    grams: 60,
    kcal: 200,
    protein: 20,
    carbs: 22,
    fat: 7,
    fiber: 10,
    allergens: ['dairy', 'soy'],
    tags: ['high_protein', 'vegetarian', 'beginner_friendly']
  },

  // --- BALANCED MEALS ---
  {
    id: 'f_chicken_rice_bowl',
    name: 'Grilled Chicken, Rice & Broccoli Bowl',
    category: 'meals',
    servingLabel: '1 bowl (400 g)',
    grams: 400,
    kcal: 465,
    protein: 42,
    carbs: 54,
    fat: 7.5,
    fiber: 5.5,
    allergens: [],
    tags: ['high_protein', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_salmon_quinoa_bowl',
    name: 'Salmon, Quinoa & Avocado Power Bowl',
    category: 'meals',
    servingLabel: '1 bowl (420 g)',
    grams: 420,
    kcal: 540,
    protein: 34,
    carbs: 44,
    fat: 24,
    fiber: 8,
    allergens: ['fish'],
    tags: ['high_protein', 'whole_food', 'beginner_friendly']
  },
  {
    id: 'f_pro_oats_bowl',
    name: 'Protein Oatmeal with Banana & Berries',
    category: 'meals',
    servingLabel: '1 bowl (350 g)',
    grams: 350,
    kcal: 380,
    protein: 31,
    carbs: 52,
    fat: 5,
    fiber: 7.5,
    allergens: ['dairy', 'gluten'],
    tags: ['high_protein', 'vegetarian', 'beginner_friendly']
  },
  {
    id: 'f_pho_bo_lean',
    name: 'Beef Noodle Soup, Lean Sirloin (Phở bò tái)',
    category: 'meals',
    servingLabel: '1 regular bowl (500 g)',
    grams: 500,
    kcal: 430,
    protein: 28,
    carbs: 56,
    fat: 9,
    fiber: 2,
    allergens: [],
    tags: ['high_protein', 'beginner_friendly']
  }
]

// Beginner-friendly ready-made meal combos per slot (1-tap add)
export const BEGINNER_MEAL_COMBOS = [
  {
    id: 'combo_bf_oats_yogurt',
    slot: 'breakfast',
    title: 'Easy Oats & Greek Yogurt Bowl',
    desc: '5-minute no-cook breakfast: Rolled Oats + Greek Yogurt + Banana (457 kcal · 24g Protein)',
    items: [
      { foodId: 'f_oats_rolled', servings: 1 },
      { foodId: 'f_greek_yogurt_0', servings: 1 },
      { foodId: 'f_banana', servings: 1 }
    ]
  },
  {
    id: 'combo_bf_eggs_toast',
    slot: 'breakfast',
    title: 'Classic Eggs & Whole Wheat Toast',
    desc: '2 Whole Eggs + 2 slices Whole Wheat Bread + Apple (401 kcal · 21g Protein)',
    items: [
      { foodId: 'f_whole_egg', servings: 2 },
      { foodId: 'f_whole_wheat_bread', servings: 2 },
      { foodId: 'f_apple', servings: 1 }
    ]
  },
  {
    id: 'combo_lu_chicken_rice',
    slot: 'lunch',
    title: 'Beginner Chicken, Rice & Greens',
    desc: '150g Chicken Breast + 1 bowl White Rice + Steamed Broccoli (496 kcal · 54g Protein)',
    items: [
      { foodId: 'f_chicken_breast', servings: 1.5 },
      { foodId: 'f_white_rice', servings: 1 },
      { foodId: 'f_broccoli', servings: 1 }
    ]
  },
  {
    id: 'combo_dn_salmon_sweetpotato',
    slot: 'dinner',
    title: 'Salmon & Sweet Potato Plate',
    desc: '150g Atlantic Salmon + 1 Sweet Potato + Spinach (467 kcal · 39g Protein)',
    items: [
      { foodId: 'f_salmon', servings: 1.5 },
      { foodId: 'f_sweet_potato', servings: 1 },
      { foodId: 'f_spinach', servings: 1 }
    ]
  },
  {
    id: 'combo_sn_whey_almonds',
    slot: 'snack',
    title: 'Post-Workout Whey & Almonds',
    desc: '1 scoop Whey Isolate + 1 oz Almonds (279 kcal · 31g Protein)',
    items: [
      { foodId: 'f_whey_isolate', servings: 1 },
      { foodId: 'f_almonds', servings: 1 }
    ]
  }
]

// 1-Tap Full-Day Meal Plan Templates (solves repetitive daily meal setting)
export const STARTER_MEAL_PLANS = [
  {
    id: 'plan_beginner_balanced',
    name: 'Beginner Easy & Balanced (~1,700 kcal · 148g Protein)',
    goal: 'maintain',
    desc: 'Simple, easy-to-eat everyday foods with balanced macros for beginners.',
    meals: {
      breakfast: [
        { foodId: 'f_oats_rolled', servings: 1 },
        { foodId: 'f_greek_yogurt_0', servings: 1 },
        { foodId: 'f_banana', servings: 1 }
      ],
      lunch: [
        { foodId: 'f_chicken_breast', servings: 1.5 },
        { foodId: 'f_white_rice', servings: 1 },
        { foodId: 'f_broccoli', servings: 1 }
      ],
      snack: [
        { foodId: 'f_whey_isolate', servings: 1 },
        { foodId: 'f_apple', servings: 1 }
      ],
      dinner: [
        { foodId: 'f_salmon', servings: 1.2 },
        { foodId: 'f_sweet_potato', servings: 1 },
        { foodId: 'f_spinach', servings: 1 }
      ]
    }
  },
  {
    id: 'plan_fat_loss_cut',
    name: 'High-Protein Lean Cut (~1,480 kcal · 162g Protein)',
    goal: 'cut',
    desc: 'High satiety, high protein, moderate complex carbs to lose fat without hunger.',
    meals: {
      breakfast: [
        { foodId: 'f_whole_egg', servings: 2 },
        { foodId: 'f_egg_whites', servings: 1 },
        { foodId: 'f_whole_wheat_bread', servings: 1 }
      ],
      lunch: [
        { foodId: 'f_chicken_breast', servings: 1.5 },
        { foodId: 'f_brown_rice', servings: 1 },
        { foodId: 'f_broccoli', servings: 1 }
      ],
      snack: [
        { foodId: 'f_greek_yogurt_0', servings: 1 },
        { foodId: 'f_blueberries', servings: 1 }
      ],
      dinner: [
        { foodId: 'f_white_fish', servings: 1.5 },
        { foodId: 'f_sweet_potato', servings: 1 },
        { foodId: 'f_spinach', servings: 1 }
      ]
    }
  },
  {
    id: 'plan_muscle_bulk',
    name: 'Lean Muscle Gain / Bulk (~2,350 kcal · 185g Protein)',
    goal: 'lean_bulk',
    desc: 'Calorie-dense clean foods to fuel progressive overload and muscle recovery.',
    meals: {
      breakfast: [
        { foodId: 'f_pro_oats_bowl', servings: 1 },
        { foodId: 'f_peanut_butter', servings: 1 }
      ],
      lunch: [
        { foodId: 'f_beef_sirloin', servings: 1.5 },
        { foodId: 'f_white_rice', servings: 1.5 },
        { foodId: 'f_broccoli', servings: 1 }
      ],
      snack: [
        { foodId: 'f_whey_isolate', servings: 1 },
        { foodId: 'f_banana', servings: 1 },
        { foodId: 'f_almonds', servings: 1 }
      ],
      dinner: [
        { foodId: 'f_salmon_quinoa_bowl', servings: 1 }
      ]
    }
  }
]
