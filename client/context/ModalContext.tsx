import { createContext } from "react";

export const ModalContext = createContext({
  imageModal: false,
  openImageModal: () => {},
  closeImageModal: () => {},
  setImage: (_image: File) => {},
});
