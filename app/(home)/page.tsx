import { getMovies } from "@/apis/api";
import Movie from "@/components/movie";
import styles from "@/styles/home.module.css";

export const metadata = {
  title: "Home",
};

export default async function HomePage() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const movies = await getMovies();
  return (
    <div className={styles.container}>
      {movies.map((movie) => (
        <Movie
          key={movie.id}
          id={movie.id}
          title={movie.title}
          poster_path={movie.poster_path}
        />
      ))}
    </div>
  );
}
