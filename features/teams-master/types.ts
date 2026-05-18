export type TeamDTO = {
  id: string;
  name: string;
  members: Array<{ id: string; name: string }>;
};
