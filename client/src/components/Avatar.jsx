import { initials, colorFromName } from "../lib/utils";
export default function Avatar({ name, size = 32 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold"
      style={{ width: size, height: size, background: colorFromName(name || "?"), fontSize: size * 0.4 }}
      title={name}
    >
      {initials(name)}
    </div>
  );
}
