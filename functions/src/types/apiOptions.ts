export type pagingQuizApiOptions = {
  channelId: string;
  lastQuizId: string;
  where: {
    [field: string]: {
      operator: FirebaseFirestore.WhereFilterOp;
      value: any;
    };
  };
  order: {
    [field: string]: "desc" | "asc";
  };
  perCount: number;
};
