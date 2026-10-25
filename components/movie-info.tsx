import { getMovie, getProviders, getSimilarMovies } from "@/apis/api";
import MovieStatus from "./movie-status";
import styles from "@/styles/movie-info.module.css";
import Link from "next/link";

export default async function MovieInfo({ id }: { id: string }) {
  const [result, similarMovies, providers] = await Promise.all([
    getMovie(id), getSimilarMovies(id), getProviders(id),
  ]);
  if (result.ok === false) return <MovieStatus subject="Movie details" retryHref={`/movies/${id}`} />;
  const movie = result.data;
  return (
    <div className={styles.container}>
      {movie.poster_path ? <img className={styles.poster} src={movie.poster_path} alt={movie.title} /> : null}
      <div className={styles.info}>
        <h1 className={styles.title}>{movie.title}</h1>
        <h3>⭐ ️{movie.vote_average.toFixed(1)}</h3>
        <p>{movie.overview}</p>
        {movie.homepage ? <a href={movie.homepage} target="_blank" rel="noreferrer">🔗 Homepage &rarr;</a> : null}
        <Link prefetch href={`/movies/${id}/credits`}>😎 Credits &rarr;</Link>
        {providers.ok === false || providers.data.US ? (
          <Link prefetch href={`/movies/${id}/providers`}>🏢 Providers &rarr;</Link>
        ) : null}
        {similarMovies.ok === false || similarMovies.data.length ? (
          <Link prefetch href={`/movies/${id}/similar`}>🎬 Similar Movies &rarr;</Link>
        ) : null}
      </div>
    </div>
  );
}
