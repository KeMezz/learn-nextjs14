import { getProviders } from "@/apis/api";
import Provider from "@/components/provider";
import MovieStatus from "@/components/movie-status";
import styles from "@/styles/providers.module.css";

export default async function ProvidersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProviders(id);
  const retryHref = `/movies/${id}/providers`;
  if (result.ok === false) return <MovieStatus subject="Providers" retryHref={retryHref} />;
  const usProviders = result.data.US;
  const categories = [["rent", "Rent"], ["buy", "Buy"], ["flatrate", "Stream"]] as const;
  if (!usProviders || !categories.some(([key]) => usProviders[key]?.length)) {
    return <MovieStatus subject="US providers" retryHref={retryHref} empty />;
  }
  return (
    <div className={styles.container}>
      {categories.map(([key, label]) => usProviders[key]?.length ? (
        <section key={key}>
          <h2>{label}</h2>
          <div className={styles.providers}>
            {usProviders[key].map((provider) => <Provider key={provider.provider_id} {...provider} />)}
          </div>
        </section>
      ) : null)}
    </div>
  );
}
