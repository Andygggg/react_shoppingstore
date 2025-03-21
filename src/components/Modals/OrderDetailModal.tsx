import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/store";
import { openMessage } from "@/stores/messageStore";
import { editOrder, getOrders } from "@/stores/orderStore";
import modalStyle from "@/styles/Modal/OrderDetailModal.module.scss";
import btnStyle from "@/styles/btn.module.scss";

import { Order } from "@/typings";

interface OrderDetailModalProps {
  newData: Order; // Order data from parent component
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal = ({
  newData,
  isOpen,
  onClose,
}: OrderDetailModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [orderData, setOrderData] = useState<Order>({} as Order);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (newData && newData.id) {
      setOrderData(newData);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [newData]);

  const handleConfirmPayment = async () => {
    if (!orderData || !orderData.id) return;

    const editData = {
      ...orderData,
      is_paid: true, // 更新為已付款
    };
    try {
      const { message, success } = await dispatch(editOrder(editData)).unwrap();

      dispatch(
        openMessage({
          success,
          message,
        })
      );

      if (success) {
        setOrderData({
          ...orderData,
          is_paid: true,
        });

        await dispatch(getOrders(1));
        onClose()
      }
    } catch (error) {
      console.error("更新付款狀態時發生錯誤:", error);
      dispatch(
        openMessage({
          success: false,
          message: "更新付款狀態失敗",
        })
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className={modalStyle.modalOverlay}>
      <div className={modalStyle.modalContent}>
        <div className={modalStyle.modalHeader}>
          <h3>訂單詳細資訊</h3>
          <button className={modalStyle.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={modalStyle.modalBody}>
          {loading ? (
            <div className={modalStyle.loading}>
              <i className="bx bx-loader bx-spin bx-lg"></i>
            </div>
          ) : orderData ? (
            <>
              <div className={modalStyle.orderInfo}>
                <p>訂單編號: {orderData.id}</p>
                <p className={modalStyle.paymentStatus}>
                  付款狀態:
                  <span
                    className={
                      orderData.is_paid ? modalStyle.paid : modalStyle.unpaid
                    }
                  >
                    {orderData.is_paid ? "付款" : "未付款"}
                  </span>
                </p>
              </div>

              <div className={modalStyle.productList}>
                <h4>訂單產品</h4>
                <table className={modalStyle.productTable}>
                  <thead>
                    <tr>
                      <th>產品名稱</th>
                      <th>數量</th>
                      <th>金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.products &&
                      Object.values(orderData.products).map(
                        (item, index) => (
                          <tr key={index}>
                            <td>{item.product.title}</td>
                            <td>{item.qty}</td>
                            <td>${item.total.toLocaleString()}</td>
                          </tr>
                        )
                      )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2} className={modalStyle.totalLabel}>
                        總計
                      </td>
                      <td className={modalStyle.totalAmount}>
                        ${orderData.total.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            <p className={modalStyle.error}>無法載入訂單資料</p>
          )}
        </div>

        <div className={modalStyle.modalFooter}>
          {orderData && !orderData.is_paid && (
            <button
            className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
              onClick={handleConfirmPayment}
            >
              確認付款
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
