import styles from "@/styles/credit.module.css";

export interface CreditProps {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export default function Credit(credit: CreditProps) {
  return (
    <div className={styles.container}>
      <img src={credit.profile_path} alt={credit.name} />
      <div className={styles.desc}>
        <h3>{credit.name}</h3>
        <h5>{credit.character}</h5>
        <p>{credit.known_for_department}</p>
      </div>
    </div>
  );
}
