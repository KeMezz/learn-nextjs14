import { cache as reactCache } from "react";

export const API_URL = "https://nomad-movies.nomadcoders.workers.dev/movies";

export interface MovieSummary {
  id: number;
  title: string;
  poster_path?: string | null;
}
export interface MovieDetails extends MovieSummary {
  vote_average: number;
  overview?: string | null;
  homepage?: string | null;
}
export interface CreditData {
  id: number;
  name: string;
  character: string;
  known_for_department: string;
  profile_path?: string | null;
}
export interface ProviderData {
  provider_id: number;
  provider_name: string;
  logo_path?: string | null;
}
export interface VideoData {
  key: string;
  name: string;
}
export type ProviderRegion = Partial<Record<"rent" | "buy" | "flatrate", ProviderData[]>>;
export type Providers = Record<string, ProviderRegion>;
export type ApiResult<T> = { ok: true; data: T } | { ok: false };

type Validator<T> = (value: unknown) => value is T;
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === "string";
const optionalText = (value: unknown) => value == null || text(value);
const number = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const list = <T>(validate: Validator<T>): Validator<T[]> =>
  (value): value is T[] => Array.isArray(value) && value.every(validate);
const movie: Validator<MovieSummary> = (value): value is MovieSummary =>
  record(value) && number(value.id) && text(value.title) && optionalText(value.poster_path);
const details: Validator<MovieDetails> = (value): value is MovieDetails =>
  movie(value) && record(value) && number(value.vote_average) &&
  optionalText(value.overview) && optionalText(value.homepage);
const credit: Validator<CreditData> = (value): value is CreditData =>
  record(value) && number(value.id) && text(value.name) && text(value.character) &&
  text(value.known_for_department) && optionalText(value.profile_path);
const provider: Validator<ProviderData> = (value): value is ProviderData =>
  record(value) && number(value.provider_id) && text(value.provider_name) && optionalText(value.logo_path);
const providers: Validator<Providers> = (value): value is Providers =>
  record(value) && Object.values(value).every((region) =>
    record(region) && ["rent", "buy", "flatrate"].every((key) =>
      region[key] === undefined || list(provider)(region[key])));
const video: Validator<VideoData> = (value): value is VideoData =>
  record(value) && text(value.key) && text(value.name);

async function request<T>(path: string, validate: Validator<T>): Promise<ApiResult<T>> {
  try {
    // Request-time reads allow the next page load to recover immediately. In
    // particular, HTML/error responses must never enter the persistent data cache.
    const response = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
    if (contentType !== "application/json" && !contentType?.endsWith("+json")) {
      throw new Error("Non-JSON response");
    }
    const data: unknown = await response.json();
    if (!validate(data)) throw new Error("Unexpected response shape");
    return { ok: true, data };
  } catch (error) {
    console.warn("Movie API unavailable:", error instanceof Error ? error.message : "Request failed");
    return { ok: false };
  }
}

// React cache provides per-request / per-render memoization across components
// (e.g. generateMetadata and MovieInfo) without retaining stale data across requests.
// When running outside React server component renderers (such as unit test runners),
// fallback gracefully to an unmemoized identity function.
const cache =
  typeof reactCache === "function"
    ? reactCache
    : <T extends (...args: any[]) => any>(fn: T): T => fn;

const segment = (id: string) => encodeURIComponent(id);
export const getMovies = cache(() => request("", list(movie)));
export const getCredits = cache((id: string) => request(`/${segment(id)}/credits`, list(credit)));
export const getProviders = cache((id: string) => request(`/${segment(id)}/providers`, providers));
export const getSimilarMovies = cache((id: string) => request(`/${segment(id)}/similar`, list(movie)));
export const getMovie = cache((id: string) => request(`/${segment(id)}`, details));
export const getVideos = cache((id: string) => request(`/${segment(id)}/videos`, list(video)));
