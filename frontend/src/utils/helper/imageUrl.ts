export const quizThumbImgUrl = async (
  filePath: string,
  size: "256x144" | "640x360"
) => {
  if (!filePath) return undefined;
  const query = new URLSearchParams({
    domain: "quiiz-b06ee.appspot.com",
    size,
  });
  return `${
    process.env.REACT_APP_FREE_PIC_ENDPOINT
  }${filePath}?${query.toString()}`;
};

export const userProfileImgUrl = (
  filePath: string,
  version: string,
  size: "512x512" | "256x256" | "128x128" | "64x64"
) => {
  if (!filePath) return "";
  if (filePath.indexOf("http") === 0) return filePath;
  return `${
    process.env.REACT_APP_FREE_PIC_ENDPOINT
  }${filePath}?domain=quiiz-b06ee&size=${size}&version=${version || ""}`;
};
