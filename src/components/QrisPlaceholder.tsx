/**
 * Kotak QR contoh untuk keperluan mockup — polanya dibuat dari angka acak
 * yang tetap (deterministik), bukan kode QRIS yang bisa dipindai.
 */
export default function QrisPlaceholder({ code }: { code: string }) {
  const size = 21;
  const cells: boolean[] = [];

  let seed = 7;
  for (const char of code) seed = (seed * 31 + char.charCodeAt(0)) % 100000;

  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, size - 7) || inBox(size - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const br = r < 7 ? 0 : size - 7;
    const bc = c < 7 ? 0 : size - 7;
    const dr = r - br;
    const dc = c - bc;
    const edge = dr === 0 || dr === 6 || dc === 0 || dc === 6;
    const core = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
    return edge || core;
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isFinder(r, c)) {
        cells.push(finderOn(r, c));
      } else {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        cells.push(seed % 100 < 46);
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Contoh kode QR untuk pembayaran QRIS"
      className="h-48 w-48 rounded-md bg-white p-1 shadow-sm ring-1 ring-line"
      shapeRendering="crispEdges"
    >
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={i % size}
            y={Math.floor(i / size)}
            width="1"
            height="1"
            fill="#1c1c1b"
          />
        ) : null,
      )}
    </svg>
  );
}
