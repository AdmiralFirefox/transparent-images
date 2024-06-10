import styles from "@/styles/header.module.scss";

const Header = () => {
  return (
    <header className={styles["header"]}>
      <nav>
        <h1>Transparent Images</h1>
        <button>Sample Images</button>
      </nav>
    </header>
  );
};

export default Header;
