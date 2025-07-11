// 音效播放器初始化
const clickAudio = new Audio(clickSound);
const magicAudio = new Audio(magicSound);
const coinAudio = new Audio(coinSound);
const bgmAudio = new Audio(bgm);

bgmAudio.loop = true; // 背景音樂循環
bgmAudio.volume = 0.5; // 音量可自行調整
bgmAudio.play();

const VirtualPetGame = () => {
  const [pet, setPet] = useState({
    name: '臭屁星人',
    type: 'cat',
    level: 1,
    exp: 0,
    health: 80,
  });

  // 點擊音效函式
  const playClick = () => {
    clickAudio.currentTime = 0;
    clickAudio.play();
  };

  const playMagic = () => {
    magicAudio.currentTime = 0;
    magicAudio.play();
  };

  const playCoin = () => {
    coinAudio.currentTime = 0;
    coinAudio.play();
  };

  // 以下用例
  const handleFeed = () => {
    // 餵食邏輯
    playMagic();
  };

  const handleClean = () => {
    // 清潔邏輯
    playMagic();
  };

  const handlePlay = () => {
    // 遊戲邏輯
    playMagic();
  };

  const handleRest = () => {
    // 休息邏輯
    playMagic();
  };

  const handleShopBuyFood = () => {
    // 買食物邏輯
    playCoin();
  };

  const handleShopBuyClean = () => {
    // 買清潔用品邏輯
    playCoin();
  };

  const handleShopBuyToy = () => {
    // 買玩具邏輯
    playCoin();
  };

  return (
    <div>
      {/* 首頁底部按鈕 */}
      <button onClick={playClick}>首頁</button>
      <button onClick={playClick}>商店</button>
      <button onClick={playClick}>統計</button>

      {/* 互動按鈕 */}
      <button onClick={handleFeed}>餵食</button>
      <button onClick={handleClean}>清潔</button>
      <button onClick={handlePlay}>遊戲</button>
      <button onClick={handleRest}>休息</button>

      {/* 商店按鈕 */}
      <button onClick={handleShopBuyFood}>購買食物</button>
      <button onClick={handleShopBuyClean}>購買清潔用品</button>
      <button onClick={handleShopBuyToy}>購買玩具</button>
    </div>
  );
};
