import { useContext } from "react";
import { ModalContext } from "@/context/ModalContext";
import ImageModal from "./ImageModal";
import styles from "@/styles/header.module.scss";

const Header = () => {
  const { openImageModal } = useContext(ModalContext);

  return (
    <>
      <header className={styles["header"]}>
        <nav>
          <h1>Transparent Images</h1>
          <button onClick={openImageModal}>Sample Images</button>
        </nav>
      </header>

      <ImageModal />
    </>
  );
};

export default Header;
