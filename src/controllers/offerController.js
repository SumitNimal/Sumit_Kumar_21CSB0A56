import Offer from "../models/Offer.js";
import { extractOffersRecursive } from "../utils/extractOffers.js";
import { parseAmount } from "../utils/calculate.js";

export const createOffers = async (req, res) => {
  try {
    const payload = req.body.flipkartOfferApiResponse;
    if (!payload) return res.status(400).json({ error: "Missing payload" });

    const extracted = extractOffersRecursive(payload);
    let newOffers = 0;

    for (const offer of extracted) {
      let minAmount = 0, maxAmount = Infinity, maxDiscount = 0, discountNow = 0;

      for (const d of offer.offerDescription || []) {
        if (d.key === "Min. order value") minAmount = parseAmount(d.value);
        if (d.key === "Max Order Value") maxAmount = parseAmount(d.value);
        if (d.key === "Max. discount") maxDiscount = parseAmount(d.value);
        if (d.key === "You get") discountNow = parseAmount(d.value);
      }

      const normalized = {
        offerId: offer.offerHeader.title + "-" + minAmount + "-" + maxDiscount,
        title: offer.offerHeader.title,
        bankName: offer.bank || offer.bankCode || null,
        minAmount,
        maxAmount,
        maxDiscount,
        discountNow,
        discountType: offer.discountType || null,
        discountValue: offer.discountValue || null,
        paymentInstruments: offer.paymentInstruments || []
      };

      const exists = await Offer.findOne({ offerId: normalized.offerId });
      if (!exists) {
        await Offer.create(normalized);
        newOffers++;
      }
    }

    res.json({
      noOfOffersIdentified: extracted.length,
      noOfNewOffersCreated: newOffers
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
