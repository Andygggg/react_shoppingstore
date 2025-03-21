import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";

import { useRouter } from "@/router/useRouterManger";
import { AppDispatch } from "../../stores/store";
import { loginUser, checkLoginStatus } from "../../stores/userStore";
import { openMessage } from "@/stores/messageStore";

import loginStyle from "@/styles/Modal/Modal.module.scss";
import btnStyle from "@/styles/btn.module.scss";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [user, setUser] = useState({ username: "", password: "" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { message, success } = await dispatch(loginUser(user)).unwrap();
      dispatch(openMessage({ success, message }));

      if (success) await checkUserToken();
    } catch (error) {
      dispatch(openMessage({ success: false, message: "登入失敗" }));
      console.error("登入失敗:", error);
    }
  };

  const checkUserToken = async () => {
    const { success } = await dispatch(checkLoginStatus()).unwrap();

    dispatch(
      openMessage({
        success: success,
        message: success ? "登入驗證成功" : "登入驗證失敗",
      })
    );
    if (success) {
      router.push("admin");
    }
  };

  const handleInput = (name: string, value: string) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className={loginStyle.login_modal}>
      {/* 黑色遮罩層 */}
      <div className={loginStyle.backdrop} onClick={onClose}></div>

      {/* 登入Modal */}
      <div className={loginStyle.modal_content}>
        <div className={loginStyle.modal_header}>
          <span>管理員登入</span>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={loginStyle.form_item}>
            <label htmlFor="username">帳號</label>
            <input
              id="username"
              type="text"
              value={user.username}
              onChange={(e) => handleInput("username", e.target.value)}
              placeholder="請輸入用戶名"
              required
            />
          </div>

          <div className={loginStyle.form_item}>
            <label htmlFor="password">密碼</label>
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => handleInput("password", e.target.value)}
              placeholder="請輸入密碼"
              required
            />
          </div>

          <div className={loginStyle.btn_item}>
            <button
              type="submit"
              className={`${btnStyle.btn} ${btnStyle.btnDark}`}
            >
              登入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
