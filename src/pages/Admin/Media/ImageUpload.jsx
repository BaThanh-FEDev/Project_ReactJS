import { PlusOutlined } from "@ant-design/icons";
import { Upload, Image, message } from "antd";
import { useEffect, useState } from "react";
import API from "../../../services/api";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ImageUpload = ({ image, onImageChange, reviceImage }) => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    setFileList(image ? [{ uid: "-1", name: "uploaded-image", status: "done", url: image }] : []);
  }, [image]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    reviceImage(file);

    // try {
    //   const response = await API.callWithToken().post("wp/v2/media", formData);
    //   return response.data?.source_url || null;
    // } catch {
    //   message.error("Tải ảnh lên thất bại!");
    //   return null;
    // }
  };

  const handleChangeUpload = async ({ file, fileList }) => {
    setFileList(fileList);

    if (file.status === "removed") {
      onImageChange(null);
      return;
    }

    if (file) {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        onImageChange(uploadedUrl);
        message.success("Tải ảnh lên thành công!");
      }
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChangeUpload}
        beforeUpload={(file) =>
          ["image/jpeg", "image/png"].includes(file.type) ? false : (message.error("Bạn chỉ có thể tải lên file JPG/PNG!"), Upload.LIST_IGNORE)
        }
        onRemove={() => onImageChange(null)}
      >
        {fileList.length < 1 && (
          <div>
            <PlusOutlined />
            <div>Upload</div>
          </div>
        )}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: setPreviewOpen,
          }}
          src={previewImage}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </>
  );
};

export default ImageUpload;
