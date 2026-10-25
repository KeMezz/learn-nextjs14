import Movie from "@/components/movie";
import MovieStatus from "@/components/movie-status";
import styles from "@/styles/similar.module.css";
import { getMovie, getSimilarMovies } from "@/apis/api";

export default async function SimilarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [movie, result] = await Promise.all([getMovie(id), getSimilarMovies(id)]);
  const retryHref = `/movies/${id}/similar`;
  if (result.ok === false) return <MovieStatus subject="Similar movies" retryHref={retryHref} />;
  if (!result.data.length) return <MovieStatus subject="similar movies" retryHref={retryHref} empty />;
  return (
    <div className={styles.container}>
      <h2>{movie.ok ? `Similar to ${movie.data.title}` : "Similar movies"}</h2>
      <div className={styles.movies}>{result.data.map((movie) => <Movie key={movie.id} {...movie} />)}</div>
    </div>
  );
}
