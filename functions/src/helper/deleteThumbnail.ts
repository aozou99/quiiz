import admin from "../core/admin";

const storage = admin.storage();
const exerciseThumbnailDir = "images/quiz/thumbnails/";

const deleteThumbnail = (thumbnail: string) => {
  if (!thumbnail || !thumbnail.match(exerciseThumbnailDir)) {
    console.log({
      message: `${thumbnail} is not delete target!`,
    });
    return;
  }
  const splited = thumbnail.split(".");
  // imagedir/userId_timestamp.ext -> imagedir/userId_timestamp, ext
  if (splited.length !== 2) {
    console.log({
      message: `because ivalid path format, not delete file: ${splited}`,
    });
    return;
  }
  return storage.bucket().deleteFiles({
    prefix: `${splited[0]}`,
  });
};

export default deleteThumbnail;
