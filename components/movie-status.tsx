export default function MovieStatus({
  subject,
  retryHref,
  empty = false,
}: {
  subject: string;
  retryHref: string;
  empty?: boolean;
}) {
  return (
    <section role="status" style={{ maxWidth: 640, margin: "32px auto", padding: 24, lineHeight: 1.5 }}>
      <h1>{empty ? `No ${subject} found.` : `${subject} temporarily unavailable.`}</h1>
      <p>{empty ? "The movie service returned no results." : "The movie service could not be reached or returned an invalid response. Please try again."}</p>
      <a href={retryHref}>Try again</a>
    </section>
  );
}
