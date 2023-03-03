import { QueryDocumentSnapshot } from "firebase/firestore";

export interface Attendance {
  studentID: string;
  inSchool: false;
  timestamp: number;
}

export const subjectConverter = {
  toFirestore: (data: Attendance) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Attendance,
};
