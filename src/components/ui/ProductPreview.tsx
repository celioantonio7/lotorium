export default function ProductPreview({
  variant,
  label,
  name,
}: {
  variant: number;
  label: string;
  name: string;
}) {
  return (
    <div
      className={`product-preview preview-${variant}`}
      aria-label={`Ilustração demonstrativa de interface para ${name}`}
    >
      <div className="preview-toolbar">
        <div>
          <i />
          <i />
          <i />
        </div>
        <span>{name}</span>
        <span>↗</span>
      </div>
      <div className="preview-shell">
        <aside>
          <div className="preview-brand">
            h<span>c</span>
          </div>
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} />
          ))}
          <span />
        </aside>
        <div className="preview-body">
          <div className="preview-greeting">
            {label}
            <span>↗</span>
          </div>
          <div className="preview-summary">
            <div>
              <small>Organize.</small>
              <strong>
                {variant === 0
                  ? "Venda melhor."
                  : variant === 1
                    ? "Veja além."
                    : "Seu tempo."}
              </strong>
            </div>
            <div className="preview-plus">+</div>
          </div>
          {variant === 2 ? (
            <div className="preview-calendar">
              {["SEG", "TER", "QUA", "QUI", "SEX"].map((day, i) => (
                <div key={day}>
                  <span>{day}</span>
                  {Array.from({ length: 3 }, (_, j) => (
                    <i
                      key={j}
                      style={{
                        opacity: (i + j) % 3 === 0 ? 0.8 : 0.3,
                        marginTop: (i + j) % 2 ? 24 : 8,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="preview-stats">
                {["Visão geral", "Em movimento", "Próximos passos"].map((x) => (
                  <div key={x}>
                    <i />
                    <span>{x}</span>
                    <b />
                  </div>
                ))}
              </div>
              <div className="preview-chart">
                <div className="chart-grid" />
                {[30, 48, 38, 60, 50, 73, 66, 85, 71, 94, 83, 100].map(
                  (v, i) => (
                    <i key={i} style={{ height: `${v}%` }} />
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <span className="demo-label">INTERFACE DEMONSTRATIVA</span>
    </div>
  );
}
