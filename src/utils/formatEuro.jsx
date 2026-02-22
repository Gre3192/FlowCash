export default function formatEuro(val) {
  return val.toFixed(2).replace(".", ",") + " €";
}
