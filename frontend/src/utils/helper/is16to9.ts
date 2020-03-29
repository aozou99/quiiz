const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = e => reject(e);
    img.src = src;
  });
};

const is16to9 = async (src: string) => {
  const res = await loadImage(src);
  return res.width / res.height === 16 / 9;
};

export default is16to9;
