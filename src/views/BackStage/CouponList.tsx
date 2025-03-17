import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import Pagination from "@/components/Tools/Pagination";
import CouponModal from "@/components/Modals/CouponModal";

import { AppDispatch, RootState } from "../../stores/store";
import { getCoupons, deleteCoupon } from "@/stores/couponStore";
import { openMessage } from "@/stores/messageStore";
import type { Coupon } from "@/typings";

import productStyle from "@/styles/BackStage/ProductList.module.scss";
import btnStyle from "@/styles/btn.module.scss";

const defaultCoupon: Coupon = {
  title: "",
  is_enabled: 1, // 預設值
  percent: 0,
  due_date: moment(new Date(), "YYYY-MM-DD").unix(),
  code: "testCode",
  num: 0,
  id: "",
};

const CouponList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coupons, loading, error, pagination } = useSelector(
    (state: RootState) => state.coupon
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentCoupon = useRef<Coupon>(defaultCoupon);

  const openModal = (): void => {
    currentCoupon.current = defaultCoupon;
    setIsModalOpen(true);
  };

  const editModal = (item: Coupon): void => {
    console.log(item);

    currentCoupon.current = item;
    setIsModalOpen(true);
  };
  const closeModal = (): void => setIsModalOpen(false);

  // 處理換頁
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await dispatch(getCoupons(page));
  };

  const handleDelete = async (data: Coupon) => {
    if (!data.id) return;

    try {
      const { success, message } = await dispatch(
        deleteCoupon(data.id)
      ).unwrap();

      dispatch(
        openMessage({
          success,
          message,
        })
      );
      if (success) await dispatch(getCoupons(1));
    } catch (err) {
      console.error("刪除產品時發生錯誤:", err);
      dispatch(
        openMessage({
          success: false,
          message: "刪除產品時發生錯誤",
        })
      );
    }
  };

  useEffect(() => {
    (async () => {
      await dispatch(getCoupons(1));
    })();
  }, [dispatch]);

  if (loading) {
    return (
      <div className={productStyle.loading}>
        <i className="bx bx-loader bx-spin bx-lg"></i>
      </div>
    );
  }

  if (error) {
    return <div className={productStyle.error}>載入失敗: {error}</div>;
  }

  return (
    <div className={productStyle.list_box}>
      <div className={productStyle.header}>
        <h2>優惠劵列表</h2>
        <button
          className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
          onClick={openModal}
        >
          新增優惠劵
        </button>
      </div>

      <div className={productStyle.table_box}>
        <table>
          <thead>
            <tr>
              <th>優惠劵名稱</th>
              <th>折扣</th>
              <th>數量</th>
              <th>使用期限</th>
              <th>是否啟用</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>{coupon.title}</td>
                <td className={productStyle.price}>
                  {(coupon.percent / 100).toLocaleString()}
                </td>
                <td className={productStyle.price}>
                  {coupon.num.toLocaleString()}
                </td>
                <td>
                  <span
                    className={`${productStyle.status} ${
                      coupon.is_enabled
                        ? productStyle.statusEnabled
                        : productStyle.statusDisabled
                    }`}
                  >
                    {coupon.is_enabled ? "啟用" : "停用"}
                  </span>
                </td>
                <td>
                  {moment.unix(coupon.due_date as number).format("YYYY-MM-DD")}
                </td>
                <td>
                  <div className={productStyle.actions}>
                    <button
                      className={`${btnStyle.btn} ${btnStyle.btnWarning}`}
                      onClick={() => editModal(coupon)}
                    >
                      編輯
                    </button>
                    <button
                      className={`${btnStyle.btn} ${btnStyle.btnDanger}`}
                      onClick={() => handleDelete(coupon)}
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pagination.total_pages}
        onPageChange={handlePageChange}
      />

      <CouponModal
        isOpen={isModalOpen}
        onClose={closeModal}
        newData={currentCoupon.current}
      />
    </div>
  );
};

export default CouponList;
