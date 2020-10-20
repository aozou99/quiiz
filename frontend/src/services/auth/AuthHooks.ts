import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const db = firebase.firestore();

export const useAuthUser = () => {
  const [firebaseUser, loading] = useAuthState(firebase.auth());
  return { firebaseUser, loading };
};
export const useFetchQuiizUser = (userId?: string) => {
  const [firebaseUser, loading] = useAuthState(firebase.auth());
  const [user, setUser] = useState<any>();
  const [loaded, setLoaded] = useState(false);
  const [isMe, setIsMe] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (userId && !loading) {
      setIsMe(firebaseUser?.uid === userId);
      db.collection("users")
        .doc(userId)
        .get()
        .then(doc => {
          if (mounted) setUser(doc.data());
        })
        .finally(() => setLoaded(true));
    }
    return () => {
      mounted = false;
    };
  }, [loading, userId, firebaseUser]);

  return { user, loaded, isMe };
};
