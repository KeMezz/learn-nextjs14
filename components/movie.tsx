"use client";

import Link from "next/link";
import styles from "@/styles/movie.module.css";
import { useRouter } from "next/navigation";

import type { MovieSummary } from "@/apis/api";

export default function Movie({ poster_path, title, id }: MovieSummary) {
  const router = useRouter();
  const navigateToMovieDetail = () => {
    router.push(`/movies/${id}`);
  };
  return (
    <div className={styles.movie}>
      {poster_path ? <img src={poster_path} alt={title} onClick={navigateToMovieDetail} /> : null}
      <Link prefetch href={`/movies/${id}`}>
        {title}
      </Link>
    </div>
  );
}
