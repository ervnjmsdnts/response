import { QueryDocumentSnapshot } from "firebase/firestore";

export interface Students {
  firstName: string;
  middleName: string;
  lastName: string;
  studentID: string;
  pin: string;
  createdAt: number;
}

export const studentConverter = {
  toFirestore: (data: Students) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Students,
};
