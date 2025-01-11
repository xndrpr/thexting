import styles from "./styles.module.sass";

export default function Error404() {
  return (
    <div className={styles.Error404}>
      <h1>Error 404</h1>
      <hr />
      <h2>Page not found</h2>
    </div>
  );
}
