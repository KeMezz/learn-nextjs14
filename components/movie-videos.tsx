import { getVideos } from "apis/api";
import MovieStatus from "./movie-status";
import styles from "@/styles/movie-videos.module.css";

export default async function MovieVideos({ id }: { id: string }) {
  const result = await getVideos(id);
  if (result.ok === false) return <MovieStatus subject="Movie videos" retryHref={`/movies/${id}`} />;
  if (!result.data.length) return <MovieStatus subject="videos" retryHref={`/movies/${id}`} empty />;
  return (
    <div className={styles.container}>
      {result.data.map((video) => (
        <iframe key={video.key} src={`https://www.youtube.com/embed/${encodeURIComponent(video.key)}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen title={video.name} />
      ))}
    </div>
  );
}
