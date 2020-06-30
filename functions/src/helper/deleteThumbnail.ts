import admin from "../core/admin";

const storage = admin.storage();
const exerciseThumbnailDir = "images/quiz/thumbnails/";

const deleteThumbnail = (thumbnail: string) => {
  if (!thumbnail || !thumbnail.match(exerciseThumbnailDir))
    return console.log({
      message: `${thumbnail} is not delete target!`,
    });
  const splited = thumbnail.split(".");
  // imagedir/userId_timestamp.ext -> imagedir/userId_timestamp, ext
  if (splited.length !== 2)
    return console.log({
      message: `because ivalid path format, not delete file: ${splited}`,
    });
  return storage.bucket().deleteFiles({
    prefix: `${splited[0]}`,
  });
};

export default deleteThumbnail;
