export default function SectionTitle({
  eyebrow,
  title,
  highlight,
  description,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  description?: string;
}) {
  const words = (text: string) =>
    text.split(" ").map((word, i) => (
      <span className="title-word-mask" key={i}>
        <span className="title-word">{word}</span>
      </span>
    ));
  return (
    <div className="section-heading" data-reveal>
      <span className="eyebrow">{eyebrow}</span>
      <h2 aria-label={`${title} ${highlight}`}>
        <span className="title-line" aria-hidden="true">
          {words(title)}
        </span>
        <span className="title-line title-highlight" aria-hidden="true">
          {words(highlight)}
        </span>
      </h2>
      {description && <p className="description">{description}</p>}
    </div>
  );
}
