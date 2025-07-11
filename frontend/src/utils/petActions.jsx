/**
 * 執行寵物行為的通用函數，支援狀態變更、道具消耗、經驗值增加與訊息提示。
 *
 * @param {Object} pet - 當前的寵物狀態物件
 * @param {Function} setPet - 用於更新寵物狀態的 setState 函數
 * @param {Object} inventory - 當前道具庫存狀態
 * @param {Function} setInventory - 用於更新道具庫存的 setState 函數
 * @param {Function} addExp - 處理經驗值增加與升級的函數
 * @param {Function} notify - 顯示通知訊息的函數
 * @param {Object} config - 此次行為的配置參數
 */

export const performPetAction = ({
  pet,
  setPet,
  inventory,
  setInventory,
  addExp,
  notify,
  config
}) => {
  const {
    condition = true,                // 執行此行為的條件，例如道具數量是否足夠
    conditionFailMessage = '',      // 條件不成立時顯示的錯誤訊息
    petUpdates = {},                // 要更新的寵物屬性（例如飢餓度、快樂度等）
    inventoryItem = null,           // 要消耗的道具名稱（例如 food、soap）
    inventoryCost = 0,              // 道具消耗數量
    expGain = 0,                    // 要增加的經驗值
    coinsGain = 0,                  // 要增加的金幣數量（例如玩耍獎勵）
    successMessage = ''            // 行為成功後顯示的訊息
  } = config;

  // 如果條件不符合（例如沒有足夠道具），顯示失敗訊息並中斷動作
  if (!condition) {
    notify(conditionFailMessage);
    return;
  }

  // 更新寵物狀態（如飢餓、快樂等），數值會被限制在 0 ~ 100 範圍內
  setPet(prev => ({
    ...prev,
    ...Object.fromEntries(
      Object.entries(petUpdates).map(([key, valueFn]) => [
        key,
        Math.min(100, Math.max(0, valueFn(prev))) // 保持數值在合理範圍
      ])
    ),
    coins: prev.coins + coinsGain // 增加金幣
  }));

  // 如果有指定道具並需要消耗數量，更新道具庫存
  if (inventoryItem && inventoryCost > 0) {
    setInventory(prev => ({
      ...prev,
      [inventoryItem]: prev[inventoryItem] - inventoryCost
    }));
  }

  // 增加經驗值（如果有指定）
  if (expGain > 0) addExp(expGain);

  // 顯示成功通知訊息
  if (successMessage) notify(successMessage);
};

// 使用範例
// performPetAction({
//   pet,
//   setPet,
//   inventory,
//   setInventory,
//   addExp,
//   notify,
//   config: {
//     condition: inventory.food > 0,
//     conditionFailMessage: '沒有食物了！',
//     inventoryItem: 'food',
//     inventoryCost: 1,
//     petUpdates: {
//       hunger: (prev) => prev.hunger + 25,
//       happiness: (prev) => prev.happiness + 10,
//       lastFed: () => Date.now()
//     },
//     expGain: 10,
//     successMessage: `${pet.name}很開心地吃完了食物！`
//   }
// });

// 以下是一些具體的寵物行為實現範例，使用 performPetAction 函數來簡化邏輯
//   const feedPet = () => {
//     if (inventory.food > 0) {
//       setPet(prev => ({
//         ...prev,
//         hunger: Math.min(100, prev.hunger + 25),
//         happiness: Math.min(100, prev.happiness + 10),
//         lastFed: Date.now()
//       }));
//       setInventory(prev => ({ ...prev, food: prev.food - 1 }));
//       addExp(10);
//       notify(`${pet.name}很開心地吃完了食物！`);
//     } else {
//       notify('沒有食物了！去商店購買吧！');
//     }
//   };

//   const playWithPet = () => {
//     if (pet.energy > 20) {
//       setPet(prev => ({
//         ...prev,
//         happiness: Math.min(100, prev.happiness + 20),
//         energy: Math.max(0, prev.energy - 15),
//         lastPlayed: Date.now()
//       }));
//       addExp(15);
//       const earnedCoins = Math.floor(Math.random() * 10) + 5;
//       setPet(prev => ({ ...prev, coins: prev.coins + earnedCoins }));
//       notify(`和${pet.name}玩得很開心！獲得了${earnedCoins}金幣！`);
//     } else {
//       notify(`${pet.name}太累了，讓它休息一下吧！`);
//     }
//   };

//   const cleanPet = () => {
//     if (inventory.soap > 0) {
//       setPet(prev => ({
//         ...prev,
//         cleanliness: Math.min(100, prev.cleanliness + 30),
//         happiness: Math.min(100, prev.happiness + 5),
//         lastCleaned: Date.now()
//       }));
//       setInventory(prev => ({ ...prev, soap: prev.soap - 1 }));
//       addExp(8);
//       notify(`${pet.name}現在乾乾淨淨的！`);
//     } else {
//       notify('沒有肥皂了！去商店購買吧！');
//     }
//   };

//   const restPet = () => {
//     setPet(prev => ({
//       ...prev,
//       energy: Math.min(100, prev.energy + 40),
//       health: Math.min(100, prev.health + 10)
//     }));
//     notify(`${pet.name}睡了個好覺！`);
//   };