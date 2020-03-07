import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const existDisplayName = functions.https.onCall(async (data, _context) => {
  return {
    message: await serch(data.displayName, undefined)
  }
});

async function serch(displayName: string, nextPageToken: string | undefined) {
  let exist = false;
  // List batch of users, 1000 at a time.
  await admin.auth().listUsers(1000, nextPageToken)
    .then(async (listUsersResult) => {
      listUsersResult.users.some(userRecord => {
        console.log(userRecord);
        return exist = userRecord.displayName == displayName;
      });
      if (!exist && listUsersResult.pageToken) {
        exist = await serch(displayName, listUsersResult.pageToken);
      }
    })
    .catch(function (error) {
      console.log('Error listing users:', error);
    });
  return exist;
}