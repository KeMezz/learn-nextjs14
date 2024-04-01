export const metadata = {
  title: "Home",
};

const URL = "https://nomad-movies.nomadcoders.workers.dev/movies";

async function getMovies() {
  return await fetch(URL).then((res) => res.json());
}

export default async function HomePage() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const movies = await getMovies();
  return <div>{JSON.stringify(movies)}</div>;
}
