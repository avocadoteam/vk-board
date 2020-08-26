import { MembershipItem } from "./membership";

export type ListUpdatedParams = {
  listGUID: string;
  updatedType: ListUpdatedType;
  name?: string;
  member?: MembershipItem;
};

export enum ListUpdatedType {
  DropMember = 'dropMember',
  AddMember = 'AddMember',
  Deleted = 'deleted',
  Name = 'name',
}
