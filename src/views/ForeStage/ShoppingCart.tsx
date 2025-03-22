import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, memo, ChangeEvent, FormEvent } from "react";
import { useForm, FieldErrors } from "react-hook-form";

import { AppDispatch, RootState } from "../../stores/store";
import {
  getClientCart,
  delAllCart,
  updateCartItem,
  delGoods,
  orderCart,
  getProductCoupon,
} from "@/stores/receptionStore";
import { openMessage } from "@/stores/messageStore";
import { useRouter } from "@/router/useRouterManger";

import cartStyle from "@/styles/ForeStage/ShoppingCart.module.scss";
import btnStyle from "@/styles/btn.module.scss";

// 定義購物車項目的介面
interface CartProduct {
  title: string;
  price: number;
  imageUrl: string;
}

interface CartItem {
  id: string;
  product_id: string;
  qty: number;
  total: number;
  product: CartProduct;
}

// 定義訂單表單的介面
interface OrderForm {
  name: string;
  email: string;
  tel: string;
  address: string;
  message: string;
}

// 定義購物車表格組件的 props 介面
interface CartTableProps {
  cartList: CartItem[];
  editCart: (id: string, product_id: string, qty: number) => Promise<void>;
  removeGoods: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  router: any; // 可以根據 useRouter 的實際返回類型進行更精確的定義
  setIsOrder: (isOrder: boolean) => void;
}

// 定義優惠碼輸入組件的 props 介面
interface CouponInputProps {
  code: string;
  onCodeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onApplyCoupon: (e: React.MouseEvent) => Promise<void>;
}

// 定義購物車訂單組件的 props 介面
interface CartOrderProps {
  cartList: CartItem[];
  setIsOrder: (isOrder: boolean) => void;
  onSubmit: (e: FormEvent) => void;
  errors: FieldErrors<OrderForm>;
  register: any;
  code: string;
  handleCodeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  useCoupon: (e: React.MouseEvent) => Promise<void>;
  discountAmount: number
}

const CartTable = memo(({ cartList, editCart, removeGoods, clearCart, router, setIsOrder }: CartTableProps) => {
  return (
    <>
      <div className={cartStyle.cart_table}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>產品名稱</th>
              <th>數量</th>
              <th>單價</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartList.map((cart) => {
              return (
                <tr key={cart.id}>
                  <td>
                    <img
                      src={cart.product.imageUrl}
                      alt={cart.product.title}
                    />
                  </td>
                  <td data-label="產品名稱">{cart.product.title}</td>
                  <td data-label="數量">
                    <div className={cartStyle.quantity_input}>
                      <button
                        onClick={() =>
                          editCart(
                            cart.id,
                            cart.product_id,
                            cart.qty - 1 < 1 ? 1 : cart.qty - 1
                          )
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        defaultValue={cart.qty}
                        key={cart.qty}
                        onChange={(e) =>
                          editCart(
                            cart.id,
                            cart.product_id,
                            Number(e.target.value)
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          editCart(cart.id, cart.product_id, cart.qty + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td data-label="單價">{cart.product.price}元</td>
                  <td>
                    <button
                      className={`${btnStyle.btn} ${btnStyle.btnIcon}`}
                      onClick={() => {
                        removeGoods(cart.id);
                      }}
                    >
                      <i className="bx bxs-trash bx-sm"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className={cartStyle.text_end}>
                總計：{cartList.reduce((sum, cart) => sum + cart.total, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className={cartStyle.btn_group}>
        <button
          className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
          onClick={() => router.push("productView")}
        >
          繼續購物
        </button>
        <button
          className={`${btnStyle.btn} ${btnStyle.btnDanger}`}
          onClick={clearCart}
          disabled={cartList.length < 1}
        >
          清空購物車
        </button>
        <button
          className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
          onClick={() => setIsOrder(true)}
          disabled={cartList.length < 1}
        >
          前往結帳
        </button>
      </div>
    </>
  );
});

const CouponInput = memo(({ code, onCodeChange, onApplyCoupon }: CouponInputProps) => {
  return (
    <li>
      <input
        type="text"
        value={code}
        onChange={onCodeChange}
      />
      <button type="button" className={`${btnStyle.btn} ${btnStyle.btnPrimary}`} onClick={onApplyCoupon}>套用</button>
    </li>
  );
});

const CartOrder = memo(({ cartList, setIsOrder, onSubmit, errors, register, code, handleCodeChange, useCoupon, discountAmount }: CartOrderProps) => {
  return (
    <>
      <form className={cartStyle.cart_form} onSubmit={onSubmit}>
        <div className={cartStyle.form_item}>
          <label htmlFor="name">收件人姓名</label>
          <input
            id="name"
            type="text"
            placeholder="請輸入姓名"
            {...register("name", { required: "請輸入收件人姓名。" })}
          />
          {errors.name && (
            <p className={cartStyle.error}>{errors.name.message}</p>
          )}
        </div>

        <div className={cartStyle.form_item}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="請輸入 Email"
            {...register("email", {
              required: "請輸入 Email。",
              pattern: { value: /^\S+@\S+$/i, message: "Email 格式不正確。" },
            })}
          />
          {errors.email && (
            <p className={cartStyle.error}>{errors.email.message}</p>
          )}
        </div>
        <div className={cartStyle.form_item}>
          <label htmlFor="tel">收件人電話</label>
          <input
            id="tel"
            type="tel"
            placeholder="請輸入電話"
            {...register("tel", {
              required: "請輸入收件人電話。",
              minLength: {
                value: 8,
                message: "電話號碼至少需要 8 碼。",
              },
              pattern: {
                value: /^\d+$/,
                message: "電話號碼格式不正確，僅限數字。",
              },
            })}
          />
          {errors.tel && (
            <p className={cartStyle.error}>{errors.tel.message}</p>
          )}
        </div>

        <div className={cartStyle.form_item}>
          <label htmlFor="address">收件人地址</label>
          <input
            id="address"
            type="text"
            placeholder="請輸入地址"
            {...register("address", { required: "請輸入收件人地址。" })}
          />
          {errors.address && (
            <p className={cartStyle.error}>{errors.address.message}</p>
          )}
        </div>

        <div className={cartStyle.form_item}>
          <label htmlFor="message">留言</label>
          <textarea
            id="message"
            placeholder="留言"
            rows={3}
            {...register("message")}
          />
        </div>

        <div className={cartStyle.btn_item}>
          <button
            type="button"
            className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
            onClick={() => setIsOrder(false)}
          >
            返回
          </button>

          <button
            type="submit"
            className={`${btnStyle.btn} ${btnStyle.btnDanger}`}
            disabled={cartList.length < 1}
          >
            送出訂單
          </button>
        </div>
      </form>

      <div className={cartStyle.cart_checkout}>
        <p>訂單資訊</p>
        <ul>
          <li>
            <span>產品</span>
            <span>總計</span>
          </li>
          {cartList.map((item) => (
            <li key={item.id}>
              <span>
                {item.product.title} x {item.qty}
              </span>
              <span>$ {item.total}</span>
            </li>
          ))}
          <CouponInput
            code={code}
            onCodeChange={handleCodeChange}
            onApplyCoupon={useCoupon}
          />
          <li>
            <span>總計</span>
            <span>$ {discountAmount}</span>
          </li>
        </ul>
      </div>
    </>
  );
});

const ShoppingCart = () => {
  console.log("ShoppingCart render!");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { cartList, loading } = useSelector(
    (state: RootState) => state.reception
  );
  const [isOrder, setIsOrder] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [code, setCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderForm>({
    defaultValues: {
      name: "",
      email: "",
      tel: "",
      address: "",
      message: "",
    },
  });

  useEffect(() => {
    (async () => {
      await dispatch(getClientCart());
    })();
  }, [dispatch]);

  useEffect(() => {
    setDiscountAmount(cartList.reduce((acc, obj) => acc + obj.total, 0));
  }, [cartList]);

  const clearCart = useCallback(async () => {
    const { message, success } = await dispatch(delAllCart()).unwrap();
    await dispatch(getClientCart());
    dispatch(openMessage({ success, message }));
  }, [dispatch]);

  useEffect(() => {
    if (isPaid) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            router.push("foreStage");
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPaid, router]);

  const editCart = useCallback(async (id: string, product_id: string, qty: number) => {
    await dispatch(updateCartItem({ id, product_id, qty }));
    await dispatch(getClientCart());
  }, [dispatch]);

  const removeGoods = useCallback(async (id: string) => {
    const { message, success } = await dispatch(delGoods(id)).unwrap();
    await dispatch(getClientCart());
    dispatch(openMessage({ success, message }));
  }, [dispatch]);

  const handleCodeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCode(e.target.value);
  }, []);

  const useCoupon = useCallback(async (e: React.MouseEvent) => {
    if (e) e.preventDefault();
      const {data, success, message} = await dispatch(getProductCoupon(code)).unwrap();
      dispatch(openMessage({ success: true, message }));
      console.log(data);
      

      if (success) {
        setDiscountAmount(Math.ceil(data.final_total));
      }
    
  }, [dispatch, code]);

  const onSubmit = handleSubmit(async (order: OrderForm) => {
    const { message, success } = await dispatch(orderCart(order)).unwrap();
    if (!success) return;

    reset();
    dispatch(openMessage({ success, message }));
    await dispatch(getClientCart());
    setIsPaid(true);
  });

  if (loading) {
    return (
      <div className="loading">
        <i className="bx bx-loader bx-spin bx-lg"></i>
      </div>
    );
  }

  if (isPaid) {
    return (
      <>
        <div className={cartStyle.paid_box}>
          <span>付款成功，該筆訂單已成立</span>
          <span>系統將於{countdown}秒後返回首頁</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={cartStyle.cart_box}>
        {isOrder ? (
          <CartOrder 
            cartList={cartList}
            setIsOrder={setIsOrder}
            onSubmit={onSubmit}
            errors={errors}
            register={register}
            code={code}
            handleCodeChange={handleCodeChange}
            useCoupon={useCoupon}
            discountAmount={discountAmount}
          />
        ) : (
          <CartTable 
            cartList={cartList}
            editCart={editCart}
            removeGoods={removeGoods}
            clearCart={clearCart}
            router={router}
            setIsOrder={setIsOrder}
          />
        )}
      </div>
    </>
  );
};

export default ShoppingCart;