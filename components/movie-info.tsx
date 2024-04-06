import { getMovie, getProviders, getSimilarMovies } from "@/apis/api";
import styles from "@/styles/movie-info.module.css";
import Link from "next/link";

export default async function MovieInfo({ id }: { id: string }) {
  const movie = await getMovie(id);
  const similarMovies = await getSimilarMovies(id);
  const providers = await getProviders(id);
  return (
    <div className={styles.container}>
      <img
        className={styles.poster}
        src={movie.poster_path}
        alt={movie.title}
      />
      <div className={styles.info}>
        <h1 className={styles.title}>{movie.title}</h1>
        <h3>⭐ ️{movie.vote_average.toFixed(1)}</h3>
        <p>{movie.overview}</p>
        <a href={movie.homepage} target="_blank">
          🔗 Homepage &rarr;
        </a>
        <Link prefetch href={`/movies/${id}/credits`}>
          😎 Credits &rarr;
        </Link>
        {providers["US"] ? (
          <Link prefetch href={`/movies/${id}/providers`}>
            🏢 Providers &rarr;
          </Link>
        ) : null}
        {similarMovies.length ? (
          <Link prefetch href={`/movies/${id}/similar`}>
            🎬 Similar Movies &rarr;
          </Link>
        ) : null}
      </div>
    </div>
  );
}
