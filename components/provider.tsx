import styles from "@/styles/provider.module.css";
import { IProvider } from "app/movies/[id]/providers/page";

interface ProviderProps extends IProvider {
  key: number;
}

export default function Provider(provider: ProviderProps) {
  return (
    <div key={provider.provider_id} className={styles.provider}>
      <img src={provider.logo_path} alt={provider.provider_name} />
      <p>{provider.provider_name}</p>
    </div>
  );
}
