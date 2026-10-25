import { getMovies } from "@/apis/api";
import Movie from "@/components/movie";
import MovieStatus from "@/components/movie-status";
import styles from "@/styles/home.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Home" };

export default async function HomePage() {
  const result = await getMovies();
  if (result.ok === false) return <MovieStatus subject="Movies" retryHref="/" />;
  if (!result.data.length) return <MovieStatus subject="movies" retryHref="/" empty />;
  return (
    <div className={styles.container}>
      {result.data.map((movie) => <Movie key={movie.id} {...movie} />)}
    </div>
  );
}
