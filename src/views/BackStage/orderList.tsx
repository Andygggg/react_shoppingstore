import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Pagination from "@/components/Tools/Pagination";
import OrderDetailModal from "@/components/Modals/OrderDetailModal";

import { AppDispatch, RootState } from "../../stores/store";
import { getOrders, deleteOrder } from "@/stores/orderStore";
import { openMessage } from "@/stores/messageStore";
import { Order } from "@/typings";

import productStyle from "@/styles/BackStage/ProductList.module.scss";
import btnStyle from "@/styles/btn.module.scss";

const OrderList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error, pagination } = useSelector(
    (state: RootState) => state.order
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentOrder = useRef<Order>({} as Order);

  const openModal = (item: Order): void => {
    currentOrder.current = item;
    setIsModalOpen(true);
  };

  const closeModal = (): void => setIsModalOpen(false);

  // 處理換頁
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await dispatch(getOrders(page));
  };

  const handleDelete = async (data: Order) => {
    if (!data.id) return;

    try {
      const { success, message } = await dispatch(
        deleteOrder(data.id)
      ).unwrap();

      dispatch(
        openMessage({
          success,
          message,
        })
      );
      if (success) await dispatch(getOrders(1));
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
      await dispatch(getOrders(1));
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
        <h2>訂單列表</h2>
      </div>

      <div className={productStyle.table_box}>
        <table>
          <thead>
            <tr>
            <th>訂單編號</th>
              <th>購買人</th>
              <th>信箱</th>
              <th>電話</th>
              <th>是否啟用</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user.name}</td>
                <td>{order.user.email}</td>
                <td>{order.user.tel}</td>
                <td>
                  <span
                    className={`${productStyle.status} ${
                      order.is_paid
                        ? productStyle.statusEnabled
                        : productStyle.statusDisabled
                    }`}
                  >
                    {order.is_paid ? "付款" : "未付款"}
                  </span>
                </td>

                <td>
                  <div className={productStyle.actions}>
                    <button
                      className={`${btnStyle.btn} ${btnStyle.btnWarning}`}
                      onClick={() => openModal(order)}
                    >
                      編輯
                    </button>
                    <button
                      className={`${btnStyle.btn} ${btnStyle.btnDanger}`}
                      onClick={() => handleDelete(order)}
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

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        newData={currentOrder.current}
      ></OrderDetailModal>
    </div>
  );
};

export default OrderList;
