import type { CSSProperties } from "react";

const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀÂÃÉÊÍÓÔÕÚÇ0123456789";
const streams = Array.from({ length: 28 }, (_, column) =>
  Array.from({ length: 48 }, (_, row) => symbols[(column * 17 + row * 11 + row * row) % symbols.length]).join("\n"),
);

export default function MatrixRain() {
  return <div className="arc-matrix" aria-hidden="true">
    {streams.map((text, index) => <div className="arc-matrix-column" key={index} style={{
      left: `${(index + .5) / streams.length * 100}%`,
      "--rain-duration": `${22 + index * 7 % 19}s`,
      "--rain-delay": `${-(index * 3.7)}s`,
    } as CSSProperties}>
      <span>{text}</span><span>{text}</span>
    </div>)}
  </div>;
}
