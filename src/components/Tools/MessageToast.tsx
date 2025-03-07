import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../stores/store";
import { messageSlice } from '../../stores/messageStore'; // 請根據你的專案結構調整路徑
import styles from '../../styles/MessageToast.module.scss';

const MessageToast = () => {
  const messages = useSelector((state: RootState) => state.message);
  const dispatch = useDispatch();

  // 手動關閉消息
  const handleClose = (id: string) => {
    dispatch(messageSlice.actions.removeMessage(id));
  };

  return (
    <div className={styles.toastContainer}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.toast} ${styles[message.type]}`}
          role="alert"
        >
          <div className={styles.toastHeader}>
            <span className={styles.title}>{message.text}</span>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => handleClose(message.id)}
              aria-label="關閉"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageToast;