import { getCredits } from "@/apis/api";
import Credit, { CreditProps } from "@/components/credit";
import styles from "@/styles/credits.module.css";

export default async function CreditsPage({ params: { id } }) {
  const credits = await getCredits(id);
  return (
    <section className={styles.container}>
      {credits.map((credit: CreditProps, index: number) => (
        <Credit key={index} {...credit} />
      ))}
    </section>
  );
}
