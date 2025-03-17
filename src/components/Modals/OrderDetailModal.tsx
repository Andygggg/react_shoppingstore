import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/store";
import { openMessage } from "@/stores/messageStore";
import { editOrder, getOdrders } from "@/stores/orderStore";
import modalStyle from "@/styles/Modal/OrderDetailModal.module.scss";

interface OrderDetailModalProps {
  newData: any; // Order data from parent component
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal = ({
  newData,
  isOpen,
  onClose,
}: OrderDetailModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Use the data passed from parent component
    if (newData && newData.id) {
      console.log(newData);

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
    console.log(editData);

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

        await dispatch(getOdrders(1));
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

  // Don't render if modal is not open
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
                    {orderData.is_paid ? "已付款" : "未付款"}
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
                        (item: any, index) => (
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
          <button className={modalStyle.cancelButton} onClick={onClose}>
            關閉
          </button>
          {orderData && !orderData.is_paid && (
            <button
              className={modalStyle.confirmButton}
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
