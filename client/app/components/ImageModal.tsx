import Image from "next/image";
import { useContext } from "react";
import { ModalContext } from "@/context/ModalContext";
import styles from "@/styles/ImageModal.module.scss";

const ImageModal = () => {
  const { imageModal, openImageModal, closeImageModal, setImage } =
    useContext(ModalContext);

  return (
    <div>
      {imageModal ? (
        <div className={styles["modal-backdrop"]} onClick={closeImageModal} />
      ) : null}

      {imageModal ? (
        <div className={styles["modal-content"]}>
          <div className={styles["image-container"]}>
            <div className={styles["image-wrapper"]} onClick={() => setImage("/dolphin.jpg")}>
              <Image src="/dolphin.jpg" alt="" width={300} height={300} />
            </div>
            <div className={styles["image-wrapper"]} onClick={() => setImage("/tiger.jpg")}>
              <Image src="/tiger.jpg" alt="" width={300} height={300} />
            </div>
            <div className={styles["image-wrapper"]} onClick={() => setImage("/elephant.webp")}>
              <Image src="/elephant.webp" alt="" width={300} height={300} />
            </div>
            <div className={styles["image-wrapper"]} onClick={() => setImage("/audi.jpg")}>
              <Image src="/audi.jpg" alt="" width={300} height={300} />
            </div>
          </div>

          <button onClick={closeImageModal}>Close</button>
        </div>
      ) : null}
    </div>
  );
};

export default ImageModal;
