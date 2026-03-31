export default function sumArray(array) {
    return array.reduce((acc, value) => {
        return typeof value === "number" && !isNaN(value)
            ? acc + value
            : acc;
    }, 0);
}