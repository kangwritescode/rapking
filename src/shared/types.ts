export interface Location {
    city: string;
    state: string;
}

export type RapMutatePayload = {
  title: string;
  content: string;
};

export type RapApiData = {
  id: number;
  title: string;
  content: string;
}
