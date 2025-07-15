import { useRef, useEffect } from "react";
import clickSound from "../assets/click.mp3";
import magicSound from "../assets/magic.mp3";
import coinSound from "../assets/coin.mp3";
import bgm from "../assets/bgm.mp3";

const useSoundEffects = () => {
    // 音效播放器
    const clickAudio = useRef(null);
    const magicAudio = useRef(null);
    const coinAudio = useRef(null);
    const bgmAudio = useRef(null);

    // 音效播放器初始化
    useEffect(() => {
    clickAudio.current = new Audio(clickSound);
    magicAudio.current = new Audio(magicSound);
    coinAudio.current = new Audio(coinSound);
    bgmAudio.current = new Audio(bgm);

    bgmAudio.current.loop = true;
    bgmAudio.current.volume = 0.5;

    // 等待使用者互動才播放（瀏覽器限制）
    const handleUserInteraction = () => {
      bgmAudio.current.play();
      window.removeEventListener('click', handleUserInteraction);
    };
    window.addEventListener('click', handleUserInteraction);

    return () => {
      bgmAudio.current.pause();
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  const playClick = () => {
    if (clickAudio.current) {
      clickAudio.current.currentTime = 0;
      clickAudio.current.play();
    }
  };
  const playMagic = () => {
    if (magicAudio.current) {
      magicAudio.current.currentTime = 0;
      magicAudio.current.play();
    }
  };
  const playCoin = () => {
    if (coinAudio.current) {
      coinAudio.current.currentTime = 0;
      coinAudio.current.play();
    }
  };
    return {
    playClick,
    playMagic,
    playCoin
  };
}

export default useSoundEffects;
