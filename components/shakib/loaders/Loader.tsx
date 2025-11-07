import React from "react";
import styles from "../../../styles/shakib/Loader.module.css";

type CSSCustomProps = Record<`--${string}`, string>;

type LoaderProps = {
  size?: string;
  color?: string;
  duration?: string;
  center?: boolean;
  className?: string;
  "aria-label"?: string;
};

const Loader: React.FC<LoaderProps> = ({
  size = "3rem",
  color = "#333",
  duration = "2s",
  center = false,
  className,
  "aria-label": ariaLabel = "Loading",
}) => {
  const custom: React.CSSProperties & CSSCustomProps = {
    ["--dim"]: size,
    ["--color"]: color,
    ["--dur"]: duration,
  };

  const rootClass = [
    center ? styles.centerWrapper : null,
    styles.loaderRoot,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} aria-label={ariaLabel}>
      <div className={styles.loader} style={custom}>
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
      </div>
    </div>
  );
};

export default Loader;
