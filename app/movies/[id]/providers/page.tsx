import { getProviders } from "@/apis/api";
import Provider from "@/components/provider";
import styles from "@/styles/providers.module.css";

export interface IProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export default async function ProvidersPage({ params: { id } }) {
  const providers = await getProviders(id);
  const usProviders = providers["US"];
  if (!usProviders)
    return <div className={styles.container}>No Providers Found.</div>;

  console.log(usProviders);
  return (
    <div className={styles.container}>
      {usProviders?.rent ? (
        <>
          <h2>Rent</h2>
          <div className={styles.providers}>
            {usProviders.rent.map((provider: IProvider) => (
              <Provider key={provider.provider_id} {...provider} />
            ))}
          </div>
        </>
      ) : null}
      {usProviders?.buy ? (
        <>
          <h2>Buy</h2>
          <div className={styles.providers}>
            {usProviders.buy.map((provider: IProvider) => (
              <Provider key={provider.provider_id} {...provider} />
            ))}
          </div>
        </>
      ) : null}
      {usProviders?.flatrate ? (
        <>
          <h2>Buy</h2>
          <div className={styles.providers}>
            {usProviders.flatrate.map((provider: IProvider) => (
              <Provider key={provider.provider_id} {...provider} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
