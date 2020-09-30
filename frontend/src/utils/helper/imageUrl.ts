import pathParse from "path-parse";
type size = "256x144" | "640x360";

const imageUrl = async (filePath: string, size: size) => {
  if (!filePath) return undefined;
  let path = "";
  const { ext, name, dir } = pathParse(filePath);
  // nameを分解
  const parts = name.split("_");
  if (parts.length >= 2) {
    // basename_createdDate_size.ext
    path = `${dir}/${parts[0]}_${parts[1]}_${size}${ext.replace(/\?.+/, "")}`;
  } else {
    path = `${dir}/${name}_${size}${ext}`;
  }
  return `${process.env.REACT_APP_FREE_PIC_ENDPOINT}${path}`;
};

export default imageUrl;
