import { Suspense } from "react";
import MovieInfo from "@/components/movie-info";
import MovieVideos from "@/components/movie-videos";
import { getMovie } from "@/apis/api";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const result = await getMovie(id);
  return {
    title: result.ok ? result.data.title : "Movie unavailable",
  };
}

export default async function MovieDetail({ params }: Params) {
  const { id } = await params;
  return (
    <div>
      <Suspense fallback={<h1>Loading movie info</h1>}>
        <MovieInfo id={id} />
      </Suspense>
      <Suspense fallback={<h1>Loading movie videos</h1>}>
        <MovieVideos id={id} />
      </Suspense>
    </div>
  );
}
