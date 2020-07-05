import * as admin from "firebase-admin";

const searchDisplayName = async (
  displayName: string,
  nextPageToken: string | undefined
) => {
  let exist = false;
  // List batch of users, 1000 at a time.
  await admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then(async (listUsersResult) => {
      listUsersResult.users.some((userRecord) => {
        console.log(userRecord);
        return (exist = userRecord.displayName === displayName);
      });
      if (!exist && listUsersResult.pageToken) {
        exist = await searchDisplayName(displayName, listUsersResult.pageToken);
      }
    })
    .catch(function (error) {
      console.log("Error listing users:", error);
    });
  return exist;
};

export default searchDisplayName;
