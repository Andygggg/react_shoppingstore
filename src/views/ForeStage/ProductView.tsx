import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Pagination from "@/components/Tools/Pagination";
import { AppDispatch, RootState } from "../../stores/store";
import { getClientProducts, addToCart } from "@/stores/receptionStore";
import { useRouter } from "@/router/useRouterManger";
import viewStyle from "@/styles/ForeStage/ProductView.module.scss";

const ProductView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { goodsList, pagination, category } = useSelector(
    (state: RootState) => state.reception
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCartId, setLoadingCartId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await dispatch(getClientProducts(1));
    })();
  }, [dispatch]);

  // 處理換頁
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await dispatch(getClientProducts(page));
  };

  const pushToDetail = (id: string) => {
    router.push("productDetail", { productId: id });
  };

  const joinCart = async (id: string, qty: number) => {
    setLoadingCartId(id);
    try {
      await dispatch(addToCart({ id, qty }));
    } finally {
      setLoadingCartId(null);
    }
  };

  return (
    <>
      <div className={viewStyle.view_box}>
        <ul className={viewStyle.menu_block}>
          <li>產品類別</li>
          <li>所有產品</li>
          {category.map((obj) => (
            <li key={obj}>{obj}</li>
          ))}
        </ul>
        <div className={viewStyle.view_content}>
          {goodsList.map((item) => (
            <div key={item.id} className={viewStyle.card}>
              <img
                src={item.imageUrl ? item.imageUrl : "test.png"}
                alt={item.content}
                onClick={() => pushToDetail(item.id)}
              />
              <p>{item.title}</p>
              <p>{item.description ?? ""}</p>
              <span>
                <del className="h6">${item.origin_price}</del>${item.price}
                <div className={viewStyle.cart_btn}>
                  {loadingCartId === item.id ? (
                    <i className="bx bx-loader bx-spin"></i>
                  ) : (
                    <i
                      className="bx bx-cart-add bx-sm"
                      onClick={() => {
                        joinCart(item.id, 1);
                      }}
                    ></i>
                  )}
                </div>
              </span>
            </div>
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default ProductView;
