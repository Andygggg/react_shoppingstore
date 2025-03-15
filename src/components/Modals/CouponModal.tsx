import { useState, FormEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";

import { AppDispatch } from "../../stores/store";
import { addCoupon, getCoupons, editCoupon } from "@/stores/couponStore";
import { openMessage } from "@/stores/messageStore";
import type { Coupon } from "@/typings";

import couponStyle from "@/styles/Modal/Modal.module.scss";
import btnStyle from "@/styles/btn.module.scss";

// 定義 props 的類型
interface ModalProps {
  newData: Coupon;
  isOpen: boolean;
  onClose: () => void;
}

// 使用函數聲明而非 React.FC
const CouponModal = ({ isOpen, onClose, newData }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [coupon, setCoupon] = useState<Coupon>({} as Coupon);
  const [isCreate, setIsCreate] = useState<boolean>(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if(isCreate) {
        const { message, success } = await dispatch(addCoupon(coupon)).unwrap();

        dispatch(
          openMessage({
            success,
            message,
          })
        );
      } else {
        const { message, success } = await dispatch(editCoupon(coupon)).unwrap();

        dispatch(
          openMessage({
            success,
            message,
          })
        );
      }
      await dispatch(getCoupons(1));
      onClose();
    } catch (error) {
      dispatch(
        openMessage({
          success: false,
          message: "操作失敗",
        })
      );
      console.error("失敗:", error);
    }
  };

  const handleInput = (name: string, value: any) => {
    setCoupon((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setIsCreate(newData.id ? false : true);
    setCoupon(newData);
  }, [newData]);

  // 如果 isOpen 為 false，則不渲染任何內容
  if (!isOpen) return null;

  return (
    <div className={couponStyle.login_modal}>
      {/* 黑色遮罩層 */}
      <div className={couponStyle.backdrop} onClick={onClose}></div>

      <div className={couponStyle.modal_content}>
        <div className={couponStyle.modal_header}>
          <span>{isCreate ? "新增優惠卷" : "編輯優惠卷"}</span>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={couponStyle.form_item}>
            <label htmlFor="title">名稱</label>
            <input
              id="title"
              type="text"
              value={coupon.title}
              onChange={(e) => handleInput("title", e.target.value)}
              required
            />
          </div>

          <div className={couponStyle.form_item}>
            <label htmlFor="percent">折扣</label>
            <input
              id="percent"
              type="number"
              value={coupon.percent}
              onChange={(e) => handleInput("percent", e.target.value)}
              required
            />
          </div>

          <div className={couponStyle.form_item}>
            <label htmlFor="due_date">使用期限</label>
            <input
              id="due_date"
              type="date"
              value={moment
                .unix(coupon.due_date as number)
                .format("YYYY-MM-DD")}
              onChange={(e) => handleInput("due_date", e.target.value)}
              required
            />
          </div>

          <div className={couponStyle.input_check}>
            <label htmlFor="is_enabled">是否啟用</label>
            <input
              id="is_enabled"
              type="checkbox"
              checked={coupon.is_enabled === 1}
              onChange={(e) =>
                handleInput("is_enabled", e.target.checked ? 1 : 0)
              }
              required
            />
          </div>

          <div className={couponStyle.btn_item}>
            <button
              type="submit"
              className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
            >
              {isCreate ? "新增" : "編輯"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;
