import firebase from "firebase/app";
import "firebase/firestore";

export type pagingQuizApiOptions = Partial<{
  channelId: string;
  where: {
    [field: string]: {
      operator: firebase.firestore.WhereFilterOp;
      value: any;
    };
  };
  order: {
    [field: string]: "desc" | "asc";
  };
  perCount: number;
  noExecute: boolean;
  nextQuiz: any;
}>;
