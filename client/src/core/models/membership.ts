export type MembershipItem = {
  avatar: string;
  userId: number;
  firstName: string;
  lastName: string;
  name: string;
};

export type MembershipState = {
  dropUserId: number;
};

export type MembershipListPreview = {
  id: number;
  name: string
}