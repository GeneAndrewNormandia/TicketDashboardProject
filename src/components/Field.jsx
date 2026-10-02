// Shows a value, or a quiet placeholder when it is missing.
export default function Field({ value, empty = "Not set" }) {
  return value ? <>{value}</> : <span className="missing">{empty}</span>;
}
