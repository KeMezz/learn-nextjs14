"use client";

import Link from "next/link";
import styles from "@/styles/movie.module.css";
import { useRouter } from "next/navigation";

interface MovieProps {
  key: number;
  poster_path: string;
  title: string;
  id: number;
}

export default function Movie({ poster_path, title, id }: MovieProps) {
  const router = useRouter();
  const navigateToMovieDetail = () => {
    router.push(`/movies/${id}`);
  };
  return (
    <div className={styles.movie}>
      <img src={poster_path} alt={title} onClick={navigateToMovieDetail} />
      <Link href={`/movies/${id}`}>{title}</Link>
    </div>
  );
}
