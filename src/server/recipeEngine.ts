export interface RecipePreferences {
  mealType?: 'family' | 'quick' | 'healthy' | 'party';
  cookingTime?: 'all' | 'under_30' | 'under_45';
  region?: 'all' | 'north' | 'central' | 'south';
  difficulty?: 'all' | 'easy' | 'medium';
}

export function generateTailoredVietnameseRecipes(
  ingredients: any[],
  preferences: RecipePreferences = {},
  previousRecipeTitles: string[] = []
) {
  const { mealType = 'family', cookingTime = 'all', region = 'all' } = preferences;

  const rawNames = ingredients
    .map((i) => (typeof i === 'string' ? i : i.name || ''))
    .filter(Boolean);

  const findIng = (regex: RegExp, fallback: string) =>
    rawNames.find((n) => regex.test(n)) || fallback;

  // Extract detected or primary available ingredients
  const hasPork = rawNames.some((n) => /thịt|ba rọi|ba chỉ|sườn|heo|lợn/i.test(n));
  const hasBeef = rawNames.some((n) => /bò|thăn bò|bắp bò/i.test(n));
  const hasChicken = rawNames.some((n) => /gà|ức gà|đùi gà|cánh gà/i.test(n));
  const hasFish = rawNames.some((n) => /cá|cá lóc|cá diêu hồng|cá hồi|cá basa/i.test(n));
  const hasShrimp = rawNames.some((n) => /tôm|tép|tôm sú/i.test(n));
  const hasEgg = rawNames.some((n) => /trứng/i.test(n));
  const hasTofu = rawNames.some((n) => /đậu hũ|đậu phụ/i.test(n));
  const hasTomato = rawNames.some((n) => /cà chua/i.test(n));

  const mainProtein = hasPork
    ? findIng(/thịt|ba rọi|ba chỉ/i, 'Thịt ba rọi tươi')
    : hasBeef
      ? findIng(/bò/i, 'Thịt bò tươi')
      : hasChicken
        ? findIng(/gà/i, 'Thịt gà ta')
        : hasFish
          ? findIng(/cá/i, 'Cá tươi')
          : hasShrimp
            ? findIng(/tôm|tép/i, 'Tôm tươi')
            : hasTofu
              ? findIng(/đậu/i, 'Đậu phụ non')
              : 'Thịt ba rọi tươi';

  const egg = findIng(/trứng/i, 'Trứng gà ta');
  const scallion = findIng(/hành/i, 'Hành lá tươi');
  const chili = findIng(/ớt/i, 'Ớt hiểm đỏ');
  const garlicShallot = findIng(/tỏi|hành tím/i, 'Hành tím & tỏi tép');
  const gingerLemon = findIng(/gừng|chanh/i, 'Gừng tươi & chanh');
  const tomato = findIng(/cà chua/i, 'Cà chua chín mọng');

  const isQuick = cookingTime === 'under_30' || mealType === 'quick';
  const isUnder45 = cookingTime === 'under_45';
  const isHealthy = mealType === 'healthy';
  const isParty = mealType === 'party';

  // Helper to check if a title was previously shown
  const wasShown = (title: string) =>
    previousRecipeTitles.some((t) => t.toLowerCase().includes(title.toLowerCase().slice(0, 8)));

  // Northern Cuisine Sets
  const getNorthRecipes = () => {
    if (isHealthy) {
      const setA = [
        {
          id: 'rec-north-healthy-a1',
          title: 'Thịt Cuộn Hành Hoa Hấp Gừng Tươi Phố Cổ',
          vietnameseName: 'Thịt hấp gừng hành Bắc Bộ',
          category: 'Món hấp thanh đạm',
          imageTag: 'dish_thit_kho_tau',
          shortDescription: 'Thịt thái lát mỏng cuộn gừng sợi và đầu hành hoa hấp chín mọng nước, giữ trọn vị ngọt thơm tự nhiên, chấm nước mắm gừng tiêu sọ.',
          cookingTimeMinutes: 18,
          prepTimeMinutes: 10,
          difficulty: 'Dễ' as const,
          servings: '2 - 3 người',
          flavorProfile: 'Thanh tao, ngọt thơm tự nhiên, ấm nồng vị gừng',
          availableIngredientsUsed: [mainProtein, scallion, gingerLemon],
          pantrySeasonings: ['2 thìa nước mắm ngon', '1/2 thìa tiêu sọ', 'Gừng thái chỉ'],
          missingIngredients: ['Gừng tươi thái sợi', 'Tiêu sọ trắng'],
          ingredientsList: [
            { item: mainProtein, amount: '400g thái mỏng' },
            { item: gingerLemon, amount: '1 nhánh gừng thái chỉ' },
            { item: scallion, amount: '1 bó hành hoa' },
          ],
          steps: [
            { stepNumber: 1, title: 'Ướp và cuộn thịt', instruction: 'Ướp thịt với 1 thìa nước mắm ngon và tiêu sọ trong 10 phút. Cuộn nhẹ cùng gừng sợi và đầu hành hoa.', timerMinutes: 10 },
            { stepNumber: 2, title: 'Hấp cách thủy', instruction: 'Đun sôi nước xửng hấp, cho đĩa thịt cuộn vào hấp lửa vừa 12 phút đến khi chín ngọt mọng nước.', timerMinutes: 12 },
          ],
          chefSecret: 'Không hấp quá lửa để thịt không bị khô xác, dùng tiêu sọ trắng xay thơm thanh tao.',
          servingSuggestion: 'Chấm nước mắm cá cơm pha gừng ớt và ăn kèm cơm trắng nóng hổi.',
        },
        {
          id: 'rec-north-healthy-a2',
          title: 'Trứng Hấp Vân Mây Nấm Hương Rắc Tiêu Sọ',
          vietnameseName: 'Trứng hấp vân mây Bắc Bộ',
          category: 'Món hấp dinh dưỡng',
          imageTag: 'dish_general',
          shortDescription: 'Trứng đánh bông cùng nước dùng ngọt thanh, hấp cách thủy mịn mướt như bánh flan, thơm lừng hành hoa và tiêu sọ ấm bụng.',
          cookingTimeMinutes: 15,
          prepTimeMinutes: 6,
          difficulty: 'Dễ' as const,
          servings: '2 người',
          flavorProfile: 'Mềm mướt, bùi béo thanh nhẹ, không dầu mỡ',
          availableIngredientsUsed: [egg, scallion],
          pantrySeasonings: ['1 thìa nước mắm', '100ml nước ấm', 'Tiêu sọ'],
          missingIngredients: ['Hành hoa cắt nhỏ', 'Nước dùng gà/nấm'],
          ingredientsList: [
            { item: egg, amount: '3 quả trứng gà' },
            { item: scallion, amount: 'Đầu hành hoa thái nhuyễn' },
          ],
          steps: [
            { stepNumber: 1, title: 'Đánh tan và lọc mịn', instruction: 'Khuấy đều trứng với 100ml nước ấm và 1 thìa nước mắm, lọc qua rây để trứng mịn mượt hoàn hảo.', timerMinutes: 4 },
            { stepNumber: 2, title: 'Hấp nhỏ lửa', instruction: 'Đậy đĩa kín, hấp lửa liu riu 10 phút đến khi mặt trứng se mịn đàn hồi.', timerMinutes: 10 },
          ],
          chefSecret: 'Dùng màng bọc hoặc đậy đĩa khi hấp để giọt nước không nhỏ xuống làm rỗ mặt trứng.',
          servingSuggestion: 'Ăn nóng với cơm trắng hoặc dùng làm món khai vị thanh mát.',
        },
        {
          id: 'rec-north-healthy-a3',
          title: 'Canh Chua Thanh Mát Nấu Thịt Bằm Vị Bắc',
          vietnameseName: 'Canh chua thanh nhiệt Bắc Bộ',
          category: 'Món canh thanh mát',
          imageTag: 'dish_canh_chua_ca',
          shortDescription: 'Tô canh ngọt lành nước dùng thanh trong từ thịt nạc băm, vị chua thanh dịu ngọt từ sấu hoặc chanh tươi, thơm nức hành hoa.',
          cookingTimeMinutes: 15,
          prepTimeMinutes: 8,
          difficulty: 'Dễ' as const,
          servings: '3 - 4 người',
          flavorProfile: 'Chua thanh tao, ngọt lành dịu mát giải nhiệt',
          availableIngredientsUsed: [mainProtein, scallion, gingerLemon, chili],
          pantrySeasonings: ['Nước mắm ngon', 'Chanh hoặc sấu', 'Hạt nêm'],
          missingIngredients: ['Quả sấu tươi hoặc chanh', 'Hành ngò rí'],
          ingredientsList: [
            { item: mainProtein, amount: '150g thịt nạc băm' },
            { item: scallion, amount: 'Hành hoa thái nhỏ' },
            { item: gingerLemon, amount: 'Nước cốt chanh tươi' },
          ],
          steps: [
            { stepNumber: 1, title: 'Nấu nước dùng thanh', instruction: 'Đun sôi 800ml nước, thả thịt băm viên nhỏ vào đun sôi hớt sạch bọt trong 10 phút cho nước trong veo.', timerMinutes: 10 },
            { stepNumber: 2, title: 'Nêm vị chua thanh', instruction: 'Nêm nước mắm cốt vừa ăn, tắt bếp vắt nước cốt chanh vào khuấy nhẹ rồi rắc hành hoa lên trên.', timerMinutes: 2 },
          ],
          chefSecret: 'Luôn tắt bếp trước khi thêm nước cốt chanh để canh không bị đắng và giữ trọn vitamin C.',
          servingSuggestion: 'Rất đưa cơm khi ăn cùng cơm dẻo và rau muống luộc.',
        },
      ];

      const setB = [
        {
          id: 'rec-north-healthy-b1',
          title: 'Thịt Nạc Luộc Chấm Nước Mắm Gừng Tiêu Bắc Bộ',
          vietnameseName: 'Thịt luộc mắm gừng xứ Bắc',
          category: 'Món luộc thanh đạm',
          imageTag: 'dish_thit_kho_tau',
          shortDescription: 'Thịt luộc mềm mọng giữ nguyên vẹn vị ngọt tinh khiết, thái mỏng tang chấm nước mắm cốt gừng ớt dậy mùi tiêu sọ ấm nồng.',
          cookingTimeMinutes: 18,
          prepTimeMinutes: 6,
          difficulty: 'Dễ' as const,
          servings: '3 người',
          flavorProfile: 'Ngọt bùi tự nhiên, thơm nức mắm gừng tiêu',
          availableIngredientsUsed: [mainProtein, gingerLemon, chili],
          pantrySeasonings: ['Nước mắm cốt', 'Gừng tươi giã dập', 'Chanh tươi', 'Tiêu'],
          missingIngredients: ['Rau sống ăn kèm', 'Dưa chuột giòn'],
          ingredientsList: [
            { item: mainProtein, amount: '450g thịt nạc hoặc ba chỉ' },
            { item: gingerLemon, amount: '1 củ gừng đập dập' },
            { item: chili, amount: '1 quả ớt sừng' },
          ],
          steps: [
            { stepNumber: 1, title: 'Luộc thịt thơm lừng', instruction: 'Thả gừng đập dập và chút muối vào nước sôi, cho thịt vào luộc lửa vừa 15 phút đến khi chín tới.', timerMinutes: 15 },
            { stepNumber: 2, title: 'Thái lát và pha mắm', instruction: 'Vớt thịt ngâm nước đun sôi để nguội cho săn chắc rồi thái lát mỏng. Pha mắm cốt với gừng băm và ớt.', timerMinutes: 5 },
          ],
          chefSecret: 'Ngâm thịt vào âu nước mát ngay sau khi vớt giúp phần mỡ giòn trong và thịt không bị thâm mặt.',
          servingSuggestion: 'Ăn cùng cơm nóng hoặc cuốn bánh đa nem với rau thơm.',
        },
        {
          id: 'rec-north-healthy-b2',
          title: 'Canh Rau Cải Nấu Thịt Bằm Gừng Tươi',
          vietnameseName: 'Canh cải thịt băm gừng Bắc',
          category: 'Món canh thanh nhiệt',
          imageTag: 'dish_canh_chua_ca',
          shortDescription: 'Tô canh ngọt mát với nước dùng ngọt lịm từ thịt nạc băm, vị ngọt bùi của rau hòa quyện gừng đập dập ấm bụng ngày mưa.',
          cookingTimeMinutes: 12,
          prepTimeMinutes: 6,
          difficulty: 'Dễ' as const,
          servings: '3 - 4 người',
          flavorProfile: 'Ngọt mát tự nhiên, ấm nhẹ vị gừng',
          availableIngredientsUsed: [mainProtein, gingerLemon, scallion],
          pantrySeasonings: ['Nước mắm', 'Hạt nêm', 'Gừng thái chỉ'],
          missingIngredients: ['1 bó rau cải ngọt/cải xanh', 'Gừng củ'],
          ingredientsList: [
            { item: mainProtein, amount: '150g thịt băm' },
            { item: gingerLemon, amount: '1 nhánh gừng đập dập' },
            { item: scallion, amount: 'Hành hoa thái nhỏ' },
          ],
          steps: [
            { stepNumber: 1, title: 'Nấu nước ngọt từ thịt', instruction: 'Phi thơm đầu hành, cho thịt băm vào xào săn rồi đổ 800ml nước đun sôi cùng gừng sợi trong 8 phút.', timerMinutes: 8 },
            { stepNumber: 2, title: 'Thả rau và hoàn tất', instruction: 'Nêm mắm vừa ăn, cho rau vào đun sôi bùng 2 phút rau vừa chín tới xanh mướt thì tắt bếp.', timerMinutes: 2 },
          ],
          chefSecret: 'Cho vài lát gừng tươi vào canh cải giúp giải hàn và tôn lên vị ngọt thanh của rau.',
          servingSuggestion: 'Dọn cùng đĩa thịt luộc và cà pháo giòn.',
        },
        {
          id: 'rec-north-healthy-b3',
          title: 'Trứng Chiên Cuộn Hành Hoa Ít Dầu Chuẩn Vị',
          vietnameseName: 'Trứng cuộn hành hoa thanh đạm',
          category: 'Món trứng ăn nhẹ',
          imageTag: 'dish_general',
          shortDescription: 'Trứng gà tươi đánh tan với chút nước mắm ngon và tiêu sọ, chiên trên chảo chống dính láng dầu nhẹ, cuộn tròn xốp mềm vàng ươm.',
          cookingTimeMinutes: 10,
          prepTimeMinutes: 5,
          difficulty: 'Dễ' as const,
          servings: '2 người',
          flavorProfile: 'Xốp mềm thơm bùi, vị đậm vừa phải',
          availableIngredientsUsed: [egg, scallion],
          pantrySeasonings: ['1 thìa nước mắm ngon', 'Tiêu sọ xay', '1 thìa dầu ăn'],
          missingIngredients: ['Hành hoa tươi thái nhỏ'],
          ingredientsList: [
            { item: egg, amount: '3 quả trứng gà' },
            { item: scallion, amount: 'Hành hoa thái nhuyễn' },
          ],
          steps: [
            { stepNumber: 1, title: 'Đánh bông', instruction: 'Đập trứng ra tô, thêm hành hoa và nước mắm cốt, đánh đều tay đến khi nổi bọt mịn.', timerMinutes: 3 },
            { stepNumber: 2, title: 'Cuộn trên chảo', instruction: 'Quét lớp dầu mỏng lên chảo, đổ từng lớp trứng mỏng rồi cuộn tròn từ từ trên lửa nhỏ trong 6 phút.', timerMinutes: 6 },
          ],
          chefSecret: 'Chiên lửa nhỏ liu riu để lớp trứng không bị cháy xém và cuộn đều tay.',
          servingSuggestion: 'Cắt lát xéo dọn ăn kèm cơm gạo lứt hoặc cơm trắng.',
        },
      ];

      return wasShown(setA[0].title) ? setB : setA;
    }

    if (isQuick) {
      const setA = [
        {
          id: 'rec-north-quick-a1',
          title: 'Thịt Rang Cháy Cạnh Hành Hoa Chuẩn Vị Bắc',
          vietnameseName: 'Thịt rang cháy cạnh Bắc Bộ',
          category: 'Món rang nhanh',
          imageTag: 'dish_thit_kho_tau',
          shortDescription: 'Thịt ba chỉ thái lát mỏng đảo xém cạnh giòn thơm, hòa quyện nước mắm cốt nguyên chất, tiêu sọ và hành hoa ngọt bùi trong 15 phút.',
          cookingTimeMinutes: 15,
          prepTimeMinutes: 6,
          difficulty: 'Dễ' as const,
          servings: '3 người',
          flavorProfile: 'Mặn ngọt vừa vặn, thơm nức mùi tiêu hành Bắc Bộ',
          availableIngredientsUsed: [mainProtein, scallion, garlicShallot],
          pantrySeasonings: ['2 thìa nước mắm cốt', '1 thìa đường', 'Tiêu sọ xay'],
          missingIngredients: ['Hành tím khô', 'Nước mắm cốt truyền thống'],
          ingredientsList: [
            { item: mainProtein, amount: '350g thái mỏng' },
            { item: scallion, amount: '1 bó hành hoa cắt khúc' },
            { item: garlicShallot, amount: '2 củ hành khô băm' },
          ],
          steps: [
            { stepNumber: 1, title: 'Đảo xém mỡ', instruction: 'Cho thịt vào chảo nóng không cần dầu, đảo lửa lớn 7 phút cho tươm mỡ và xém vàng hai mặt.', timerMinutes: 7 },
            { stepNumber: 2, title: 'Nêm mắm cốt hành hoa', instruction: 'Chắt bớt mỡ thừa, phi thơm hành khô rồi nêm mắm cốt, đường và tiêu. Đảo đều 2 phút rồi rắc hành hoa tắt bếp.', timerMinutes: 3 },
          ],
          chefSecret: 'Người Bắc dùng nước mắm cốt nguyên chất đảo lửa lớn để tạo mùi thơm khói xém đặc trưng.',
          servingSuggestion: 'Ăn cùng cơm dẻo và dưa cải muối chua giòn.',
        },
        {
          id: 'rec-north-quick-a2',
          title: 'Trứng Rán Bông Xốp Hành Gừng Tiêu Đen',
          vietnameseName: 'Trứng chiên hành gừng nhanh',
          category: 'Món chiên siêu tốc',
          imageTag: 'dish_general',
          shortDescription: 'Món ăn siêu nhanh hoàn thành trong 10 phút, trứng nở bông xốp mềm mượt, ấm nồng hương gừng sợi và thơm nức hành lá.',
          cookingTimeMinutes: 10,
          prepTimeMinutes: 4,
          difficulty: 'Dễ' as const,
          servings: '2 người',
          flavorProfile: 'Bùi béo, thơm thanh ấm nồng vị gừng',
          availableIngredientsUsed: [egg, scallion, gingerLemon],
          pantrySeasonings: ['1 thìa nước mắm', '1/2 thìa hạt nêm', 'Tiêu sọ xay'],
          missingIngredients: ['Hành lá', 'Gừng tươi'],
          ingredientsList: [
            { item: egg, amount: '4 quả' },
            { item: scallion, amount: 'Hành hoa thái nhỏ' },
            { item: gingerLemon, amount: 'Gừng tươi thái sợi' },
          ],
          steps: [
            { stepNumber: 1, title: 'Đánh bông trứng', instruction: 'Đập trứng vào tô, thêm hành hoa, gừng sợi, nước mắm và tiêu. Dùng đũa đánh bông đều tay.', timerMinutes: 2 },
            { stepNumber: 2, title: 'Chiên vàng xốp', instruction: 'Đun nóng dầu ăn, đổ trứng vào chiên đậy hé nắp 3 phút cho phồng xốp rồi lật mặt chiên thêm 1 phút.', timerMinutes: 4 },
          ],
          chefSecret: 'Vắt vài giọt nước cốt chanh vào trứng khi đánh giúp trứng nở bông xốp gấp đôi!',
          servingSuggestion: 'Ăn nóng với cơm trắng chấm nước mắm ớt.',
        },
        {
          id: 'rec-north-quick-a3',
          title: 'Canh Cà Chua Thịt Bằm Hành Ngò Nấu Nhanh',
          vietnameseName: 'Canh cà chua thịt băm Bắc',
          category: 'Món canh siêu tốc',
          imageTag: 'dish_canh_chua_ca',
          shortDescription: 'Bát canh ngọt lịm từ thịt băm xào cà chua mềm rục, chua thanh dịu nhẹ, rắc hành ngò thơm nức hoàn thành trong 12 phút.',
          cookingTimeMinutes: 12,
          prepTimeMinutes: 5,
          difficulty: 'Dễ' as const,
          servings: '3 người',
          flavorProfile: 'Chua ngọt dịu nhẹ, màu đỏ cam bắt mắt',
          availableIngredientsUsed: [mainProtein, tomato, scallion],
          pantrySeasonings: ['Nước mắm', 'Hạt nêm', 'Hành tỏi'],
          missingIngredients: ['2 quả cà chua chín', 'Rau mùi tàu/ngò rí'],
          ingredientsList: [
            { item: mainProtein, amount: '120g thịt nạc băm' },
            { item: tomato, amount: '2 quả cà chua bổ múi cau' },
            { item: scallion, amount: 'Hành hoa thái khúc' },
          ],
          steps: [
            { stepNumber: 1, title: 'Xào cà chua tạo màu', instruction: 'Phi thơm hành khô, cho cà chua vào đảo mềm 3 phút tạo sốt đỏ au rồi trút thịt băm vào xào săn.', timerMinutes: 4 },
            { stepNumber: 2, title: 'Nấu nước dùng', instruction: 'Đổ 700ml nước sôi vào đun bùng 5 phút, nêm mắm hạt nêm vừa ăn, rắc hành hoa rồi tắt bếp.', timerMinutes: 5 },
          ],
          chefSecret: 'Dầm nhuyễn 1 nửa cà chua để nước canh có màu đỏ cam tự nhiên tuyệt đẹp.',
          servingSuggestion: 'Rất hợp ăn cùng thịt rang cháy cạnh trong bữa cơm thường ngày.',
        },
      ];

      const setB = [
        {
          id: 'rec-north-quick-b1',
          title: 'Đậu Phụ Tẩm Hành Nước Mắm Cốt Bắc Bộ',
          vietnameseName: 'Đậu tẩm hành Hà Nội',
          category: 'Món chiên mắm hành',
          imageTag: 'dish_general',
          shortDescription: 'Đậu phụ rán giòn rụm vừa gắp ra nhúng ngay vào bát nước mắm cốt pha hành hoa thái nhỏ, ngấm bóng bẩy béo ngậy thơm nức.',
          cookingTimeMinutes: 12,
          prepTimeMinutes: 4,
          difficulty: 'Dễ' as const,
          servings: '2 - 3 người',
          flavorProfile: 'Giòn ngoài mềm trong, béo bùi đượm mắm hành hoa',
          availableIngredientsUsed: [scallion, garlicShallot],
          pantrySeasonings: ['3 thìa nước mắm cốt', '1 thìa đường', 'Hành hoa', 'Dầu ăn'],
          missingIngredients: ['3 bìa đậu phụ mơ tươi'],
          ingredientsList: [
            { item: 'Đậu phụ non tươi', amount: '3 bìa cắt vuông' },
            { item: scallion, amount: '1 nắm hành hoa thái nhỏ' },
          ],
          steps: [
            { stepNumber: 1, title: 'Pha bát mắm hành', instruction: 'Cho hành hoa thái nhỏ vào bát, thêm 3 thìa nước mắm cốt và 1 thìa nước lọc, chút đường quấy nhẹ.', timerMinutes: 2 },
            { stepNumber: 2, title: 'Rán vàng nhúng mắm', instruction: 'Rán đậu phụ lửa vừa cho vàng giòn đều các mặt trong 7 phút. Vừa gắp ra nhúng ngay vào bát mắm hành.', timerMinutes: 7 },
          ],
          chefSecret: 'Nhúng đậu lúc đang sôi sùng sục khỏi chảo để hành hoa chín tái xanh mướt và đậu hút no mắm.',
          servingSuggestion: 'Món ăn kèm kinh điển của cơm trưa gia đình miền Bắc.',
        },
        {
          id: 'rec-north-quick-b2',
          title: 'Thịt Băm Xào Hành Hoa Tiêu Sọ Cấp Tốc',
          vietnameseName: 'Thịt băm xào hành tiêu',
          category: 'Món xào nhanh',
          imageTag: 'dish_thit_kho_tau',
          shortDescription: 'Thịt băm xào thơm lừng cùng hành khô và tiêu sọ, mằn mặn ngọt ngọt rưới đẫm lên bát cơm nóng hổi, chỉ mất đúng 10 phút.',
          cookingTimeMinutes: 10,
          prepTimeMinutes: 4,
          difficulty: 'Dễ' as const,
          servings: '2 người',
          flavorProfile: 'Mặn ngọt đậm đà, thơm cay hạt tiêu sọ',
          availableIngredientsUsed: [mainProtein, scallion, garlicShallot],
          pantrySeasonings: ['2 thìa nước mắm', '1/2 thìa đường', 'Tiêu sọ'],
          missingIngredients: ['Hành khô băm', 'Tiêu sọ xay'],
          ingredientsList: [
            { item: mainProtein, amount: '250g thịt băm' },
            { item: scallion, amount: 'Hành hoa thái khúc' },
            { item: garlicShallot, amount: '2 củ hành tím băm' },
          ],
          steps: [
            { stepNumber: 1, title: 'Xào thơm', instruction: 'Phi thơm hành khô, trút thịt băm vào xào lửa lớn 5 phút cho tơi xốp và săn đều.', timerMinutes: 5 },
            { stepNumber: 2, title: 'Nêm mắm tiêu', instruction: 'Nêm 2 thìa mắm, tiêu sọ đảo liên tục 3 phút cho thịt xém cạnh, rắc hành hoa tắt bếp.', timerMinutes: 3 },
          ],
          chefSecret: 'Xào lửa lớn để thịt băm săn giòn mà không bị chảy nước.',
          servingSuggestion: 'Trộn cùng cơm nóng hoặc ăn với cháo trắng.',
        },
        {
          id: 'rec-north-quick-b3',
          title: 'Canh Trứng Cà Chua Mây Rắc Hành Ngò',
          vietnameseName: 'Canh trứng cà chua phố cổ',
          category: 'Món canh nhanh',
          imageTag: 'dish_canh_chua_ca',
          shortDescription: 'Canh cà chua thơm mềm, vân trứng nở xốp bông bồng bềnh như mây, thơm ngát mùi hành hoa và ngò rí, giải nhiệt cực nhanh.',
          cookingTimeMinutes: 10,
          prepTimeMinutes: 4,
          difficulty: 'Dễ' as const,
          servings: '3 người',
          flavorProfile: 'Chua thanh tao, trứng mềm tan béo ngậy',
          availableIngredientsUsed: [egg, tomato, scallion],
          pantrySeasonings: ['Nước mắm', 'Hạt nêm', 'Hành khô'],
          missingIngredients: ['2 quả cà chua chín', 'Rau mùi ta'],
          ingredientsList: [
            { item: egg, amount: '2 quả trứng gà đánh tan' },
            { item: tomato, amount: '2 quả cà chua' },
            { item: scallion, amount: 'Hành ngò rí' },
          ],
          steps: [
            { stepNumber: 1, title: 'Nấu nước cà chua', instruction: 'Phi hành khô xào mềm cà chua, thêm 600ml nước đun sôi bùng trong 4 phút.', timerMinutes: 4 },
            { stepNumber: 2, title: 'Kéo vân mây trứng', instruction: 'Hạ lửa, rót trứng từ từ đồng thời dùng đũa khuấy 1 chiều tạo vân mây, rắc hành ngò tắt bếp.', timerMinutes: 2 },
          ],
          chefSecret: 'Khuấy đều 1 chiều nhẹ tay khi rót trứng để tạo thành các sợi vân mây mỏng tang đẹp mắt.',
          servingSuggestion: 'Dùng nóng trong bữa cơm gia đình.',
        },
      ];

      return wasShown(setA[0].title) ? setB : setA;
    }

    // Standard / Family North
    const setA = [
      {
        id: 'rec-north-fam-a1',
        title: 'Thịt Ba Chỉ Rang Cháy Cạnh Hành Hoa Chuẩn Vị Bắc',
        vietnameseName: 'Thịt rang cháy cạnh Bắc Bộ',
        category: 'Món rang truyền thống',
        imageTag: 'dish_thit_rang_chay_canh',
        shortDescription: 'Thịt ba rọi thái lát mỏng đảo xém cạnh giòn thơm, đượm nước mắm cốt nguyên chất, tiêu sọ xay và hành hoa ngọt bùi chuẩn vị phố cổ.',
        cookingTimeMinutes: 20,
        prepTimeMinutes: 8,
        difficulty: 'Dễ' as const,
        servings: '3 - 4 người',
        flavorProfile: 'Mặn ngọt đậm đà, thơm nức mùi tiêu hành Bắc Bộ',
        availableIngredientsUsed: [mainProtein, scallion, garlicShallot],
        pantrySeasonings: ['2 thìa nước mắm cốt', '1 thìa đường', 'Tiêu sọ xay'],
        missingIngredients: ['Hành tím khô', 'Nước mắm cốt truyền thống'],
        ingredientsList: [
          { item: mainProtein, amount: '450g thái mỏng' },
          { item: scallion, amount: '1 bó hành hoa cắt khúc' },
          { item: garlicShallot, amount: '3 củ hành khô băm' },
        ],
        steps: [
          { stepNumber: 1, title: 'Đảo tươm mỡ', instruction: 'Cho thịt vào chảo nóng đảo lửa lớn 8 phút cho tươm bớt mỡ và xém vàng hai mặt.', timerMinutes: 8 },
          { stepNumber: 2, title: 'Nêm sốt mắm cốt', instruction: 'Chắt mỡ thừa, phi thơm hành khô rồi nêm mắm cốt, đường và tiêu đảo đều 3 phút rồi rắc hành hoa tắt bếp.', timerMinutes: 3 },
        ],
        chefSecret: 'Người Bắc dùng nước mắm cốt nguyên chất đảo lửa lớn để tạo mùi thơm khói xém đặc trưng.',
        servingSuggestion: 'Ăn cùng cơm dẻo và dưa cải muối chua giòn.',
      },
      {
        id: 'rec-north-fam-a2',
        title: 'Chả Thịt Băm Lá Lốt Áp Chảo Phố Cổ',
        vietnameseName: 'Chả lá lốt rán giòn',
        category: 'Món chiên gia đình',
        imageTag: 'dish_cha_la_lot',
        shortDescription: 'Thịt nạc vai băm nhuyễn ướp hạt tiêu hành hoa, cuốn trong từng chiếc lá lốt xanh mướt rán xém thơm lừng quyến rũ.',
        cookingTimeMinutes: 18,
        prepTimeMinutes: 10,
        difficulty: 'Dễ' as const,
        servings: '3 người',
        flavorProfile: 'Thơm nức mùi lá lốt, ngọt mềm mọng nước',
        availableIngredientsUsed: [mainProtein, scallion, garlicShallot],
        pantrySeasonings: ['1 thìa nước mắm ngon', '1/2 thìa tiêu sọ', 'Dầu ăn'],
        missingIngredients: ['1 bó lá lốt bánh tẻ tươi'],
        ingredientsList: [
          { item: mainProtein, amount: '350g thịt nạc vai xay' },
          { item: scallion, amount: 'Đầu hành hoa băm nhuyễn' },
          { item: 'Lá lốt tươi bánh tẻ', amount: '20 lá' },
        ],
        steps: [
          { stepNumber: 1, title: 'Ướp và cuộn chả', instruction: 'Ướp thịt với hành tím băm, tiêu, mắm trong 10 phút. Đặt thịt lên mặt gân lá lốt rồi cuộn tròn chặt tay.', timerMinutes: 10 },
          { stepNumber: 2, title: 'Rán áp chảo', instruction: 'Đun nóng 2 thìa dầu, đặt mép cuộn xuống rán trước với lửa vừa 8 phút cho chín đều hai mặt xanh bóng.', timerMinutes: 8 },
        ],
        chefSecret: 'Chọn lá lốt bánh tẻ màu xanh thẫm, cuộn úp mặt bóng ra ngoài để đĩa chả bóng bẩy đẹp mắt.',
        servingSuggestion: 'Chấm nước mắm tiêu ớt ăn cùng cơm trắng hoặc bún tươi.',
      },
      {
        id: 'rec-north-fam-a3',
        title: 'Canh Cà Chua Nấu Đậu Phụ Thịt Bằm',
        vietnameseName: 'Canh cà chua đậu phụ thịt băm',
        category: 'Món canh thanh đạm',
        imageTag: 'dish_canh_ca_chua_dau_phu',
        shortDescription: 'Bát canh ngọt lành với nước dùng thanh trong từ thịt băm, vị chua thanh dịu nhẹ từ sấu hoặc chanh, điểm xuyết hành hoa thơm ngát.',
        cookingTimeMinutes: 18,
        prepTimeMinutes: 8,
        difficulty: 'Dễ' as const,
        servings: '3 - 4 người',
        flavorProfile: 'Chua thanh tao, ngọt lành dịu mát',
        availableIngredientsUsed: [mainProtein, scallion, gingerLemon, chili],
        pantrySeasonings: ['2 thìa nước mắm', '1 quả chanh hoặc sấu', 'Hạt nêm'],
        missingIngredients: ['Quả sấu tươi hoặc quả dọc', 'Rau ngò gai'],
        ingredientsList: [
          { item: mainProtein, amount: '150g băm nhỏ' },
          { item: scallion, amount: 'Hành hoa thái nhỏ' },
          { item: gingerLemon, amount: 'Nước cốt chanh tươi' },
        ],
        steps: [
          { stepNumber: 1, title: 'Xào thịt và nấu nước dùng', instruction: 'Phi thơm đầu hành, xào săn thịt băm rồi đổ 800ml nước vào đun sôi hớt bọt trong 10 phút.', timerMinutes: 10 },
          { stepNumber: 2, title: 'Nêm vị chua thanh', instruction: 'Nêm mắm vừa ăn, tắt bếp vắt nước cốt chanh vào khuấy nhẹ rồi rắc hành hoa lên trên.', timerMinutes: 2 },
        ],
        chefSecret: 'Luôn tắt bếp trước khi cho nước cốt chanh để canh không bị đắng.',
        servingSuggestion: 'Ăn kèm cơm trắng trong bữa cơm gia đình.',
      },
    ];

    const setB = [
      {
        id: 'rec-north-fam-b1',
        title: 'Thịt Ba Chỉ Rang Cháy Cạnh Hành Hoa Chuẩn Vị Bắc',
        vietnameseName: 'Thịt rang cháy cạnh Bắc',
        category: 'Món mặn gia đình',
        imageTag: 'dish_thit_kho_tau',
        shortDescription: 'Miếng thịt xém vàng cạnh giòn bùi, thơm nức nước mắm cốt nguyên chất và tiêu đen, đưa cơm vô cùng.',
        cookingTimeMinutes: 20,
        prepTimeMinutes: 8,
        difficulty: 'Dễ' as const,
        servings: '3 người',
        flavorProfile: 'Mặn mòi, thơm khói xém cạnh, béo ngậy ngọt thịt',
        availableIngredientsUsed: [mainProtein, scallion, garlicShallot],
        pantrySeasonings: ['Nước mắm cốt', 'Hành tím', 'Đường', 'Tiêu sọ'],
        missingIngredients: ['Hành tím khô', 'Nước mắm nguyên chất'],
        ingredientsList: [
          { item: mainProtein, amount: '400g thái mỏng vừa ăn' },
          { item: scallion, amount: '1 bó hành hoa' },
          { item: garlicShallot, amount: '3 củ hành tím' },
        ],
        steps: [
          { stepNumber: 1, title: 'Đảo tươm mỡ', instruction: 'Cho thịt vào chảo đảo đều lửa lớn 8 phút cho vàng xém cạnh và tươm bớt mỡ thừa.', timerMinutes: 8 },
          { stepNumber: 2, title: 'Nêm sốt mắm cốt', instruction: 'Chắt bớt mỡ, phi hành khô rồi nêm mắm đường tiêu đảo 4 phút cho bóng bẩy rồi rắc hành hoa.', timerMinutes: 4 },
        ],
        chefSecret: 'Chắt mỡ thừa ra chén giúp đĩa thịt săn giòn bóng bẩy mà không bị ngấy.',
        servingSuggestion: 'Ăn cùng cơm nóng và đĩa dưa cải muối chua.',
      },
      {
        id: 'rec-north-fam-b2',
        title: 'Chả Thịt Băm Lá Lốt Áp Chảo Phố Cổ',
        vietnameseName: 'Chả lá lốt Hà Nội',
        category: 'Món áp chảo thơm lừng',
        imageTag: 'dish_thit_kho_tau',
        shortDescription: 'Thịt nạc vai băm nhỏ ướp tiêu hành cuộn trong lá lốt bánh tẻ, rán lửa vừa thơm nức khắp gian bếp, giòn vỏ mềm mọng bên trong.',
        cookingTimeMinutes: 20,
        prepTimeMinutes: 12,
        difficulty: 'Dễ' as const,
        servings: '3 - 4 người',
        flavorProfile: 'Thơm lừng tinh dầu lá lốt, ngọt đậm đà thịt tươi',
        availableIngredientsUsed: [mainProtein, garlicShallot],
        pantrySeasonings: ['Nước mắm ngon', 'Tiêu sọ', 'Dầu ăn'],
        missingIngredients: ['1 bó lá lốt bánh tẻ tươi'],
        ingredientsList: [
          { item: mainProtein, amount: '350g nạc vai băm' },
          { item: garlicShallot, amount: 'Hành tím băm nhỏ' },
        ],
        steps: [
          { stepNumber: 1, title: 'Ướp và cuộn chả', instruction: 'Trộn thịt băm với hành tím, 1 thìa nước mắm, tiêu sọ. Cuộn từng cuốn chặt tay trong lá lốt.', timerMinutes: 10 },
          { stepNumber: 2, title: 'Rán áp chảo', instruction: 'Rán lửa vừa 8 phút cho lá lốt chín bóng thơm lừng và nhân thịt bên trong chín ngọt.', timerMinutes: 8 },
        ],
        chefSecret: 'Để mặt bóng của lá lốt ra ngoài khi cuộn để miếng chả sau khi rán có màu xanh ngọc bích bóng đẹp.',
        servingSuggestion: 'Chấm nước mắm chanh ớt hoặc ăn cùng bún tươi.',
      },
      {
        id: 'rec-north-fam-b3',
        title: 'Canh Cà Chua Nấu Đậu Phụ Thịt Bằm',
        vietnameseName: 'Canh cà chua đậu phụ thịt băm',
        category: 'Món canh thanh đạm',
        imageTag: 'dish_canh_chua_ca',
        shortDescription: 'Tô canh đỏ au ấm cúng với đậu phụ mềm tan béo bùi, thịt băm ngọt lịm và vị chua dịu từ cà chua chín mọng.',
        cookingTimeMinutes: 15,
        prepTimeMinutes: 8,
        difficulty: 'Dễ' as const,
        servings: '3 - 4 người',
        flavorProfile: 'Chua thanh tao, béo bùi đậu phụ, ngọt nước dùng',
        availableIngredientsUsed: [mainProtein, tomato, scallion],
        pantrySeasonings: ['Nước mắm', 'Hành khô', 'Hạt nêm'],
        missingIngredients: ['2 bìa đậu phụ tươi', '2 quả cà chua'],
        ingredientsList: [
          { item: mainProtein, amount: '120g thịt băm' },
          { item: tomato, amount: '2 quả cà chua' },
          { item: scallion, amount: 'Hành hoa thái khúc' },
        ],
        steps: [
          { stepNumber: 1, title: 'Xào sốt cà chua thịt', instruction: 'Phi thơm hành khô, xào thịt băm và cà chua mềm tạo màu đỏ trong 4 phút.', timerMinutes: 4 },
          { stepNumber: 2, title: 'Thả đậu phụ nấu sôi', instruction: 'Thêm 700ml nước đun sôi, thả đậu phụ cắt quân cờ vào đun liu riu 5 phút, nêm mắm rắc hành hoa.', timerMinutes: 6 },
        ],
        chefSecret: 'Đậu phụ không xào mà thả vào nước canh đang sôi để giữ độ non mềm mịn màng.',
        servingSuggestion: 'Dùng nóng với cơm trắng rất êm bụng.',
      },
    ];

    return wasShown(setA[0].title) ? setB : setA;
  };

  // Central Cuisine Sets
  const getCentralRecipes = () => {
    if (isHealthy) {
      const setA = [
        {
          id: 'rec-central-healthy-a1',
          title: 'Thịt Ba Rọi Luộc Chấm Mắm Ớt Cay Nồng Xứ Huế',
          vietnameseName: 'Thịt luộc mắm ớt miền Trung',
          category: 'Món luộc thanh đạm',
          imageTag: 'dish_thit_kho_tau',
          shortDescription: 'Thịt ba rọi luộc giòn ngọt, thái lát mỏng tang chấm mắm ớt hiểm cay nồng nàn đặc trưng ẩm thực xứ Huế.',
          cookingTimeMinutes: 20,
          prepTimeMinutes: 8,
          difficulty: 'Dễ' as const,
          servings: '3 người',
          flavorProfile: 'Đậm đà, cay nồng ớt hiểm, thơm mắm miền Trung',
          availableIngredientsUsed: [mainProtein, chili, garlicShallot, gingerLemon],
          pantrySeasonings: ['Nước mắm cá cơm', 'Ớt hiểm giã', 'Chanh tươi', 'Tỏi'],
          missingIngredients: ['Rau sống xanh tươi', 'Ớt hiểm tươi'],
          ingredientsList: [
            { item: mainProtein, amount: '450g ba chỉ tươi' },
            { item: chili, amount: '4 quả ớt hiểm giã nhuyễn' },
            { item: garlicShallot, amount: '1 củ tỏi giã nhuyễn' },
          ],
          steps: [
            { stepNumber: 1, title: 'Luộc thịt giòn ngọt', instruction: 'Đun sôi nước với muối và gừng đập dập, cho thịt vào luộc lửa vừa 15 phút.', timerMinutes: 15 },
            { stepNumber: 2, title: 'Pha mắm cay nồng', instruction: 'Giã ớt hiểm, tỏi rồi pha cùng mắm và chanh tươi cho dậy vị cay mặn.', timerMinutes: 5 },
          ],
          chefSecret: 'Vớt thịt ngâm ngay vào tô nước đá lạnh 5 phút để bì giòn sần sật.',
          servingSuggestion: 'Cuốn kèm rau sống, dưa chuột và chấm ngập chén mắm cay.',
        },
        {
          id: 'rec-central-healthy-a2',
          title: 'Canh Khổ Qua Nấu Thịt Nạc Thanh Nhiệt Miền Trung',
          vietnameseName: 'Canh khổ qua thanh mát',
          category: 'Món canh thanh nhiệt',
          imageTag: 'dish_canh_chua_ca',
          shortDescription: 'Khổ qua bào mỏng nấu cùng thịt nạc tươi băm nhỏ, nước dùng ngọt lịm hậu ngọt thanh, giải nhiệt cực tốt cho cơ thể.',
          cookingTimeMinutes: 15,
          prepTimeMinutes: 8,
          difficulty: 'Dễ' as const,
          servings: '3 người',
          flavorProfile: 'Đắng dịu hậu ngọt thanh, giải nhiệt bổ dưỡng',
          availableIngredientsUsed: [mainProtein, scallion, chili],
          pantrySeasonings: ['Nước mắm', 'Tiêu giã', 'Hành tím'],
          missingIngredients: ['2 quả khổ qua tươi', 'Hành ngò'],
          ingredientsList: [
            { item: mainProtein, amount: '150g thịt nạc băm' },
            { item: scallion, amount: 'Hành hoa thái nhỏ' },
          ],
          steps: [
            { stepNumber: 1, title: 'Nấu nước dùng ngọt', instruction: 'Phi thơm hành tím, cho thịt băm vào xào săn rồi đổ 800ml nước đun sôi hớt bọt 8 phút.', timerMinutes: 8 },
            { stepNumber: 2, title: 'Thả khổ qua', instruction: 'Cho khổ qua thái lát mỏng vào đun sôi bùng 2 phút, nêm mắm và tiêu rồi tắt bếp ngay.', timerMinutes: 3 },
          ],
          chefSecret: 'Khổ qua chỉ đun sôi 2 phút để giữ màu xanh giòn và vị đắng ngọt nhẹ thanh.',
          servingSuggestion: 'Ăn cùng cơm trắng ngày hè oi nóng.',
        },
        {
          id: 'rec-central-healthy-a3',
          title: 'Trứng Hấp Tiêu Đen Hành Tỏi Không Dầu',
          vietnameseName: 'Trứng hấp tiêu kiểu Huế',
          category: 'Món hấp ít calo',
          imageTag: 'dish_general',
          shortDescription: 'Trứng đánh tan cùng hành tỏi phi và thật nhiều tiêu hạt giã dập, hấp chín xốp thơm lừng ấm áp mà không cần dầu mỡ.',
          cookingTimeMinutes: 12,
          prepTimeMinutes: 5,
          difficulty: 'Dễ' as const,
          servings: '2 người',
          flavorProfile: 'Xốp mềm ấm nồng vị tiêu giã, đậm đà mộc mạc',
          availableIngredientsUsed: [egg, garlicShallot],
          pantrySeasonings: ['1 thìa nước mắm ngon', '1 thìa tiêu đen giã', 'Hành tím'],
          missingIngredients: ['Hành tím băm', 'Tiêu hạt đen'],
          ingredientsList: [
            { item: egg, amount: '3 quả trứng' },
            { item: garlicShallot, amount: 'Hành tím băm' },
          ],
          steps: [
            { stepNumber: 1, title: 'Đánh tan gia vị', instruction: 'Đánh tan trứng với nước mắm, hành tím băm và tiêu giã hạt dập thơm nức.', timerMinutes: 3 },
            { stepNumber: 2, title: 'Hấp cách thủy', instruction: 'Cho tô trứng vào xửng hấp lửa vừa 8 phút đến khi chín phồng thơm ngát.', timerMinutes: 8 },
          ],
          chefSecret: 'Tiêu hạt giã dập thô giúp khi cắn trúng hạt tiêu sẽ bùng nổ hương thơm cay nồng.',
          servingSuggestion: 'Ăn kèm cơm gạo lứt hoặc cơm dẻo.',
        },
      ];

      return setA;
    }

    if (isQuick) {
      const setA = [
        {
          id: 'rec-central-quick-a1',
          title: 'Thịt Ba Chỉ Xào Sả Ớt Cay Nồng Miền Trung',
          vietnameseName: 'Thịt xào sả ớt kiểu Trung',
          category: 'Món xào cay đậm',
          imageTag: 'dish_thit_kho_tau',
          shortDescription: 'Thịt ba chỉ thái mỏng xào lửa lớn cùng sả ớt giã nhuyễn, màu sắc đỏ au rực rỡ, vị cay nồng đánh thức mọi giác quan.',
          cookingTimeMinutes: 15,
          prepTimeMinutes: 7,
          difficulty: 'Dễ' as const,
          servings: '2 - 3 người',
          flavorProfile: 'Cay nồng, thơm ngát sả ớt, đậm đà bắt cơm',
          availableIngredientsUsed: [mainProtein, chili, garlicShallot, scallion],
          pantrySeasonings: ['Sả băm', '2 thìa nước mắm ngon', '1 thìa đường', 'Tiêu'],
          missingIngredients: ['3 cây sả tươi băm nhuyễn', 'Ớt hiểm đỏ'],
          ingredientsList: [
            { item: mainProtein, amount: '400g thái mỏng' },
            { item: chili, amount: '4 quả ớt hiểm băm' },
            { item: garlicShallot, amount: 'Tỏi và hành băm' },
          ],
          steps: [
            { stepNumber: 1, title: 'Phi thơm sả ớt', instruction: 'Đun nóng dầu ăn, cho sả ớt và tỏi băm vào phi vàng thơm ngát trong 3 phút.', timerMinutes: 3 },
            { stepNumber: 2, title: 'Xào thịt lửa lớn', instruction: 'Trút thịt vào xào nhanh tay lửa lớn 8 phút, nêm nước mắm và đường cho sốt bóng bám đều quanh miếng thịt.', timerMinutes: 8 },
          ],
          chefSecret: 'Phi sả ớt hơi se vàng trước khi cho thịt giúp thịt áo lớp vỏ thơm giòn cay.',
          servingSuggestion: 'Ăn cùng cơm nóng hoặc xúc bánh tráng nướng giòn rụm.',
        },
        {
          id: 'rec-central-quick-a2',
          title: 'Trứng Chiên Sốt Nước Mắm Tỏi Ớt Cay Nồng',
          vietnameseName: 'Trứng chiên sốt mắm ớt miền Trung',
          category: 'Món chiên sốt cay',
          imageTag: 'dish_general',
          shortDescription: 'Trứng gà chiên lòng đào viền giòn rụm, rưới đẫm sốt nước mắm ớt hiểm tỏi phi cay the ngào ngạt.',
          cookingTimeMinutes: 12,
          prepTimeMinutes: 5,
          difficulty: 'Dễ' as const,
          servings: '2 người',
          flavorProfile: 'Giòn ngoài mềm trong, mặn ngọt cay nồng kích thích',
          availableIngredientsUsed: [egg, chili, garlicShallot, scallion],
          pantrySeasonings: ['2 thìa nước mắm', '1 thìa đường', 'Ớt tỏi băm'],
          missingIngredients: ['Ớt hiểm tươi', 'Tỏi băm'],
          ingredientsList: [
            { item: egg, amount: '4 quả trứng gà' },
            { item: chili, amount: '3 quả ớt hiểm băm' },
            { item: garlicShallot, amount: 'Tỏi băm vàng' },
          ],
          steps: [
            { stepNumber: 1, title: 'Chiên ốp la viền giòn', instruction: 'Đun nóng dầu ăn, đập từng quả trứng vào chiên lửa lớn cho viền giòn phồng rồi vớt ra đĩa.', timerMinutes: 5 },
            { stepNumber: 2, title: 'Rim sốt mắm tỏi ớt', instruction: 'Phi thơm tỏi ớt băm, thêm mắm và đường đun sệt lại rồi rưới đều lên mặt trứng chiên.', timerMinutes: 4 },
          ],
          chefSecret: 'Chiên dầu thật nóng để viền lòng trắng giòn rộp mà lòng đỏ vẫn dẻo sánh.',
          servingSuggestion: 'Rất đưa cơm trong những ngày mưa.',
        },
        {
          id: 'rec-central-quick-a3',
          title: 'Canh Thịt Băm Nấu Thơm Cà Chua Cay The',
          vietnameseName: 'Canh chua thơm cà miền Trung',
          category: 'Món canh đậm đà',
          imageTag: 'dish_canh_chua_ca',
          shortDescription: 'Canh ngọt dịu từ thịt băm, chua thanh từ cà chua và cay the nồng nàn từ ớt hiểm, chuẩn phong vị xứ nắng gió.',
          cookingTimeMinutes: 15,
          prepTimeMinutes: 7,
          difficulty: 'Dễ' as const,
          servings: '3 người',
          flavorProfile: 'Chua cay hài hòa, thơm ngát hành ngò',
          availableIngredientsUsed: [mainProtein, scallion, chili, garlicShallot],
          pantrySeasonings: ['Nước mắm', 'Ớt tươi', 'Hành hoa'],
          missingIngredients: ['1/4 quả dứa thơm', '2 quả cà chua chín'],
          ingredientsList: [
            { item: mainProtein, amount: '150g thịt băm' },
            { item: scallion, amount: 'Hành hoa thái nhỏ' },
            { item: chili, amount: '2 quả ớt đập dập' },
          ],
          steps: [
            { stepNumber: 1, title: 'Xào thịt với ớt thơm', instruction: 'Phi thơm hành tỏi và ớt, cho thịt băm vào xào săn thơm trong 3 phút.', timerMinutes: 3 },
            { stepNumber: 2, title: 'Nấu canh sôi ngọt', instruction: 'Thêm nước sôi vào đun sôi bùng 10 phút, nêm nước mắm vừa miệng rồi rắc hành lá tắt bếp.', timerMinutes: 10 },
          ],
          chefSecret: 'Thêm ớt đập dập ngay lúc xào thịt giúp nước canh dậy màu ấm và vị cay thanh.',
          servingSuggestion: 'Ăn cùng cơm nóng và cá kho hoặc thịt rim.',
        },
      ];

      return setA;
    }

    // Standard Central
    const setA = [
      {
        id: 'rec-central-fam-a1',
        title: 'Thịt Kho Tiêu Ớt Kiểu Xứ Huế Đậm Đà',
        vietnameseName: 'Thịt kho tiêu kiểu Huế',
        category: 'Món kho cay',
        imageTag: 'dish_thit_kho_tieu_hue',
        shortDescription: 'Từng miếng thịt ba rọi kho keo sánh đặc quánh, phủ lớp tiêu sọ cay ấm và ớt hiểm đỏ tươi, ăn đến đâu đậm đà đến đó.',
        cookingTimeMinutes: isUnder45 ? 35 : 38,
        prepTimeMinutes: 12,
        difficulty: 'Dễ' as const,
        servings: '3 - 4 người',
        flavorProfile: 'Đậm đà, mặn ngọt sâu sắc, cay the ấm nồng',
        availableIngredientsUsed: [mainProtein, chili, garlicShallot],
        pantrySeasonings: ['Nước mắm ngon', 'Đường phèn', 'Tiêu đen giã dập', 'Ớt hiểm'],
        missingIngredients: ['Ớt hiểm tươi đỏ', 'Tiêu hạt nguyên chất'],
        ingredientsList: [
          { item: mainProtein, amount: '500g cắt miếng vừa' },
          { item: chili, amount: '5 quả ớt hiểm' },
          { item: garlicShallot, amount: 'Hành tỏi băm' },
        ],
        steps: [
          { stepNumber: 1, title: 'Ướp đượm vị mắm tiêu', instruction: 'Ướp thịt với mắm ngon, đường phèn, hành tỏi và thật nhiều tiêu giã dập trong 15 phút.', timerMinutes: 15 },
          { stepNumber: 2, title: 'Kho cạn sốt sánh', instruction: 'Xào săn thịt rồi châm ít nước sôi, kho lửa riu riu 20 phút đến khi nước thịt cạn lại sánh đặc.', timerMinutes: 20 },
        ],
        chefSecret: 'Dùng tiêu hạt giã dập thô thay vì tiêu bột mịn để nổ vị cay thơm trên đầu lưỡi.',
        servingSuggestion: 'Cơm trắng chan nước kho tiêu cay xé lưỡi ăn kèm dưa chuột.',
      },
      {
        id: 'rec-central-fam-a2',
        title: 'Trứng Chiên Sốt Nước Mắm Tỏi Ớt Cay Nồng',
        vietnameseName: 'Trứng chiên sốt mắm ớt miền Trung',
        category: 'Món chiên sốt cay',
        imageTag: 'dish_trung_chien_hanh',
        shortDescription: 'Trứng gà chiên lòng đào viền giòn rụm, rưới đẫm sốt nước mắm ớt hiểm tỏi phi cay the ngào ngạt.',
        cookingTimeMinutes: 12,
        prepTimeMinutes: 5,
        difficulty: 'Dễ' as const,
        servings: '2 người',
        flavorProfile: 'Giòn ngoài mềm trong, mặn ngọt cay nồng kích thích',
        availableIngredientsUsed: [egg, chili, garlicShallot, scallion],
        pantrySeasonings: ['2 thìa nước mắm', '1 thìa đường', 'Ớt tỏi băm'],
        missingIngredients: ['Ớt hiểm băm', 'Tỏi tép giã'],
        ingredientsList: [
          { item: egg, amount: '4 quả trứng gà' },
          { item: chili, amount: '3 quả ớt hiểm băm' },
          { item: garlicShallot, amount: 'Tỏi băm vàng' },
        ],
        steps: [
          { stepNumber: 1, title: 'Chiên ốp la viền giòn', instruction: 'Đun nóng dầu ăn, đập từng quả trứng vào chiên lửa lớn cho viền giòn phồng rồi vớt ra đĩa.', timerMinutes: 5 },
          { stepNumber: 2, title: 'Rim sốt mắm tỏi ớt', instruction: 'Phi thơm tỏi ớt băm, thêm mắm và đường đun sệt lại rồi rưới đều lên mặt trứng chiên.', timerMinutes: 4 },
        ],
        chefSecret: 'Chiên dầu thật nóng để viền lòng trắng giòn rộp mà lòng đỏ vẫn dẻo sánh.',
        servingSuggestion: 'Rất đưa cơm trong những ngày mưa.',
      },
      {
        id: 'rec-central-fam-a3',
        title: 'Canh Thịt Băm Nấu Thơm Cà Chua Cay The',
        vietnameseName: 'Canh chua thơm cà miền Trung',
        category: 'Món canh đậm đà',
        imageTag: 'dish_canh_ca_chua_dau_phu',
        shortDescription: 'Canh ngọt dịu từ thịt băm, chua thanh từ cà chua và cay the nồng nàn từ ớt hiểm, chuẩn phong vị xứ nắng gió.',
        cookingTimeMinutes: 18,
        prepTimeMinutes: 7,
        difficulty: 'Dễ' as const,
        servings: '3 người',
        flavorProfile: 'Chua cay hài hòa, thơm ngát hành ngò',
        availableIngredientsUsed: [mainProtein, scallion, chili, garlicShallot],
        pantrySeasonings: ['Nước mắm', 'Ớt tươi', 'Hành hoa'],
        missingIngredients: ['Dứa thơm cắt lát', 'Cà chua'],
        ingredientsList: [
          { item: mainProtein, amount: '150g thịt băm' },
          { item: scallion, amount: 'Hành hoa thái nhỏ' },
          { item: chili, amount: '2 quả ớt đập dập' },
        ],
        steps: [
          { stepNumber: 1, title: 'Xào thịt với ớt thơm', instruction: 'Phi thơm hành tỏi và ớt, cho thịt băm vào xào săn thơm trong 3 phút.', timerMinutes: 3 },
          { stepNumber: 2, title: 'Nấu canh sôi ngọt', instruction: 'Thêm nước sôi vào đun sôi bùng 10 phút, nêm nước mắm vừa miệng rồi rắc hành lá tắt bếp.', timerMinutes: 10 },
        ],
        chefSecret: 'Thêm ớt đập dập ngay lúc xào thịt giúp nước canh dậy màu ấm và vị cay thanh.',
        servingSuggestion: 'Ăn cùng cơm nóng và cá kho hoặc thịt rim.',
      },
    ];

    return setA;
  };

  // Southern Cuisine Sets
  const getSouthRecipes = () => {
    if (isHealthy) {
      const setA = [
        {
          id: 'rec-south-healthy-a1',
          title: 'Gỏi Cuốn Tươi Mát Chấm Sốt Tương Bơ Đậu Phộng',
          vietnameseName: 'Gỏi cuốn tôm thịt Nam Bộ',
          category: 'Món cuốn thanh đạm',
          imageTag: 'dish_goi_cuon_springrolls',
          shortDescription: 'Thịt luộc chín tới cuốn cùng bún tươi, rau sống và trứng sợi trong bánh tráng dẻo, chấm sốt tương ngọt bùi thanh mát.',
          cookingTimeMinutes: 18,
          prepTimeMinutes: 10,
          difficulty: 'Dễ' as const,
          servings: '2 - 3 người',
          flavorProfile: 'Tươi giòn, thanh mát nhẹ bụng, bùi béo sốt chấm',
          availableIngredientsUsed: [mainProtein, egg, scallion],
          pantrySeasonings: ['Tương đen', 'Bơ đậu phộng', 'Đậu phộng rang'],
          missingIngredients: ['Bánh tráng dẻo Nam Bộ', 'Rau xà lách & bún tươi'],
          ingredientsList: [
            { item: mainProtein, amount: '300g luộc thái mỏng' },
            { item: egg, amount: '2 quả tráng mỏng thái sợi' },
            { item: scallion, amount: 'Hẹ hoa hoặc hành lá' },
          ],
          steps: [
            { stepNumber: 1, title: 'Luộc thịt và tráng trứng', instruction: 'Luộc thịt chín mọng trong 12 phút, vớt ra thái mỏng. Tráng trứng mỏng rồi cắt sợi.', timerMinutes: 12 },
            { stepNumber: 2, title: 'Cuốn gỏi tươi', instruction: 'Nhúng bánh tráng, xếp rau, bún, thịt và trứng sợi rồi cuốn chặt tay dọn ra đĩa.', timerMinutes: 6 },
          ],
          chefSecret: 'Cho chút hẹ nhô ra ở đầu cuộn tạo nét duyên dáng đặc trưng món cuốn Nam Bộ.',
          servingSuggestion: 'Chấm sốt tương bơ đậu phộng pha ớt cay giòn bùi.',
        },
        {
          id: 'rec-south-healthy-a2',
          title: 'Canh Mướp Hương Mồng Tơi Nấu Thịt Nạc Ngọt Thanh',
          vietnameseName: 'Canh mướp mồng tơi Nam Bộ',
          category: 'Món canh thanh nhiệt',
          imageTag: 'dish_canh_chua_ca',
          shortDescription: 'Tô canh ngọt lịm từ mướp hương thơm ngát và rau mồng tơi xanh mướt, nước dùng nấu từ thịt nạc tươi mát lành mùa nắng.',
          cookingTimeMinutes: 12,
          prepTimeMinutes: 6,
          difficulty: 'Dễ' as const,
          servings: '3 - 4 người',
          flavorProfile: 'Ngọt mát tự nhiên, thơm dịu mùi mướp hương',
          availableIngredientsUsed: [mainProtein, scallion],
          pantrySeasonings: ['Nước mắm ngon', 'Hạt nêm', 'Hành tím'],
          missingIngredients: ['1 quả mướp hương tươi', '1 bó rau mồng tơi'],
          ingredientsList: [
            { item: mainProtein, amount: '150g thịt băm' },
            { item: scallion, amount: 'Hành hoa thái nhỏ' },
          ],
          steps: [
            { stepNumber: 1, title: 'Nấu nước thịt ngọt', instruction: 'Đun sôi 800ml nước, thả thịt băm viên nhỏ vào đun sôi hớt bọt trong 8 phút.', timerMinutes: 8 },
            { stepNumber: 2, title: 'Thả mướp và rau', instruction: 'Cho mướp hương và mồng tơi vào nấu sôi bùng 2 phút, nêm mắm thơm rồi tắt bếp.', timerMinutes: 2 },
          ],
          chefSecret: 'Không đậy nắp nồi khi nấu canh rau để mồng tơi giữ trọn sắc xanh mướt.',
          servingSuggestion: 'Ăn cùng cơm trắng và vài quả cà pháo dầm tương.',
        },
        {
          id: 'rec-south-healthy-a3',
          title: 'Trứng Hấp Đậu Hũ Non Tôm Thịt Bông Xốp',
          vietnameseName: 'Trứng hấp đậu hũ Nam Bộ',
          category: 'Món hấp dinh dưỡng',
          imageTag: 'dish_general',
          shortDescription: 'Trứng gà tươi kết hợp đậu hũ non béo mịn và thịt băm nêm tiêu hành, hấp chín mướt mềm tan trên đầu lưỡi.',
          cookingTimeMinutes: 15,
          prepTimeMinutes: 6,
          difficulty: 'Dễ' as const,
          servings: '2 - 3 người',
          flavorProfile: 'Mềm mướt như kem, thanh đạm bùi béo tự nhiên',
          availableIngredientsUsed: [egg, mainProtein, scallion],
          pantrySeasonings: ['Nước tương', 'Tiêu sọ', 'Hành tím'],
          missingIngredients: ['1 hộp đậu phụ non', 'Hành hoa thái nhỏ'],
          ingredientsList: [
            { item: egg, amount: '3 quả trứng' },
            { item: mainProtein, amount: '80g thịt nạc băm' },
          ],
          steps: [
            { stepNumber: 1, title: 'Dầm nhuyễn đậu và trứng', instruction: 'Dầm nhuyễn đậu hũ non với trứng gà, thịt băm, nước mắm ngon và tiêu.', timerMinutes: 4 },
            { stepNumber: 2, title: 'Hấp chín mướt', instruction: 'Cho hỗn hợp vào tô, hấp lửa vừa 10 phút đến khi bề mặt mịn màng chín phồng.', timerMinutes: 10 },
          ],
          chefSecret: 'Dùng đậu hũ non loại mềm mượt để tạo kết cấu tan ngay trong miệng.',
          servingSuggestion: 'Rưới thêm chút xì dầu tỏi ớt ăn rất thanh tao.',
        },
      ];

      return setA;
    }

    if (isQuick) {
      const setA = [
        {
          id: 'rec-south-quick-a1',
          title: 'Thịt Ba Rọi Ram Mặn Ngọt Nước Dừa Cấp Tốc',
          vietnameseName: 'Thịt ram mặn ngọt Nam Bộ',
          category: 'Món ram nhanh',
          imageTag: 'dish_thit_kho_tau',
          shortDescription: 'Thịt ba rọi thái mỏng đảo xém rồi ram nhanh với nước mắm, đường phèn và nước dừa keo sánh bóng loáng trong 15 phút.',
          cookingTimeMinutes: 15,
          prepTimeMinutes: 5,
          difficulty: 'Dễ' as const,
          servings: '3 người',
          flavorProfile: 'Mặn ngọt đậm đà, thơm béo ngậy nước dừa',
          availableIngredientsUsed: [mainProtein, garlicShallot, chili, scallion],
          pantrySeasonings: ['Nước mắm ngon', 'Đường thốt nốt', 'Tiêu', 'Tỏi băm'],
          missingIngredients: ['Nước dừa tươi', 'Đường thốt nốt'],
          ingredientsList: [
            { item: mainProtein, amount: '350g thái mỏng vừa ăn' },
            { item: garlicShallot, amount: 'Tỏi băm giòn' },
            { item: chili, amount: '1 quả ớt sừng' },
          ],
          steps: [
            { stepNumber: 1, title: 'Đảo săn thịt', instruction: 'Cho thịt vào chảo đảo lửa lớn 6 phút cho tươm bớt mỡ và xém vàng hai mặt.', timerMinutes: 6 },
            { stepNumber: 2, title: 'Ram sốt kẹo', instruction: 'Chắt mỡ, cho tỏi ớt phi thơm rồi thêm mắm đường nước dừa đun lửa lớn đảo đều 5 phút cho sốt áo keo đỏ au.', timerMinutes: 5 },
          ],
          chefSecret: 'Ram lửa lớn đảo nhanh tay để sốt đường mắm caramen hóa bám chặt vào từng miếng thịt.',
          servingSuggestion: 'Ăn cùng cơm nóng và dưa leo giòn mát.',
        },
        {
          id: 'rec-south-quick-a2',
          title: 'Trứng Chiên Phồng Thơm Củ Hành Tây Nam Bộ',
          vietnameseName: 'Trứng chiên củ hành giòn ngọt',
          category: 'Món chiên siêu tốc',
          imageTag: 'dish_general',
          shortDescription: 'Trứng gà đánh bông chiên phồng xốp cùng hành tây thái mỏng giòn ngọt, thơm ngát mùi tiêu và nước mắm nguyên chất.',
          cookingTimeMinutes: 10,
          prepTimeMinutes: 4,
          difficulty: 'Dễ' as const,
          servings: '2 người',
          flavorProfile: 'Xốp giòn, ngọt bùi tự nhiên từ hành tây',
          availableIngredientsUsed: [egg, scallion, garlicShallot],
          pantrySeasonings: ['Nước mắm ngon', 'Tiêu xay', 'Dầu ăn'],
          missingIngredients: ['1/2 củ hành tây giòn', 'Hành hoa'],
          ingredientsList: [
            { item: egg, amount: '3 - 4 quả trứng gà' },
            { item: scallion, amount: 'Hành lá thái nhỏ' },
            { item: garlicShallot, amount: 'Hành tây thái mỏng' },
          ],
          steps: [
            { stepNumber: 1, title: 'Đánh tan nguyên liệu', instruction: 'Đập trứng ra tô, thêm hành tây thái chỉ mỏng, nước mắm và tiêu đánh tan đều.', timerMinutes: 3 },
            { stepNumber: 2, title: 'Chiên lửa lớn', instruction: 'Cho dầu nóng già, trút trứng vào chiên phồng xốp 4 phút rồi lật mặt chiên thêm 1 phút.', timerMinutes: 5 },
          ],
          chefSecret: 'Thái hành tây thật mỏng để hành chín tới giữ được độ giòn ngọt thơm.',
          servingSuggestion: 'Ăn nóng cùng cơm trắng chấm nước tương ớt.',
        },
        {
          id: 'rec-south-quick-a3',
          title: 'Canh Chua Thanh Mát Nấu Nhanh Kiểu Nam Bộ',
          vietnameseName: 'Canh chua nhanh Nam Bộ',
          category: 'Món canh chua ngọt',
          imageTag: 'dish_canh_chua_ca',
          shortDescription: 'Tô canh chua ngọt đậm đà vị me, thơm nức ngò gai và rau ôm, giải ngấy hoàn hảo cho mâm cơm chỉ trong 14 phút.',
          cookingTimeMinutes: 14,
          prepTimeMinutes: 6,
          difficulty: 'Dễ' as const,
          servings: '3 - 4 người',
          flavorProfile: 'Chua ngọt bùng nổ, thơm nức rau ngò gai',
          availableIngredientsUsed: [mainProtein, chili, scallion],
          pantrySeasonings: ['Nước mắm', 'Nước cốt me', 'Đường', 'Ớt'],
          missingIngredients: ['Me vắt hoặc cốt me', 'Rau ngò gai/ngò ôm'],
          ingredientsList: [
            { item: mainProtein, amount: '150g thịt băm hoặc cá' },
            { item: chili, amount: 'Ớt hiểm băm' },
            { item: scallion, amount: 'Hành ngò gai thái khúc' },
          ],
          steps: [
            { stepNumber: 1, title: 'Nấu nước dùng chua ngọt', instruction: 'Đun sôi 800ml nước, dầm me lấy nước chua, thêm đường mắm cho cân bằng vị chua ngọt rồi thả thịt vào.', timerMinutes: 8 },
            { stepNumber: 2, title: 'Rắc ngò ôm ớt cay', instruction: 'Nấu sôi thêm 3 phút cho thịt chín tới, tắt bếp rắc ngò gai, ngò ôm và ớt tươi thái lát.', timerMinutes: 3 },
          ],
          chefSecret: 'Canh chua Nam Bộ luôn cần sự cân bằng tinh tế giữa độ chua của me và ngọt dịu của đường.',
          servingSuggestion: 'Ăn nóng với cơm trắng hoặc chan bún tươi.',
        },
      ];

      return setA;
    }

    // Standard South
    const setA = [
      {
        id: 'rec-south-fam-a1',
        title: 'Thịt Ba Rọi Kho Tàu Trứng Gà Nước Dừa Xiêm',
        vietnameseName: 'Thịt kho tàu nước dừa Nam Bộ',
        category: 'Món kho truyền thống',
        imageTag: 'dish_thit_kho_tau',
        shortDescription: 'Món ăn biểu tượng của ẩm thực Nam Bộ với thịt ba rọi mềm ngậy trong veo, trứng luộc bùi béo đẫm nước dừa xiêm ngọt thanh màu hổ phách.',
        cookingTimeMinutes: isUnder45 ? 38 : 42,
        prepTimeMinutes: 15,
        difficulty: 'Dễ' as const,
        servings: '3 - 4 người',
        flavorProfile: 'Mặn ngọt đậm đà, thơm béo nước dừa xiêm tự nhiên',
        availableIngredientsUsed: [mainProtein, egg, garlicShallot, chili],
        pantrySeasonings: ['Nước mắm cá cơm', 'Nước dừa tươi', 'Đường phèn', 'Tiêu'],
        missingIngredients: ['1 trái dừa tươi lấy nước', 'Đường thốt nốt/phèn'],
        ingredientsList: [
          { item: mainProtein, amount: '500g thái khối vuông lớn' },
          { item: egg, amount: '4 quả trứng gà luộc bóc vỏ' },
          { item: garlicShallot, amount: 'Hành tỏi băm nhuyễn' },
        ],
        steps: [
          { stepNumber: 1, title: 'Ướp thịt ngấm vị', instruction: 'Ướp thịt với mắm ngon, hành tỏi băm, đường và tiêu trong 15 phút.', timerMinutes: 15 },
          { stepNumber: 2, title: 'Kho thịt nước dừa', instruction: 'Xào săn thịt, đổ nước dừa xiêm tươi ngập mặt đun sôi hớt bọt rồi hạ lửa kho liu riu 25 phút cùng trứng.', timerMinutes: 25 },
        ],
        chefSecret: 'Kho bằng nước dừa xiêm tươi và mở hé nắp vung giúp nước kho trong veo và mỡ thịt trong vắt.',
        servingSuggestion: 'Ăn kèm cơm trắng dẻo và đĩa dưa giá chua giòn.',
      },
      {
        id: 'rec-south-fam-a2',
        title: 'Trứng Chiên Thịt Bằm Củ Hành Thơm Bùi',
        vietnameseName: 'Trứng chiên thịt bằm củ hành',
        category: 'Món chiên gia đình',
        imageTag: 'dish_general',
        shortDescription: 'Trứng gà tươi đánh bông cùng thịt heo bằm nhuyễn và thật nhiều củ hành tím phi thơm, chiên chín vàng hai mặt mềm xốp bùi ngậy.',
        cookingTimeMinutes: 14,
        prepTimeMinutes: 6,
        difficulty: 'Dễ' as const,
        servings: '3 người',
        flavorProfile: 'Mềm xốp, bùi thơm ngậy vị thịt và hành tím',
        availableIngredientsUsed: [egg, mainProtein, garlicShallot, scallion],
        pantrySeasonings: ['1 thìa nước mắm ngon', '1/2 thìa hạt nêm', 'Tiêu xay'],
        missingIngredients: ['Hành tím khô băm nhỏ'],
        ingredientsList: [
          { item: egg, amount: '4 quả trứng gà ta' },
          { item: mainProtein, amount: '100g thịt nạc băm nhuyễn' },
          { item: garlicShallot, amount: '3 củ hành tím thái mỏng' },
        ],
        steps: [
          { stepNumber: 1, title: 'Đánh bông hỗn hợp', instruction: 'Đánh tan trứng cùng thịt băm, hành tím thái mỏng, nước mắm và tiêu cho hòa quyện.', timerMinutes: 3 },
          { stepNumber: 2, title: 'Chiên vàng hai mặt', instruction: 'Đun nóng dầu ăn, trút hỗn hợp vào chiên đậy vung 5 phút rồi lật mặt chiên thêm 2 phút vàng ruộm.', timerMinutes: 7 },
        ],
        chefSecret: 'Xào sơ thịt băm với hành tím 1 phút trước khi trộn vào trứng để thịt chín mềm đều.',
        servingSuggestion: 'Ăn cùng cơm nóng và đĩa rau luộc chấm nước kho.',
      },
      {
        id: 'rec-south-fam-a3',
        title: 'Canh Chua Thanh Mát Nấu Nhanh Kiểu Nam Bộ',
        vietnameseName: 'Canh chua thanh nhiệt Nam Bộ',
        category: 'Món canh thanh mát',
        imageTag: 'dish_canh_chua_ca',
        shortDescription: 'Tô canh nóng hổi với vị chua thanh từ me, ngọt dịu từ nước hầm thịt nạc, điểm xuyết ngò gai và rau thơm, giải ngấy hoàn hảo.',
        cookingTimeMinutes: 18,
        prepTimeMinutes: 8,
        difficulty: 'Dễ' as const,
        servings: '3 - 4 người',
        flavorProfile: 'Chua thanh tao, ngọt lành dịu mát cân bằng',
        availableIngredientsUsed: [mainProtein, scallion, chili, gingerLemon],
        pantrySeasonings: ['Nước mắm', 'Chanh hoặc me', 'Hạt nêm', 'Ớt tươi'],
        missingIngredients: ['Me chua tươi hoặc quả chua', 'Rau ngò ôm'],
        ingredientsList: [
          { item: mainProtein, amount: '150g thịt băm' },
          { item: scallion, amount: 'Hành ngò thái nhỏ' },
          { item: chili, amount: 'Ớt hiểm' },
        ],
        steps: [
          { stepNumber: 1, title: 'Nấu nước dùng ngọt thanh', instruction: 'Phi thơm hành tím, cho thịt băm vào xào săn rồi đổ 800ml nước đun sôi hớt bọt trong 8 phút.', timerMinutes: 8 },
          { stepNumber: 2, title: 'Nêm vị chua ngọt cân bằng', instruction: 'Nêm mắm, chút đường và nước cốt me vừa miệng, rắc hành ngò tắt bếp.', timerMinutes: 3 },
        ],
        chefSecret: 'Thịt băm viên nhỏ giúp nước dùng ngọt tự nhiên mà không cần bột ngọt.',
        servingSuggestion: 'Ăn cùng cơm nóng hoặc bún tươi.',
      },
    ];

    return setA;
  };

  // Nationwide / All Regions Set
  const getAllRegionRecipes = () => {
    if (isHealthy) {
      return getNorthRecipes();
    }
    if (isQuick) {
      return getNorthRecipes();
    }
    return [
      {
        id: 'rec-all-fam-1',
        title: 'Thịt Ba Rọi Kho Tàu Trứng Gà Chuẩn Vị Gia Đình',
        vietnameseName: 'Thịt kho tàu gia đình',
        category: 'Món kho mặn ngọt',
        imageTag: 'dish_thit_kho_tau',
        shortDescription: 'Món kho sum họp kinh điển với thịt mềm ngậy, trứng bùi thơm đẫm nước sốt màu cánh gián đậm đà, thơm lừng tiêu ớt.',
        cookingTimeMinutes: isUnder45 ? 38 : 40,
        prepTimeMinutes: 15,
        difficulty: 'Dễ' as const,
        servings: '3 - 4 người',
        flavorProfile: 'Mặn ngọt đậm đà, béo ngậy hài hòa đưa cơm',
        availableIngredientsUsed: [mainProtein, egg, scallion, chili, garlicShallot],
        pantrySeasonings: ['Nước mắm cá cơm', 'Đường phèn', 'Tiêu sọ', 'Hành tỏi'],
        missingIngredients: ['Nước màu caramen', 'Hành tím băm'],
        ingredientsList: [
          { item: mainProtein, amount: '500g thái khối vuông' },
          { item: egg, amount: '4 quả luộc bóc vỏ' },
          { item: garlicShallot, amount: 'Hành tỏi băm nhuyễn' },
        ],
        steps: [
          { stepNumber: 1, title: 'Ướp thịt đậm đà', instruction: 'Ướp thịt với mắm ngon, đường, hành tỏi băm và tiêu sọ trong 15 phút.', timerMinutes: 15 },
          { stepNumber: 2, title: 'Thắng nước màu và kho', instruction: 'Thắng đường màu cánh gián, xào săn thịt rồi châm nước sôi ngập mặt thịt, kho liu riu 22 phút cùng trứng.', timerMinutes: 22 },
        ],
        chefSecret: 'Ướp thêm vài giọt chanh tươi giúp mỡ thịt trong veo và không ngấy.',
        servingSuggestion: 'Ăn cùng cơm trắng dẻo và dưa chuột giòn mát.',
      },
      {
        id: 'rec-all-fam-2',
        title: 'Trứng Rán Bông Xốp Hành Gừng Tiêu Đen',
        vietnameseName: 'Trứng chiên hành gừng',
        category: 'Món chiên siêu tốc',
        imageTag: 'dish_general',
        shortDescription: 'Món ăn siêu nhanh, trứng nở bông xốp mềm mượt, ấm nồng hương gừng sợi và thơm nức hành lá.',
        cookingTimeMinutes: 10,
        prepTimeMinutes: 5,
        difficulty: 'Dễ' as const,
        servings: '2 người',
        flavorProfile: 'Bùi béo, thơm thanh ấm nồng vị gừng',
        availableIngredientsUsed: [egg, scallion, gingerLemon],
        pantrySeasonings: ['1 thìa nước mắm', '1/2 thìa hạt nêm', 'Tiêu sọ xay'],
        missingIngredients: ['Hành lá', 'Gừng tươi'],
        ingredientsList: [
          { item: egg, amount: '4 quả' },
          { item: scallion, amount: 'Hành hoa thái nhỏ' },
          { item: gingerLemon, amount: 'Gừng tươi thái sợi' },
        ],
        steps: [
          { stepNumber: 1, title: 'Đánh bông trứng', instruction: 'Đập trứng vào tô, thêm hành hoa, gừng sợi, nước mắm và tiêu. Dùng đũa đánh bông đều tay.', timerMinutes: 2 },
          { stepNumber: 2, title: 'Chiên vàng xốp', instruction: 'Đun nóng dầu ăn, đổ trứng vào chiên đậy hé nắp 3 phút cho phồng xốp rồi lật mặt chiên thêm 1 phút.', timerMinutes: 4 },
        ],
        chefSecret: 'Vắt vài giọt nước cốt chanh vào trứng khi đánh giúp trứng nở bông xốp gấp đôi!',
        servingSuggestion: 'Ăn nóng với cơm trắng chấm nước mắm ớt.',
      },
      {
        id: 'rec-all-fam-3',
        title: 'Canh Chua Thanh Mát Nấu Nhanh Bữa Cơm',
        vietnameseName: 'Canh chua thanh nhiệt',
        category: 'Món canh thanh mát',
        imageTag: 'dish_canh_chua_ca',
        shortDescription: 'Tô canh nóng hổi với vị chua thanh dịu ngọt, thơm nức ngò gai và rau thơm, giải ngấy hoàn hảo cho mâm cơm.',
        cookingTimeMinutes: 18,
        prepTimeMinutes: 8,
        difficulty: 'Dễ' as const,
        servings: '3 - 4 người',
        flavorProfile: 'Chua thanh tao, ngọt lành dịu mát',
        availableIngredientsUsed: [mainProtein, scallion, chili, gingerLemon],
        pantrySeasonings: ['Nước mắm', 'Chanh hoặc me', 'Hạt nêm', 'Ớt tươi'],
        missingIngredients: ['Me chua tươi', 'Rau thơm ngò gai'],
        ingredientsList: [
          { item: mainProtein, amount: '150g thịt băm' },
          { item: scallion, amount: 'Hành ngò thái nhỏ' },
          { item: chili, amount: 'Ớt hiểm' },
        ],
        steps: [
          { stepNumber: 1, title: 'Xào thịt băm', instruction: 'Phi thơm hành tím, cho thịt băm vào xào săn rồi đổ 800ml nước đun sôi hớt bọt trong 8 phút.', timerMinutes: 8 },
          { stepNumber: 2, title: 'Nêm canh chua thanh', instruction: 'Nêm mắm, chút đường và nước cốt chanh/me vừa miệng, rắc hành ngò tắt bếp.', timerMinutes: 3 },
        ],
        chefSecret: 'Thịt băm viên nhỏ giúp nước dùng ngọt tự nhiên mà không cần bột ngọt.',
        servingSuggestion: 'Ăn cùng cơm nóng hoặc bún tươi.',
      },
    ];
  };

  let chosenSet: any[];
  if (region === 'north') {
    chosenSet = getNorthRecipes();
  } else if (region === 'central') {
    chosenSet = getCentralRecipes();
  } else if (region === 'south') {
    chosenSet = getSouthRecipes();
  } else {
    chosenSet = getAllRegionRecipes();
  }

  // Ensure strict time constraints
  const finalRecipes = chosenSet.map((rec) => {
    let cTime = rec.cookingTimeMinutes;
    if (isQuick) {
      cTime = Math.min(cTime, 20);
    } else if (isUnder45) {
      cTime = Math.min(cTime, 38);
    }
    return {
      ...rec,
      cookingTimeMinutes: cTime,
    };
  });

  return { recipes: finalRecipes };
}
