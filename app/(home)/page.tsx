import Link from "next/link";

export const metadata = {
  title: "Home",
};

export const API_URL = "https://nomad-movies.nomadcoders.workers.dev/movies";

async function getMovies() {
  return await fetch(API_URL).then((res) => res.json());
}

export default async function HomePage() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const movies = await getMovies();
  return (
    <div>
      {movies.map((movie) => (
        <li>
          <Link href={`/movies/${movie.id}`} key={movie.id}>
            {movie.title}
          </Link>
        </li>
      ))}
    </div>
  );
}
