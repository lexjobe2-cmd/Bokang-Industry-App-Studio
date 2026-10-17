export type BakeryOrderStatus =
  | "Requested"
  | "Awaiting confirmation"
  | "Confirmed"
  | "Baking"
  | "Ready"
  | "Completed";

export type BakeryOrder = {
  id: string;
  customer: string;
  phone: string;
  email?: string;
  product: string;
  quantity: string;
  due: string;
  fulfilment: "Collection" | "Delivery";
  deliveryArea?: string;
  notes?: string;
  status: BakeryOrderStatus;
  createdAt: string;
  demoOnly: true;
};

export const bakeryOrderStatuses: BakeryOrderStatus[] = [
  "Requested", "Awaiting confirmation", "Confirmed", "Baking", "Ready", "Completed"
];

// This is intentionally device-local, not an API or a cross-device order service.
// Use the same client-specific key for the public demo and the private showcase.
export function bakeryOrdersKey(clientName: string) {
  const client = clientName.normalize("NFKD").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100) || "your-business";
  return "bokang-studio.bake-box.orders.v2." + client;
}
