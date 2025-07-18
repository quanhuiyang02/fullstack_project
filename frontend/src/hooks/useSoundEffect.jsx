// hooks/useSoundEffect.jsx
import { useRef, useEffect } from "react";
import clickSound from "../assets/click.mp3";
import magicSound from "../assets/magic.mp3";
import coinSound from "../assets/coin.mp3";
import bgm from "../assets/bgm.mp3";
import statsMusic from "../assets/win.mp3";

const useSoundEffects = (currentView) => {
  
  // 音效播放器
  const clickAudio = useRef(null);
  const magicAudio = useRef(null);
  const coinAudio = useRef(null);
  const bgmAudio = useRef(null);
  const statsAudio = useRef(null);
  const prevView = useRef(null);

  // 音效播放器初始化
  useEffect(() => {
    clickAudio.current = new Audio(clickSound);
    magicAudio.current = new Audio(magicSound);
    coinAudio.current = new Audio(coinSound);

    bgmAudio.current = new Audio(bgm);
    bgmAudio.current.loop = true;
    bgmAudio.current.volume = 0.5;

    statsAudio.current = new Audio(statsMusic);
    statsAudio.current.loop = true;
    statsAudio.current.volume = 0.5;

    // 等待使用者互動才播放（瀏覽器限制）
    const handleUserInteraction = () => {
      if (currentView === "stats") {
        statsAudio.current.play();
      } else if (currentView === "home" || currentView === "shop") {
        bgmAudio.current.play();
      }
      window.removeEventListener("click", handleUserInteraction);
    };
    window.addEventListener("click", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      bgmAudio.current.pause();
      statsAudio.current.pause();
    };
  }, []);

  useEffect(() => {
    if (!bgmAudio.current || !statsAudio.current) return;

    const prev = prevView.current;

    if (currentView === "stats") {
      // 進入 stats，停 bgm，播 stats 音樂
      if (!bgmAudio.current.paused) {
        bgmAudio.current.pause();
      }
      statsAudio.current.currentTime = 0;
      statsAudio.current.play();
    } else if (currentView === "home" || currentView === "shop") {
      if (prev === "stats") {
        // 從 stats 切回 home/shop，停 stats，繼續播放 bgm（不中斷、不重頭）
        statsAudio.current.pause();
        bgmAudio.current.play();
      } else {
        // home/shop 之間切換，bgm不中斷，若尚未播放就播放
        if (bgmAudio.current.paused) {
          bgmAudio.current.play();
        }
      }
    } else {
      // 其他頁面停掉所有音樂
      bgmAudio.current.pause();
      statsAudio.current.pause();
    }

    prevView.current = currentView;
  }, [currentView]);

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
    playCoin,
  };
};

export default useSoundEffects;