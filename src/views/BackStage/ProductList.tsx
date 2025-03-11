import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Pagination from "@/components/Tools/Pagination";
import MessageModal from "@/components/Modals/MessageModal";

import { AppDispatch, RootState } from "../../stores/store";
import { checkLoginStatus } from "../../stores/userStore";
import { deleteProduct, getProducts } from "../../stores/productStore";
import { openMessage } from "@/stores/messageStore";
import type { Product } from "@/typings";
import { useRouter } from "@/router/useRouterManger";

import productStyle from '@/styles/BackStage/ProductList.module.scss'
import btnStyle from '@/styles/btn.module.scss'

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { products, loading, error, pagination } = useSelector((state: RootState) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteProduct = async (data: Product) => {
    if(!data.id) return 
    setProductToDelete(data.id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const { success, message } = await dispatch(deleteProduct(productToDelete)).unwrap();
      if (success) {
        dispatch(openMessage({
          success,
          message
        }));
        await dispatch(getProducts(1));
      }
    } catch (err) {
      console.error("刪除產品時發生錯誤:", err);
      dispatch(openMessage({
        success: false,
        message: "刪除產品時發生錯誤"
      }));
    } finally {
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };


  // 處理換頁
  const handlePageChange = async(page: number) => {
    setCurrentPage(page);
    await dispatch(getProducts(page)); 
  };

  const pushToEdit = (product: Product) => {
    console.log(product);
    
    router.push("productForm", { id: product.id });
  };

  useEffect(() => {
    (async() => {
      const msg = await dispatch(checkLoginStatus()).unwrap()

      if(!msg) {
        dispatch(openMessage({
          success: false,
          message: "未登入"
        }));
        return
      }

      await dispatch(getProducts(1));
    })()
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className={productStyle.loading}><i className="bx bx-loader bx-spin bx-lg"></i></div>;
  }

  if (error) {
    return <div className={productStyle.error}>載入失敗: {error}</div>;
  }

  return (
    <div className={productStyle.list_box}>
      <div className={productStyle.header}>
        <h2>產品列表</h2>
        <button 
          className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
          onClick={() => router.push("productForm", { id:'create' })}
        >
          新增產品
        </button>
      </div>

      <div className={productStyle.table_box}>
        <table>
          <thead>
            <tr>
              <th>產品名稱</th>
              <th>原價</th>
              <th>售價</th>
              <th>是否啟用</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td className={productStyle.price}>
                  ${product.origin_price.toLocaleString()}
                </td>
                <td className={productStyle.price}>
                  ${product.price.toLocaleString()}
                </td>
                <td>
                  <span className={`${productStyle.status} ${
                    product.is_enabled ? productStyle.statusEnabled : productStyle.statusDisabled
                  }`}>
                    {product.is_enabled ? "啟用" : "停用"}
                  </span>
                </td>
                <td>
                  <div className={productStyle.actions}>
                    <button 
                      className={`${btnStyle.btn} ${btnStyle.btnWarning}`}
                      onClick={() => pushToEdit(product)}
                    >
                      查看細節
                    </button>
                    <button 
                      className={`${btnStyle.btn} ${btnStyle.btnDanger}`}
                      onClick={() => handleDeleteProduct(product)}
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

      <MessageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="確認刪除"
        message='確定要刪除此產品嗎？'
      />
    </div>
  );
};

export default ProductList