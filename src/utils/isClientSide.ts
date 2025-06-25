export default function isClientSide() {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
}