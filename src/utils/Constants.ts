import { arrayBuffer } from "stream/consumers";
import { Attendance } from "../model/Attendance";
import { Students } from "../model/Students";

export const userType: Array<string> = ["Student", "Teacher"];

export const colorPrimary = "#101828";
export const colorSecondary = "#1D2939";
export const grey25 = "#FCFCFD";
export const grey50 = "#F9FAFB";
export const grey100 = "#F2F4F7";
export const grey300 = "#D9D9D9";
export const purple = "#C7C6FA";

export const PROFILE_PATH = "images";
export function formatTimestamp(time: number): string {
  return new Date(time).toLocaleString();
}
export function inOrOut(data: boolean): string {
  if (data) {
    return "IN";
  }
  return "OUT";
}
export const getTimestamp = (): number => {
  return new Date().getTime() / 1000;
};

export const countInSchool = (array: Attendance[]): number => {
  const notInSchool = array.filter((arr) => !arr.inSchool);

  const inSchool = array.filter(
    (arr) => !notInSchool.some((att) => att.studentID === arr.studentID)
  );

  return inSchool.length;
};

export const countNotInSchool = (array: Attendance[]): number => {
  return array.filter((arr) => !arr.inSchool).length;
};

export const count = (array: Attendance[], studentID: string): number => {
  return array.filter((data) => data.studentID === studentID).length;
};

//set the  time of the moment into (0-0-1)
export function startOfDay(moment: any): number {
  var date = moment.toDate();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(1);
  return date.getTime();
}
//set the time of the moment into (23-59-59)
export function endOfDay(moment: any): number {
  var date = moment.toDate();
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  return date.getTime();
}
