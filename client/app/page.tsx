"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import Axios from "axios";
import Image from "next/image";
import styles from "@/styles/page.module.scss";

interface InputProps {
  uploaded_image: string;
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
  const [file, setFile] = useState<File>();
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
      setFile(imageFile);
    }
  };

  const fileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];

    if (imageFile) {
      mutation.mutate(imageFile);
      setFile(imageFile);
    }
  };

  return (
    <main>
      <div className={styles["container"]}>
        <form>
          <label
            htmlFor="file"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {file && <h1>{file.name}</h1>}
            {!file && (
              <h1 style={{ color: `${dragOver ? " yellowgreen" : ""}` }}>
                {!dragOver
                  ? "Drag Images or Click here to upload"
                  : "Drop here..."}
              </h1>
            )}
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

      {mutation.isPending && <p>Loading...</p>}
      {mutation.isError && <p>An error occurred.</p>}
      {mutation.isSuccess && (
        <div>
          <Image
            src={`${backendUrl}/api/get-image/${mutation.data.uploaded_image}`}
            alt=""
            width={300}
            height={300}
          />
        </div>
      )}
    </main>
  );
}
