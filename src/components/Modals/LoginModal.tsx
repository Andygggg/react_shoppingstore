import { useState, FormEvent, ChangeEvent } from "react";
import loginStyle from "@/styles/Modal/LoginModal.module.scss";
import btnStyle from "@/styles/btn.module.scss";

// 定義 props 的類型
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 使用函數聲明而非 React.FC
const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 這裡處理登入邏輯
    console.log("Login attempt with:", username, password);
    // 登入成功後可以關閉modal
    // onClose();
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 如果 isOpen 為 false，則不渲染任何內容
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
              value={username}
              onChange={handleUsernameChange}
              placeholder="請輸入用戶名"
              required
            />
          </div>

          <div className={loginStyle.form_item}>
            <label htmlFor="password">密碼</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
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
