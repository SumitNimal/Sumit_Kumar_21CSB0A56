export const parseAmount = (str) => {
  if (!str) return 0;
  return Number(str.replace(/[^0-9]/g, ""));
};

export const calculateDiscount = (offer, amount) => {
  if (amount < offer.minAmount) return 0;

  if (offer.discountType === "FLAT") {
    return Math.min(offer.maxDiscount, offer.discountValue);
  }

  if (offer.discountType === "PERCENT") {
    const d = (amount * offer.discountValue) / 100;
    return Math.min(d, offer.maxDiscount);
  }

  return offer.discountNow || 0;
};
