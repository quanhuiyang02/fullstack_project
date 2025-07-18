// src/components/LoginPage.jsx
import { useNavigate } from 'react-router-dom';
import background2 from '../assets/t.gif';       // 想用別張登入背景可自行換圖
import titleImg     from '../assets/title.png'; 

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    /* 背景灰 + 置中手機 */
    <div className="w-screen h-screen flex items-center justify-center bg-gray-200 overflow-hidden">
      {/* 📱 手機殼 – 與 App.jsx 相同尺寸 & style */}
      <div
        className="w-[434px] h-[651px] rounded-[2rem] overflow-hidden
                   shadow-xl ring-4 ring-indigo-300/60 bg-white/10 backdrop-blur-md flex flex-col"
        style={{
          backgroundImage: `url(${background2})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        
        {/* 內容：垂直置中 */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 px-8">
          {/* ② 新增 LOGO 圖 */}
          <img
            src={titleImg}
            alt="心寵生活"
            className="w-[300px] object-contain drop-shadow mb-2 "
            style={{  transform: 'translateY(-10rem)' ,opacity: 0.7}}
           />

          <button
            onClick={() => navigate('/game')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white
                       px-10 py-3 rounded-xl text-lg font-semibold
                       shadow-lg transition active:scale-95"
          
          >
            訪客模式登入
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;