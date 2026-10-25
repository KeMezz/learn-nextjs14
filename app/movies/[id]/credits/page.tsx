import { getCredits } from "@/apis/api";
import Credit from "@/components/credit";
import MovieStatus from "@/components/movie-status";
import styles from "@/styles/credits.module.css";

export default async function CreditsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCredits(id);
  if (result.ok === false) return <MovieStatus subject="Credits" retryHref={`/movies/${id}/credits`} />;
  if (!result.data.length) return <MovieStatus subject="credits" retryHref={`/movies/${id}/credits`} empty />;
  return <section className={styles.container}>{result.data.map((credit) => <Credit key={credit.id} {...credit} />)}</section>;
}
