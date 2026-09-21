import type { Category } from "@/lib/types";

const TINT: Record<Category, { bg: string; fg: string }> = {
  Lauk: { bg: "#fbefe7", fg: "#b9663a" },
  Sayur: { bg: "#edf6ec", fg: "#4c8a4b" },
  Nasi: { bg: "#faf3e2", fg: "#a8862c" },
  Minuman: { bg: "#eaf2f9", fg: "#3d7aa6" },
};

function Glyph({ category }: { category: Category }) {
  const stroke = TINT[category].fg;
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (category === "Sayur") {
    return (
      <g {...common}>
        <path d="M10 25h28c0 8-6 13-14 13s-14-5-14-13z" />
        <path d="M24 21c0-5 4-9 9-9 0 5-4 9-9 9z" />
        <path d="M24 21v4" />
      </g>
    );
  }
  if (category === "Nasi") {
    return (
      <g {...common}>
        <path d="M24 11l9 17H15z" />
        <path d="M11 31h26" />
        <path d="M13 31c0 4 5 6 11 6s11-2 11-6" />
      </g>
    );
  }
  if (category === "Minuman") {
    return (
      <g {...common}>
        <path d="M16 15h16l-2 21H18z" />
        <path d="M17 23h14" />
        <path d="M27 10l-3 5" />
      </g>
    );
  }
  return (
    <g {...common}>
      <ellipse cx="24" cy="30" rx="15" ry="7" />
      <path d="M13 28c2-6 6-9 11-9s9 3 11 9" />
      <circle cx="20" cy="24" r="2" />
      <circle cx="28" cy="25" r="1.5" />
    </g>
  );
}

interface Props {
  category: Category;
  image?: string;
  alt: string;
  className?: string;
  rounded?: string;
}

/**
 * Thumbnail menu. Memakai foto bila admin mengisi URL gambar, kalau tidak
 * memakai ilustrasi garis sesuai kategori.
 */
export default function FoodThumb({
  category,
  image,
  alt,
  className = "h-20 w-20",
  rounded = "rounded-xl",
}: Props) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image}
        alt={alt}
        className={`${className} ${rounded} object-cover`}
        loading="lazy"
      />
    );
  }

  const tint = TINT[category];
  return (
    <div
      className={`${className} ${rounded} flex items-center justify-center`}
      style={{ backgroundColor: tint.bg }}
      role="img"
      aria-label={alt}
    >
      <svg viewBox="0 0 48 48" className="h-1/2 w-1/2">
        <Glyph category={category} />
      </svg>
    </div>
  );
}
