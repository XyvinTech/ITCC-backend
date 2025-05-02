const User = require("../models/userModel");

exports.generateUniqueMemberId = async (
  name,
  chapterShortCode,
  existingIdsSet
) => {
  if (!name || !chapterShortCode) {
    throw new Error("Both name and chapterShortCode are required");
  }

  const firstLetter = name.charAt(0).toUpperCase();
  const idPrefix = `${chapterShortCode}${firstLetter}`;

  const existingUsers = await User.find({
    memberId: { $regex: `^${idPrefix}\\d{2,}$` },
  }).select("memberId -_id");

  const allExistingIds = new Set(
    existingUsers
      .map((user) => user.memberId)
      .concat([...(existingIdsSet || [])])
  );

  let maxCounter = 0;
  for (const id of allExistingIds) {
    const match = id.match(new RegExp(`^${idPrefix}(\\d+)$`));
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxCounter) maxCounter = num;
    }
  }

  const nextCounter = maxCounter + 1;
  const counterString = nextCounter.toString().padStart(3, "0");
  const uniqueMemberId = `${idPrefix}${counterString}`;

  return uniqueMemberId;
};
