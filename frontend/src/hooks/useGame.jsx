import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '../services/apiService';

// 假設您有一個顯示通知的函數
// 這可以來自 Context, Redux, 或其他通知庫 (如 react-toastify)
// 為了演示，我們假設它是一個傳入的函數
const showNotificationMessage = (message) => {
  // 在實際應用中，這裡會調用您的通知系統
  console.log(`[Notification]: ${message}`); 
  alert(`[Notification]: ${message}`);
};

export const useGame = () => {
  // 統一管理所有遊戲狀態
  const [pet, setPet] = useState({ name: '', /* 其他初始值 */ });
  const [inventory, setInventory] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [isLoading, setLoading] = useState(true); // 初始載入狀態
  const [error, setError] = useState(null);

  // 初始化遊戲數據 (只在 Hook 掛載時運行一次)
  useEffect(() => {
    const initializeGame = async () => {
      setLoading(true);
      setError(null);
      try {
        // 使用 Promise.all 並行獲取所有數據，速度更快
        const [petData, inventoryData, shopData] = await Promise.all([
          apiCall('/pet/get_pet.php'),
          apiCall('/inventory/get_inventory.php'),
          apiCall('/shop/get_items.php')
        ]);

        if (petData.success) setPet(petData.pet);
        if (inventoryData.success) setInventory(inventoryData.inventory);
        if (shopData.success) setShopItems(shopData.items);

      } catch (err) {
        setError('遊戲初始化失敗，請檢查網絡連接！');
        showNotificationMessage('遊戲初始化失敗，請檢查網絡連接！');
        console.error('初始化遊戲失敗:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeGame();
  }, []); // 空依賴數組確保只運行一次

  // 封裝一個通用的操作執行函數，來處理重複的 try/catch 和通知
  const handleAction = useCallback(async (actionPromise, successMessage, failureMessage) => {
    try {
      setLoading(true);
      const result = await actionPromise;
      if (result.success) {
        showNotificationMessage(successMessage);
        return true;
      } else {
        // 處理後端返回 { success: false, message: '...' } 的情況
        const finalFailureMessage = result.message || failureMessage;
        showNotificationMessage(finalFailureMessage);
        return false;
      }
    } catch (err) {
      showNotificationMessage(failureMessage);
      console.error(failureMessage, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []); // useCallback 用於性能優化

  // ----- 以下是暴露給元件的具體操作 -----

  const updatePetStats = useCallback(async (newStats) => {
    const actionPromise = apiCall('/pet/update_stats.php', {
      method: 'POST',
      body: JSON.stringify(newStats),
    });
    // 假設更新成功後，我們需要刷新寵物狀態
    const success = await handleAction(actionPromise, '寵物狀態已更新！', '更新寵物狀態失敗！');
    if (success) {
      setPet(prev => ({ ...prev, ...newStats }));
    }
  }, [handleAction]);

  const cleanPet = useCallback(async () => {
    // 這裡可以加入前置檢查邏輯
    const hasSoap = inventory.some(item => item.id === 'soap' && item.quantity > 0);
    if (!hasSoap) {
      showNotificationMessage('沒有肥皂了！去商店購買吧！');
      return;
    }

    const actionPromise = apiCall('/pet/clean.php', { method: 'POST' });
    const success = await handleAction(
      actionPromise,
      `${pet.name} 現在乾乾淨淨的！`,
      '清潔失敗，請稍後再試！'
    );
    // 如果清潔成功，可以更新本地庫存和寵物狀態
    if (success) {
        // 例如：減少一個肥皂
        setInventory(prev => prev.map(item => 
            item.id === 'soap' ? { ...item, quantity: item.quantity - 1 } : item
        ));
        // 例如：更新寵物清潔度
        setPet(prev => ({ ...prev, cleanliness: 100 }));
    }
  }, [inventory, pet.name, handleAction]);

  // 你可以繼續在這裡添加其他操作，例如 feedPet, playWithPet 等

  // 從 Hook 返回狀態和操作函數
  return {
    pet,
    inventory,
    shopItems,
    isLoading,
    error,
    actions: {
      updatePetStats,
      cleanPet,
      // feedPet,
      // playWithPet,
    },
  };
};