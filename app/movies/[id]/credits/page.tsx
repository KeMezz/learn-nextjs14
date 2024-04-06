import { API_URL } from "../../../(home)/page";
import Credit, { CreditProps } from "../../../../components/credit";
import styles from "@/styles/credits.module.css";

async function getCredits(id: string) {
  const response = await fetch(`${API_URL}/${id}/credits`);
  return await response.json();
}

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
