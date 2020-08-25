const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

const doMatchRatios = async (
  src: string,
  widthRatio: number,
  heightRatio: number
) => {
  const res = await loadImage(src);
  return res.width / res.height === widthRatio / heightRatio;
};

export default doMatchRatios;
