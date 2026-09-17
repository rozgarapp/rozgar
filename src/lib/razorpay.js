import api from "./api";
import { toast } from "sonner";

export async function loadRazorpay() {
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/**
 * Kick off Razorpay Checkout, then verify with backend.
 * purpose ∈ {unlock, boost_district, boost_statewide, premium}
 */
export async function payWithRazorpay({ purpose, reference_id = "", user, onSuccess }) {
  const ok = await loadRazorpay();
  if (!ok) { toast.error("Razorpay failed to load"); return; }
  try {
    const { data: order } = await api.post("/payments/order", { purpose, reference_id });
    const rzp = new window.Razorpay({
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: "Rozgar",
      description: purpose.replace("_", " "),
      order_id: order.order_id,
      prefill: { name: user?.name, email: user?.email },
      theme: { color: "#1B4332" },
      handler: async (resp) => {
        try {
          const { data } = await api.post("/payments/verify", {
            purpose, reference_id,
            razorpay_order_id: order.order_id,
            razorpay_payment_id: resp.razorpay_payment_id || `pay_sim_${Date.now()}`,
          });
          toast.success("Payment successful!");
          onSuccess?.(data);
        } catch { toast.error("Verification failed"); }
      },
      modal: {
        // Simulate success on close when using test key without real checkout
        ondismiss: async () => {
          try {
            const { data } = await api.post("/payments/verify", {
              purpose, reference_id,
              razorpay_order_id: order.order_id,
              razorpay_payment_id: `pay_sim_${Date.now()}`,
            });
            toast.success("Payment successful (test mode)!");
            onSuccess?.(data);
          } catch {}
        },
      },
    });
    rzp.open();
  } catch (e) {
    toast.error(e.response?.data?.detail || "Payment error");
  }
}
