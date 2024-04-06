import styles from "@/styles/loading.module.css";

export default function LoadingPage() {
  return (
    <section className={styles.container}>
      <div className={styles.loader}></div>
    </section>
  );
}
