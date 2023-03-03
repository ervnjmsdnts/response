import {
  Box,
  CircularProgress,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import AttendanceTable from "../component/AttendanceTable";
import { firestore } from "../config/config";
import { useAuth } from "../context/AuthContext";
import { studentConverter, Students } from "../model/Students";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DailyReport = () => {
  const [month, setMonth] = useState<Dayjs | null>(dayjs());
  const [day, setDay] = useState<Dayjs | null>(dayjs());
  const [loading, setLoading] = useState<boolean>(false);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [student] = useState<Students>({
    firstName: "",
    middleName: "",
    lastName: "",
    studentID: "",
    pin: "",
    createdAt: 0,
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser !== null) {
      const ref = collection(
        firestore,
        "Users",
        currentUser!.uid,
        "Attendance"
      );
      const q = query(
        ref,
        where("timestamp", ">=", day!.startOf("day").toDate().getTime()),
        where("timestamp", "<=", day!.endOf("day").toDate().getTime()),
        orderBy("timestamp", "desc")
      );
      const unsub = onSnapshot(q, (snapshot) => {
        let data: any[] = [];
        snapshot.forEach((document) => {
          if (document !== undefined) {
            const docRef = doc(
              firestore,
              "Users",
              currentUser!.uid,
              "Students",
              document.data()["studentID"]
            ).withConverter(studentConverter);
            setLoading(true);
            getDoc(docRef)
              .then((snap) => {
                if (snap.exists()) {
                  data.push({
                    ...document.data(),
                    id: document.id,
                    student: snap.data(),
                  });
                  console.log("done");
                } else {
                  data.push({
                    ...document.data(),
                    id: document.id,
                    student: student,
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        });
        setAttendance(data);
      });
      return () => unsub();
    }
  }, [day, currentUser, student]);

  const handleChangeMonth = (newValue: typeof month) => {
    setMonth(newValue);
    setDay((prevDay) => prevDay!.month(newValue!.month()));
  };
  const handleChangeDay = (newValue: typeof day) => setDay(newValue);

  if (loading)
    return (
      <Container
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );

  return (
    <Stack p={2} gap="16px" justifyContent="flex-start" alignItems="start">
      <Box
        sx={{
          backgroundColor: "#B1BCE9",
          minWidth: "200px",
          borderRadius: 2,
          padding: 1,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack gap="8px" direction="row">
            <DatePicker
              views={["month"]}
              label="Month"
              onChange={handleChangeMonth}
              value={month}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={null}
                  // Here the line:
                  inputProps={{
                    ...params.inputProps,
                    value: month === null ? "" : months[month?.month()!],
                  }}
                />
              )}
            />
            <DatePicker
              views={["day"]}
              label="Day"
              onChange={handleChangeDay}
              value={day}
              minDate={dayjs(month).startOf("month")}
              maxDate={dayjs(month).endOf("month")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={null}
                  inputProps={{
                    ...params.inputProps,
                    value: day === null ? "" : day!.format("DD"),
                  }}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
      </Box>
      <AttendanceTable attendance={attendance} />
    </Stack>
  );
};

export default DailyReport;
