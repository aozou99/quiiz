import Service from "services/Service";
import firebase from "firebase/app";
import "firebase/firestore";

class ChannelService extends Service {
  public async subscribeOrCancel(channelId: string) {
    const me = this.logInUserOrFailed();
    const batch = firebase.firestore().batch();
    const [subscChannel, subscUser] = await Promise.all([
      this.userRef
        .doc(me.uid)
        .collection("subscribedChannel")
        .doc(channelId)
        .get(),
      this.userRef
        .doc(channelId)
        .collection("subscribedUser")
        .doc(me.uid)
        .get(),
    ]);

    if (subscChannel.exists && subscUser.exists) {
      // 削除
      batch.delete(subscChannel.ref);
      batch.delete(subscUser.ref);
      // カウントダウン
      batch.update(this.userRef.doc(me.uid), {
        subscribeChannelCount: firebase.firestore.FieldValue.increment(-1),
      });
    } else if (!subscChannel.exists && !subscUser.exists) {
      // 登録
      batch.set(subscChannel.ref, {
        id: channelId,
        ref: this.userRef.doc(channelId),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      batch.set(subscUser.ref, {
        id: me.uid,
        ref: this.userRef.doc(me.uid),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // カウントアップ
      batch.update(this.userRef.doc(me.uid), {
        subscribeChannelCount: firebase.firestore.FieldValue.increment(1),
      });
    } else {
      // 整合性を合わせるため存在する方を削除する
      if (subscChannel.exists) {
        batch.delete(subscChannel.ref);
        batch.update(this.userRef.doc(me.uid), {
          subscribeChannelCount: firebase.firestore.FieldValue.increment(-1),
        });
      }
      if (subscUser.exists) {
        batch.delete(subscUser.ref);
      }
    }
    return batch.commit().then(() => {
      // isSubscribed
      return !(subscChannel.exists && subscUser.exists);
    });
  }
}

export default new ChannelService();
