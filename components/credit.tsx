import styles from "@/styles/credit.module.css";

import type { CreditData } from "@/apis/api";

export default function Credit(credit: CreditData) {
  return (
    <div className={styles.container}>
      {credit.profile_path ? <img src={credit.profile_path} alt={credit.name} /> : null}
      <div className={styles.desc}>
        <h3>{credit.name}</h3>
        <h5>{credit.character}</h5>
        <p>{credit.known_for_department}</p>
      </div>
    </div>
  );
}
