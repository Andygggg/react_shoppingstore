import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../stores/store";
import { getClientProduct, addToCart } from "@/stores/receptionStore";
import { useRouter } from "@/router/useRouterManger";

import detailStyle from "@/styles/ForeStage/ProductDetail.module.scss";
import btnStyle from "@/styles/btn.module.scss";

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = router.routerParams;

  const dispatch = useDispatch<AppDispatch>();
  const { goods } = useSelector((state: RootState) => state.reception);
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const [currentImg, setCurrentImg] = useState<string>(goods.imageUrl);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await dispatch(getClientProduct(productId));
    })();
  }, [dispatch, productId]);

  useEffect(() => {
    if (goods.imageUrl) {
      setCurrentImg(goods.imageUrl);
    }
  }, [goods]);

  const handleDecrease = () => {
    setCartQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setCartQuantity((prev) => Math.min(10, prev + 1));
  };

  const joinCart = async (id: string) => {
    setLoading(true);
    await dispatch(addToCart({ id, qty: cartQuantity }));
    setLoading(false);
  };

  return (
    <>
      <div className={detailStyle.detail_box}>
        <div className={detailStyle.detail_header}>
          <p onClick={() => router.push("homePage")}>首頁</p>/
          <p onClick={() => router.push("productView")}>產品目錄</p>/
          <p>{goods.title}</p>
        </div>
        <div className={detailStyle.detail_img}>
          <img src={currentImg} alt={goods.title} />
          <div className={detailStyle.more}>
            <img
              src={goods.imageUrl}
              alt={`商品圖片`}
              onClick={() => setCurrentImg(goods.imageUrl)}
            />
            {goods.imagesUrl?.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`商品圖片 ${index + 1}`}
                onClick={() => setCurrentImg(item)}
              />
            ))}
          </div>
        </div>
        <div className={detailStyle.detail_card}>
          <div className={detailStyle.title}>{goods.title}</div>
          <div className={detailStyle.row}>
            <span className={detailStyle.second_title}>商品類型</span>
            <span className={detailStyle.category}>{goods.category}</span>
          </div>
          <div className={detailStyle.row}>
            <span className={detailStyle.second_title}>商品描述</span>
            <span>{goods.description}</span>
          </div>
          <div className={detailStyle.row}>
            <span className={detailStyle.second_title}>原價</span>
            <del>{goods.origin_price} 元</del>
          </div>
          <div className={detailStyle.row}>
            <span className={detailStyle.second_title}>優惠價</span>
            <span className={detailStyle.money}>{goods.price} 元</span>
          </div>
          <div className={detailStyle.row} style={{ marginTop: "auto" }}>
            <div className={detailStyle.quantity_input}>
              <button onClick={handleDecrease}>−</button>
              <input
                type="number"
                value={cartQuantity}
                min={1}
                max={10}
                onChange={(e) => setCartQuantity(Number(e.target.value))}
              />
              <button onClick={handleIncrease}>+</button>
            </div>
          </div>
          <div className={detailStyle.row} style={{ marginTop: "20px" }}>
            <span>合計{goods.price * cartQuantity}元</span>
            <button
              type="button"
              className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
              onClick={() => joinCart(goods.id)}
            >
              {isLoading ? (
                <i className="bx bx-loader bx-spin"></i>
              ) : (
                "加入購物車"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
