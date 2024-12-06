interface IELTSWObj {
  index?: number;
  zh?: string;
  zh_answer?: string;
  en?: string;
  en_answer?: string;
}

type IELTSWList = Array<IELTSWObj>;
export type { IELTSWList, IELTSWObj };
