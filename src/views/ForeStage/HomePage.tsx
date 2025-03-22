import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";

import { useRouter } from "@/router/useRouterManger";
import homeStyle from "@/styles/ForeStage/HomePage.module.scss";
import btnStyle from "@/styles/btn.module.scss";

import smellImage from "../../assets/smell.jpg";
import bottleImage from "../../assets/bottle.jpg";
import mapImage from "../../assets/map.jpg";
import breathingImage from "../../assets/breathing.jpg";
import packageImage from "../../assets/package.jpg";
import goodImage from "../../assets/good.jpg";
import peopleAImage from "../../assets/peopleA.jpg";
import peopleBImage from "../../assets/peopleB.jpg";
import peopleCImage from "../../assets/peopleC.jpg";

const HomePage = () => {
  const router = useRouter();
  const { goodsTop3, loading } = useSelector((state: RootState) => state.reception);

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

  const news = [
    {
      title: "2026全新風味的空氣，現已開放預購！",
      text: "你是否想過，呼吸也能成為一種享受？\n2026 年，我們隆重推出全新風味的空氣，為你的日常增添獨特體驗！我們運用創新的淨化技術，融合大自然靈感，帶來清新、純淨的空氣感受。不論是晨間的森林氣息，還是海岸微風的清爽，讓你隨時隨地享受最純粹的呼吸。",
      image: breathingImage,
    },
    {
      title: "新封裝升級，環保材質更友善！",
      text: "我們一直致力於提供優質產品，同時也關心地球環境。這次，我們進一步升級包裝，採用 100% 可回收環保材質，不僅更輕巧耐用，還能有效減少碳足跡。",
      image: packageImage,
    },
    {
      title: "現在購買可享 30 天免費退換！",
      text: "我們深知，購物時的猶豫不決可能讓你錯失好產品。因此，我們提供 30 天免費退換貨服務，讓你的購物體驗更加安心！不論是尺寸不合、顏色不符，還是其他原因，你都可以輕鬆退換，無需擔心任何風險。",
      image: goodImage,
    },
  ];

  const feedback = [
    {
      title: "Emily W.",
      text: "「起初我對『有風味的空氣』感到懷疑，但試過後完全顛覆了我的想法！森林氣息的版本讓人彷彿置身大自然，每次深呼吸都覺得超放鬆。期待未來推出更多不同風味！」",
      image: peopleAImage,
    },
    {
      title: "Jason L.",
      text: "「一直是這款產品的忠實用戶，這次的包裝升級讓我很驚喜！除了環保材質，整體設計也變得更簡約時尚，擺在家裡當裝飾也很好看。很欣賞品牌對環境的用心！」",
      image: peopleBImage,
    },
    {
      title: "Sophia C.",
      text: "「之前購物最怕買錯，結果這次買了之後發現不太適合我，但客服超快回覆，讓我順利換了一款更適合的風味！30 天免費退換貨真的讓人安心，下次還會回購！」",
      image: peopleCImage,
    },
  ];

  const pushToDetail = (id: string) => {
    router.push("productDetail", { productId: id });
  };

  if (loading) {
    return <div className='loading'><i className="bx bx-loader bx-spin bx-lg"></i></div>;
  }

  return (
    <>
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
        <div className={homeStyle.home_block}>
          <h2>最新消息</h2>
          <div className={homeStyle.card_group}>
            {news.map((item, idx) => (
              <div key={idx}>
                <img src={item.image} />
                <p>{item.title}</p>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={homeStyle.home_block}>
          <h2>用戶回饋</h2>
          <div className={homeStyle.card_group}>
            {feedback.map((item, idx) => (
              <div key={idx}>
                <img src={item.image} />
                <p>{item.title}</p>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={homeStyle.home_block}>
          <h2>熱門商品</h2>
          <div className={homeStyle.card_group}>
            {goodsTop3.map((item, idx) => (
              <div key={idx}>
                <img src={item.imageUrl} />
                <p>{item.title}</p>
                <span>{item.description}</span>
                <del>原價: {item.origin_price}</del>
                <span className={homeStyle.discount}>特價:{item.price}</span>
                <button
                  type="button"
                  className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
                  onClick={() => pushToDetail(item.id)}
                >
                  查看商品
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
