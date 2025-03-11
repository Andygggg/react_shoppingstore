import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { AppDispatch, RootState } from "../../stores/store";
import {
  getClientCart,
  delAllCart,
  updateCartItem,
  delGoods,
  orderCart,
} from "@/stores/receptionStore";
import { openMessage } from "@/stores/messageStore";
import { useRouter } from "@/router/useRouterManger";

import cartStyle from "@/styles/ForeStage/ShoppingCart.module.scss";
import btnStyle from "@/styles/btn.module.scss";

const ShoppingCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { cartList } = useSelector((state: RootState) => state.reception);
  const [isOrder, setIsOrder] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
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

  // console.log(cartList);

  const clearCart = async () => {
    const { message, success } = await dispatch(delAllCart()).unwrap();
    await dispatch(getClientCart());

    dispatch(
      openMessage({
        success,
        message,
      })
    );
  };

  const editCart = async (id: string, product_id: string, qty: number) => {
    await dispatch(updateCartItem({ id, product_id, qty }));
    await dispatch(getClientCart());
  };

  const removeGoods = async (id: string) => {
    const { message, success } = await dispatch(delGoods(id)).unwrap();
    await dispatch(getClientCart());

    dispatch(
      openMessage({
        success,
        message,
      })
    );
  };

  const onSubmit = async (order: any) => {
    const { message, success } = await dispatch(orderCart(order)).unwrap();
    reset();

    dispatch(
      openMessage({
        success,
        message,
      })
    );
    await dispatch(getClientCart());

    router.push("foreStage");
  };

  const CartTable = () => {
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
          >
            前往結帳
          </button>
        </div>
      </>
    );
  };

  const CartOrder = () => {
    return (
      <>
        <form className={cartStyle.cart_form} onSubmit={handleSubmit(onSubmit)}>
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
            <li>
              <span>總計</span>
              <span>$ {cartList.reduce((acc, obj) => acc + obj.total, 0)}</span>
            </li>
          </ul>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={cartStyle.cart_box}>
        {isOrder ? <CartOrder></CartOrder> : <CartTable></CartTable>}
      </div>
    </>
  );
};

export default ShoppingCart;
