import { API_URL } from "../app/(home)/page";

async function getMovie(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  throw new Error("Something went wrong!");
  // const response = await fetch(`${API_URL}/${id}`);
  // return await response.json();
}
export default async function MovieInfo({ id }: { id: string }) {
  const movie = await getMovie(id);
  return <h1>{movie.title}</h1>;
}
