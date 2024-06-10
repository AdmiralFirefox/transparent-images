"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import Axios from "axios";
import Image from "next/image";
import Header from "./components/Header";
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
  const { dragOver, setDragOver, onDragOver, onDragLeave } = useDragAndDrop();

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

  useEffect(() => {
    if (mutation.isSuccess && mutation.data?.download_url) {
      setDownloadImage(mutation.data.download_url);
    }
  }, [mutation.isSuccess, mutation.data]);

  return (
    <>
      <Header />

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
          <button onClick={resetInputs}>Choose another image</button>
        )}

        {inputMode ? null : (
          <>
            {mutation.isPending && <p>Loading...</p>}
            {mutation.isError && <p>An error occurred.</p>}
            {mutation.isSuccess && mutation.data !== undefined ? (
              <div>
                <Image
                  src={`${backendUrl}/api/transparent-image/${mutation.data.transparent_image}`}
                  alt=""
                  width={300}
                  height={300}
                />
                {downloadImage && (
                  <a href={`${backendUrl}/${downloadImage}`} download>
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
