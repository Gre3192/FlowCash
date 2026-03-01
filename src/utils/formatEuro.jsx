export default function euro(val) {

  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(Number(val || 0))

}


