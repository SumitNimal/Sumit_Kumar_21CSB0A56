export const extractOffersRecursive = (obj, list = []) => {
  if (!obj) return list;
  if (Array.isArray(obj)) {
    for (const item of obj) extractOffersRecursive(item, list);
    return list;
  }
  if (typeof obj === "object") {
    if (obj.offerHeader && obj.offerDescription) list.push(obj);
    for (const key of Object.keys(obj)) extractOffersRecursive(obj[key], list);
  }
  return list;
};
