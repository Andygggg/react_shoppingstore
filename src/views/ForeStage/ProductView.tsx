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
  const { goodsList, pagination, category, loading } = useSelector(
    (state: RootState) => state.reception
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCartId, setLoadingCartId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // 處理類別選擇
  const handleCategorySelect = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1); // 重置頁面到第一頁
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

  const formatNumber = (num: number) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 篩選商品列表
  const filteredGoodsList = selectedCategory
    ? goodsList.filter((item) => item.category === selectedCategory)
    : goodsList;

  if (loading) {
    return (
      <div className="loading">
        <i className="bx bx-loader bx-spin bx-lg"></i>
      </div>
    );
  }

  return (
    <>
      <div className={viewStyle.view_box}>
        <ul className={viewStyle.menu_block}>
          <li>產品類別</li>
          <li
            className={selectedCategory === null ? viewStyle.active : ""}
            onClick={() => handleCategorySelect(null)}
          >
            所有產品
          </li>
          {category.map((categoryName) => (
            <li
              key={categoryName}
              className={
                selectedCategory === categoryName ? viewStyle.active : ""
              }
              onClick={() => handleCategorySelect(categoryName)}
            >
              {categoryName}
            </li>
          ))}
        </ul>
        <div className={viewStyle.view_content}>
          {filteredGoodsList.length > 0 ? (
            filteredGoodsList.map((item) => (
              <div key={item.id} className={viewStyle.card}>
                <img
                  src={item.imageUrl ? item.imageUrl : "test.png"}
                  alt={item.content}
                  onClick={() => pushToDetail(item.id)}
                />
                <p>{item.title}</p>
                <p>{item.description ?? ""}</p>
                <span>
                  <del className="h6">${formatNumber(item.origin_price)}</del>$
                  {formatNumber(item.price)}
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
            ))
          ) : (
            <div className={viewStyle.no_products}>
              <p>此類別暫無產品</p>
            </div>
          )}

          {!selectedCategory && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductView;
