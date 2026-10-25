import styles from "@/styles/provider.module.css";
import type { ProviderData } from "@/apis/api";

export default function Provider(provider: ProviderData) {
  return (
    <div key={provider.provider_id} className={styles.provider}>
      {provider.logo_path ? <img src={provider.logo_path} alt={provider.provider_name} /> : null}
      <p>{provider.provider_name}</p>
    </div>
  );
}
