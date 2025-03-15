import { useEffect, useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../stores/store";
import {
  getProduct,
  editProduct,
  uploadProduct,
  uploadImg,
} from "../../stores/productStore";
import { openMessage } from "@/stores/messageStore";
import type { Product } from "@/typings";
import { useRouter } from "@/router/useRouterManger";

import FormStyle from "@/styles/BackStage/ProductForm.module.scss";
import btnStyle from '@/styles/btn.module.scss'

const ProductForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.routerParams;

  const initialProductData: Product = {
    category: "",
    content: "",
    description: "",
    is_enabled: 1,
    origin_price: 0,
    price: 0,
    title: "",
    unit: "",
    imageUrl: "",
    imagesUrl: [""],
    saveYear: 0,
  };

  const [productData, setProductData] = useState<Product>(initialProductData);

  useEffect(() => {
    (async () => {
      if (!id || id === "create") return;
      const data = await dispatch(getProduct(id)).unwrap();
      setProductData((prev) => ({
        ...prev,
        ...data,
      }));
    })();
  }, [id, dispatch]);

  const handleInput = (name: string, value: string | number) => {
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesUrl = (index: number, value: string) => {
    const newImagesUrl = [...productData.imagesUrl];
    newImagesUrl[index] = value;
    setProductData((prev) => ({
      ...prev,
      imagesUrl: newImagesUrl,
    }));
  };

  const addImageUrl = () => {
    setProductData((prev) => ({
      ...prev,
      imagesUrl: [...prev.imagesUrl, ""],
    }));
  };

  const removeImageUrl = (indexToRemove: number) => {
    setProductData((prev) => ({
      ...prev,
      imagesUrl: prev.imagesUrl.filter((_, index) => index !== indexToRemove),
    }));
  };

  const saveProduct = async () => {
    if (!id || id === "create") {
      await addProduct();
      return;
    }
    const obj = { id: id, data: productData };
    const { success, message } = await dispatch(editProduct(obj)).unwrap();

    dispatch(
      openMessage({
        success,
        message,
      })
    );
  };

  const addProduct = async () => {
    try {
      const { success, message } = await dispatch(
        uploadProduct(productData)
      ).unwrap();

      dispatch(
        openMessage({
          success,
          message,
        })
      );

      if (success) setProductData(initialProductData);
    } catch (error: any) {
      console.log(error);
      dispatch(
        openMessage({
          success: false,
          message: error.message,
        })
      );
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      const img = await dispatch(uploadImg(file)).unwrap();
      if (img && img.imageUrl) {
        dispatch(openMessage({ success: true, message: '上傳成功' }));
        setProductData((prev) => ({
          ...prev,
          imageUrl: img.imageUrl,
        }));
      } else {
        throw new Error('Upload failed - no image URL received');
      }
    } catch (error) {
      console.log(error);
      
      dispatch(openMessage({ success: false, message: '上傳失敗' }));
    }
  };

  return (
    <div className={FormStyle.form_box}>
      <div className={FormStyle.form_header}>
        <h2>產品編輯</h2>
        <button
          className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
          onClick={() =>
            router.push("productList")
          }
        >
          返回列表
        </button>
      </div>
      <div className={FormStyle.form_body}>
        <div className={FormStyle.form_row}>
          <div className={FormStyle.input_item}>
            <label htmlFor="product_title">商品名稱</label>
            <input
              type="text"
              id="product_title"
              value={productData.title}
              onChange={(e) => handleInput("title", e.target.value)}
            />
          </div>
          <div className={FormStyle.input_item}>
            <label htmlFor="product_category">商品種類</label>
            <input
              type="text"
              id="product_category"
              value={productData.category}
              onChange={(e) => handleInput("category", e.target.value)}
            />
          </div>
        </div>

        <div className={FormStyle.input_item}>
          <label htmlFor="product_content">商品內容</label>
          <input
            type="text"
            id="product_content"
            value={productData.content}
            onChange={(e) => handleInput("content", e.target.value)}
          />
        </div>

        <div className={FormStyle.form_row}>
          <div className={FormStyle.input_item}>
            <label htmlFor="product_origin_price">商品原價</label>
            <input
              type="number"
              id="product_origin_price"
              min={0}
              value={productData.origin_price}
              onChange={(e) =>
                handleInput("origin_price", Number(e.target.value))
              }
            />
          </div>
          <div className={FormStyle.input_item}>
            <label htmlFor="product_price">商品優惠價</label>
            <input
              type="number"
              id="product_price"
              min={0}
              value={productData.price}
              onChange={(e) => handleInput("price", Number(e.target.value))}
            />
          </div>
          <div className={FormStyle.input_item}>
            <label htmlFor="product_unit">商品單位</label>
            <input
              type="text"
              id="product_unit"
              value={productData.unit}
              onChange={(e) => handleInput("unit", e.target.value)}
            />
          </div>
          <div className={FormStyle.input_item}>
            <label htmlFor="product_saveYear">保存年分</label>
            <input
              type="number"
              id="product_saveYear"
              min={0}
              value={productData.saveYear}
              onChange={(e) => handleInput("saveYear", e.target.value)}
            />
          </div>
        </div>

        <div className={FormStyle.input_item}>
          <label htmlFor="product_description">商品描述</label>
          <textarea
            value={productData.description}
            id="product_description"
            onChange={(e) => handleInput("description", e.target.value)}
          />
        </div>

        <div className={FormStyle.input_check}>
          <label htmlFor="product_check">是否啟用</label>
          <input
            type="checkbox"
            id="product_check"
            checked={productData.is_enabled === 1}
            onChange={(e) =>
              handleInput("is_enabled", e.target.checked ? 1 : 0)
            }
          />
        </div>

        <div className={FormStyle.input_item}>
          <label htmlFor="fileInput" className="form-label">
            {" "}
            圖片上傳{" "}
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="form-control"
            id="fileInput"
            onChange={handleFileUpload}
          />
        </div>

        <div className={FormStyle.input_item}>
          <label htmlFor="product_imageUrl">主要圖片網址</label>
          <input
            type="text"
            id="product_imageUrl"
            value={productData.imageUrl}
            onChange={(e) => handleInput("imageUrl", e.target.value)}
          />
        </div>

        <div className={FormStyle.moreImgs}>
          <label>更多圖片網址</label>
          {productData.imagesUrl.map((url, index) => (
            <div key={index}>
              <input
                type="text"
                value={url}
                onChange={(e) => handleImagesUrl(index, e.target.value)}
              />
              <button
                onClick={() => removeImageUrl(index)}
                className={`${btnStyle.btn} ${btnStyle.btnDanger}`}
                type="button"
              >
                移除
              </button>
            </div>
          ))}
          <button onClick={addImageUrl} className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}>
            新增圖片網址
          </button>
        </div>

        {productData.imageUrl && (
          <div className={FormStyle.preview_box}>
            <h3>預覽主要圖片</h3>
            <div className={FormStyle.mainImg}>
              <img src={productData.imageUrl} alt={productData.title} />
            </div>
          </div>
        )}

        {productData.imagesUrl.some((url) => url) && (
          <div className={FormStyle.preview_box}>
            <h3>預覽更多圖片</h3>
            <div className={FormStyle.otherImg}>
              {productData.imagesUrl.map(
                (url, idx) =>
                  url && (
                    <div key={idx} className={FormStyle.img_item}>
                      <img src={url} alt={`image ${idx + 1}`} />
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>

      <div className={FormStyle.btn_row}>
        <button className={`${btnStyle.btn} ${btnStyle.btnPrimary}`} onClick={saveProduct}>
          儲存
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
