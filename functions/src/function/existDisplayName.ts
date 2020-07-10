import functions from "../core/functions";
import searchDisplayName from "../helper/searchDisplayName";

module.exports = functions.https.onCall(async (data, _context) => {
  return {
    isExist: await searchDisplayName(data.displayName, undefined),
  };
});
