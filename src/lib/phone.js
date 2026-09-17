export function maskedDisplay(worker) {
  if (worker.masked_phone) return worker.masked_phone;
  return "+91-XXXXX-XXXXX";
}
