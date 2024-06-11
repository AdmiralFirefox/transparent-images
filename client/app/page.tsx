"use client";

import { useState, useEffect } from "react";
import { ModalContext } from "@/context/ModalContext";
import { useMutation } from "@tanstack/react-query";
import { useScrollLock } from "@/hooks/useScrollLock";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import Axios from "axios";
import Image from "next/image";
import Header from "./components/Header";
import Loading from "./components/Loading";
import Error from "./components/Error";
import styles from "@/styles/page.module.scss";

interface InputProps {
  transparent_image: string;
  download_url: string;
}

const backendUrl = "http://localhost:8000";

// Send image to the server
const sendImage = async (inputImage: File) => {
  const formData = new FormData();
  formData.append("imageFile", inputImage);

  const response = await Axios.post(`${backendUrl}/api/remove-bg`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export default function Home() {
  const [inputMode, setInputMode] = useState(true);
  const [downloadImage, setDownloadImage] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState(false);
  const { dragOver, setDragOver, onDragOver, onDragLeave } = useDragAndDrop();
  const { lock, unlock } = useScrollLock({
    autoLock: false,
    lockTarget: "#scrollable",
  });

  // Use the useMutation hook
  const mutation = useMutation<InputProps, Error, File>({
    mutationFn: sendImage,
  });

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    setDragOver(false);

    const imageFile = e?.dataTransfer?.files[0];

    if (imageFile) {
      mutation.mutate(imageFile);
      setInputMode(false);
    }
  };

  const fileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];

    if (imageFile) {
      mutation.mutate(imageFile);
      setInputMode(false);
    }
  };

  const resetInputs = () => {
    mutation.reset();
    setInputMode(true);
  };

  const openImageModal = () => {
    setImageModal(true);
    lock();
  };

  const closeImageModal = () => {
    setImageModal(false);
    unlock();
  };

  const setImage = async (imagePath: string) => {
    if (imagePath) {
      const response = await fetch(imagePath);
      const blob = await response.blob();

      // Extract the filename from the imagePath
      const filename = imagePath.split("/").pop();
      const imageFile = new File([blob], filename as string, {
        type: blob.type,
      });

      mutation.mutate(imageFile);
      setInputMode(false);
      setImageModal(false);
      unlock();
    }
  };

  const ModalFunction = {
    imageModal,
    openImageModal,
    closeImageModal,
    setImage,
  };

  useEffect(() => {
    if (mutation.isSuccess && mutation.data?.download_url) {
      setDownloadImage(mutation.data.download_url);
    }
  }, [mutation.isSuccess, mutation.data]);

  return (
    <>
      <ModalContext.Provider value={ModalFunction}>
        <Header />
      </ModalContext.Provider>

      <main>
        <div className={styles["website-title"]}>
          <h1>Remove background images and make it transparent easily!</h1>
        </div>

        {inputMode ? (
          <div className={styles["container"]}>
            <form>
              <label
                htmlFor="file"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <h1>
                  {!dragOver
                    ? "Drag and drop an image here or click to upload"
                    : "Drop here..."}
                </h1>
              </label>
              <input
                type="file"
                name="file"
                id="file"
                accept="image/*"
                onChange={fileSelect}
              />
            </form>
          </div>
        ) : null}

        {inputMode ? null : (
          <div className={styles["button-wrapper"]}>
            <button onClick={resetInputs}>Choose another image</button>
          </div>
        )}

        {inputMode ? null : (
          <>
            {mutation.isPending && <Loading />}
            {mutation.isError && <Error />}
            {mutation.isSuccess && mutation.data !== undefined ? (
              <div className={styles["output"]}>
                <div className={styles["image-wrapper"]}>
                  <Image
                    src={`${backendUrl}/api/transparent-image/${mutation.data.transparent_image}`}
                    alt=""
                    width={300}
                    height={300}
                  />
                </div>
                {downloadImage && (
                  <a
                    href={`${backendUrl}/${downloadImage}`}
                    download
                    className={styles["image-download"]}
                  >
                    Click here to download
                  </a>
                )}
              </div>
            ) : null}
          </>
        )}
      </main>
    </>
  );
}
