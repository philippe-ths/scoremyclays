/* global React */
const { useState } = React;

/* ========= Reusable primitives ========= */

function Button({ children, variant = "primary", size, full, onClick, ...rest }) {
  const cls = ["btn", `btn--${variant}`, size === "lg" && "btn--lg", full && "btn--full"].filter(Boolean).join(" ");
  return <button className={cls} onClick={onClick} {...rest}>{children}</button>;
}

function Card({ children, padded = true, onClick, style }) {
  return <div className={"card" + (padded ? " card--padded" : "")} onClick={onClick} style={style}>{children}</div>;
}

function Segmented({ items, value, onChange }) {
  return (
    <div className="segmented">
      {items.map(it => (
        <div
          key={it}
          className={"segmented__item" + (it === value ? " segmented__item--active" : "")}
          onClick={() => onChange(it)}
        >{it}</div>
      ))}
    </div>
  );
}

function Chip({ children, active, onClick }) {
  return <span className={"chip" + (active ? " chip--active" : "")} onClick={onClick}>{children}</span>;
}

function StatTile({ value, label, unit }) {
  return (
    <div className="stat-tile">
      <div className="stat-tile__value">{value}{unit && <span style={{fontSize:'0.55em',color:'var(--fg-3)',marginLeft:2}}>{unit}</span>}</div>
      <div className="stat-tile__label">{label}</div>
    </div>
  );
}

function TopBar({ title, onBack, action, actionOnClick }) {
  return (
    <div className="topbar">
      {onBack && <span className="topbar__back" onClick={onBack}>←</span>}
      <div className="topbar__title">{title}</div>
      {action && <span className="topbar__action" onClick={actionOnClick}>{action}</span>}
    </div>
  );
}

function TabBar({ active, onChange }) {
  const tabs = [
    { key: "home", icon: "⌂", label: "Home" },
    { key: "stats", icon: "◎", label: "Stats" },
    { key: "social", icon: "◉", label: "Social" },
    { key: "profile", icon: "◇", label: "Profile" },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => (
        <div
          key={t.key}
          className={"tabbar__item" + (active === t.key ? " tabbar__item--active" : "")}
          onClick={() => onChange(t.key)}
        >
          <div className="tabbar__icon">{t.icon}</div>
          <div>{t.label}</div>
          <div className={"tabbar__indicator" + (active !== t.key ? " tabbar__indicator--hidden" : "")} />
        </div>
      ))}
    </div>
  );
}

/* ========= Circular progress ========= */

function CircularStat({ value, size = 140, stroke = 12, color = "var(--field-700)", label, sublabel }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c - (c * value) / 100;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-1)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={dash}
          transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x={size/2} y={size/2 - 2} textAnchor="middle" dominantBaseline="central"
          fontFamily="JetBrains Mono" fontWeight="700" fontSize={size*0.22} fill={color}>{value}%</text>
        {label && <text x={size/2} y={size/2 + size*0.18} textAnchor="middle"
          fontFamily="Inter" fontWeight="600" fontSize={size*0.07} fill="var(--fg-3)" letterSpacing="1.4">{label}</text>}
      </svg>
      {sublabel && <div style={{fontSize:12,color:'var(--fg-3)',marginTop:4}}>{sublabel}</div>}
    </div>
  );
}

/* ========= Photo header ========= */

function PhotoHeader({ eyebrow, title, height = 200 }) {
  return (
    <div className="photo-header" style={{ height }}>
      <div className="photo-header__content">
        <div className="photo-header__eyebrow">{eyebrow}</div>
        <div className="photo-header__title">{title}</div>
      </div>
    </div>
  );
}

/* ========= Round row ========= */

function RoundRow({ ground, meta, score, percent, thumb, onClick }) {
  return (
    <div className="round-row" onClick={onClick}>
      <div className="round-row__thumb">{thumb || ground[0]}</div>
      <div className="round-row__body">
        <div className="round-row__title">{ground}</div>
        <div className="round-row__meta">{meta}</div>
      </div>
      <div className="round-row__score">{score}{percent && ` · ${percent}%`}</div>
    </div>
  );
}

/* ========= Activity ========= */

function Activity({ name, time, text, initials }) {
  return (
    <div className="activity">
      <div className="activity__avatar">{initials}</div>
      <div className="activity__body">
        <div className="activity__name">{name}</div>
        <div className="activity__time">{time}</div>
        <div className="activity__text">{text}</div>
        <div className="activity__actions">
          <span>👍 12</span>
          <span>💬 3</span>
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}

/* expose */
Object.assign(window, { Button, Card, Segmented, Chip, StatTile, TopBar, TabBar, CircularStat, PhotoHeader, RoundRow, Activity });
