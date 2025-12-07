import Offer from "../models/Offer.js";
import { calculateDiscount } from "../utils/calculate.js";

export const getHighestDiscount = async (req, res) => {
  try {
    const { amountToPay, bankName, paymentInstrument } = req.query;
    if (!amountToPay || !bankName)
      return res.status(400).json({ error: "Missing query params" });

    let query = { bankName };
    if (paymentInstrument) query.paymentInstruments = paymentInstrument;

    const offers = await Offer.find(query);
    let best = 0;

    for (const offer of offers) {
      const d = calculateDiscount(offer, Number(amountToPay));
      best = Math.max(best, d);
    }

    res.json({ highestDiscountAmount: best });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
