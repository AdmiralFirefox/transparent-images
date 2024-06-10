import ErrorIcon from "./ErrorIcon";
import styles from "@/styles/Error.module.scss";

const Error = () => {
  return (
    <div className={styles["wrapper"]}>
      <div className={styles["content"]}>
        <ErrorIcon width="4.3em" height="4.3em" />
        <h1>Something went wrong. Make sure your image format is supported. If anything else, try again later.</h1>
      </div>
    </div>
  );
};

export default Error;
