import homeStyle from "@/styles/ForeStage/HomePage.module.scss";

import journeyImage from "../../assets/journey.jpg";
import successImage from "../../assets/success.jpg";
import futureImage from "../../assets/future.jpg";

const About = () => {
  const sections = [
    {
      title: "起源：來自一次偶然的靈感",
      text: "這個想法始於一次旅程。創辦人站在阿爾卑斯山脈的山巔，深吸一口氣，感受到前所未有的清新與純淨。當時他心想：「如果能把這份空氣帶回家，與朋友分享，會是怎樣的體驗？」這個簡單的念頭，成為品牌的起點。我們開始研究如何 捕捉世界各地的空氣，讓它成為一種珍貴的收藏，讓人們可以隨時回味某段旅程、某個時刻，甚至某種情感。",
      image: journeyImage,
      reverse: false,
    },
    {
      title: "成長：從瘋狂點子到全球收藏熱潮",
      text: "剛開始，我們的概念被許多人質疑：「誰會花錢買一罐空氣？」但當第一批來自 北歐森林、日本櫻花季、紐西蘭高山 的空氣罐推出後，人們開始理解其中的獨特價值。對於那些懷念異地旅程的人來說，一罐空氣就像一本故事書，讓人們透過嗅覺回到過去的時光。隨著品牌的成長，我們也不斷提升技術，確保每一罐空氣都是真實捕捉自當地，並透過獨特的 密封保存技術，讓氣息能夠長時間保持最佳狀態。我們的客戶來自世界各地，包括旅遊愛好者、收藏家，甚至有些藝術家將我們的空氣納入作品之中。",
      image: successImage,
      reverse: true,
    },
    {
      title: "未來：創造更多能被「收藏」的空氣",
      text: "想我們的故事還在持續。我們不只是販售空氣，而是打造一種新的 情感收藏方式。接下來，我們將擴展到更多未曾開發的地點，例如 極地冰川、熱帶雨林、古文明遺址，甚至與知名品牌合作，推出限定的 「歷史空氣系列」，讓你聞到幾十年前的經典時代氛圍。我們相信，空氣蘊藏著故事，而我們的使命就是將這些故事帶給世界。",
      image: futureImage,
      reverse: false,
    },
  ];

  return (
    <>
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
    </>
  );
};

export default About;
