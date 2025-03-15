import homeStyle from '@/styles/ForeStage/HomePage.module.scss'
import smellImage from "../../assets/smell.jpg";
import bottleImage from '../../assets/bottle.jpg'
import mapImage from '../../assets/map.jpg'

const HomePage = () => {
  const sections = [
    {
      title: "來自世界各地的空氣，帶給你全新感官體驗",
      text: "你曾想過，空氣也能成為回憶的一部分嗎？無論是阿爾卑斯山的清新晨霧，還是日本櫻花季的微風，我們將世界各地的獨特空氣封裝，讓你隨時隨地都能感受不同的氛圍。開瓶那一刻，彷彿踏上了一場沒有距離的旅行。",
      image: smellImage,
      reverse: false,
    },
    {
      title: "嚴格密封技術，鎖住最純淨的氣息",
      text: "為了確保每一口空氣都保持原始風味，我們採用高密封度鋁罐與玻璃瓶，搭配低溫充填技術，確保空氣的純淨與穩定。我們的專業儲存技術，能夠完整保留空氣中的微量元素，讓你無論身處何地，都能真實體驗來自世界各地的不同氣息。",
      image: bottleImage,
      reverse: true,
    },
    {
      title: "你的空氣，由你決定",
      text: "想要一瓶屬於你的獨特空氣嗎？無論是回憶中的某個旅行地點，還是你夢想前往的國度，我們提供客製化服務，讓你選擇專屬的空氣來源、包裝設計，甚至是獨特的氣味混合。我們相信，空氣不只是存在於環境中，更能成為個人情感與記憶的載體。",
      image: mapImage,
      reverse: false,
    },
  ];

  return (<>
  <div className={homeStyle.home_box}>
    <div className={homeStyle.home_header}>
      <p>Breeze & Co.</p>
      <span>呼吸世界，感受不同風景的氣息</span>
      <span>來自世界各地的純淨空氣，現在就送到你身邊！</span>
    </div>
    <div className={homeStyle.home_body}>
    {sections.map((section, index) => (
        <div
          key={index}
          className={`${section.reverse ? homeStyle.reverse : ""}`}
        >
          <img src={section.image} alt={section.title} />
          <div className={homeStyle.text_width}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  </>)
}

export default HomePage