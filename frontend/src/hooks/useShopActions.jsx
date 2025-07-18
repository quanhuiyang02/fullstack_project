// src/hooks/useShopActions.tsx
const useShopActions = ({ pet, setPet, inventory, setInventory, notify }) => {

  const buyItem = (item, cost) => {
    if (pet.coins >= cost) {
      setPet(prev => ({ ...prev, coins: prev.coins - cost }));
      setInventory(prev => ({ ...prev, [item]: prev[item] + 1 }));

      const itemNameMap = {
        food: '食物',
        soap: '肥皂',
        toys: '玩具',
        medicine: '藥品'
      };
      notify(`購買了${itemNameMap[item] || item}！`);

    } else {
      notify('金幣不足！');
    }
  };

  return { buyItem };
};

export default useShopActions;