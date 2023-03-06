import {
  Box,
  Stack,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { firestore } from "../config/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { userConverter, Users } from "../model/Users";
import AttendanceTable from "../component/AttendanceTable";
import { studentConverter, Students } from "../model/Students";
import { countInSchool, countNotInSchool } from "../utils/Constants";
import dayjs, { Dayjs } from "dayjs";
interface DashBoardPageProps {}

const DashBoardPage: React.FunctionComponent<DashBoardPageProps> = () => {
  const [users, setUsers] = useState<Users | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState("morning");
  const [studentCounter, setStudentCounter] = useState(0);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [student] = useState<Students>({
    firstName: "",
    middleName: "",
    lastName: "",
    studentID: "",
    pin: "",
    createdAt: 0,
  });
  const [value] = React.useState<Dayjs>(dayjs(new Date()));

  const isMorning = (hour: number, minute: number) =>
    hour < 12 && minute <= 59 ? true : false;

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
        where("timestamp", ">=", value!.startOf("day").toDate().getTime()),
        where("timestamp", "<=", value!.endOf("day").toDate().getTime()),
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
  }, [value, currentUser, student]);
  useEffect(() => {
    if (currentUser !== null) {
      const ref = collection(firestore, "Users", currentUser.uid, "Students");
      getDocs(ref).then((snapshot) => {
        let total_count: number = 0;
        snapshot.forEach((_) => {
          if (snapshot !== undefined) {
            total_count += 1;
            console.log(total_count);
          }
        });
        setStudentCounter(total_count);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser !== null) {
      const ref = doc(firestore, "Users", currentUser!.uid).withConverter(
        userConverter
      );
      const unsub = onSnapshot(ref, (snapshot) => {
        if (snapshot.exists()) {
          setUsers(snapshot.data());
          console.log("user fetch");
        }
      });
      return () => unsub();
    }
  }, [currentUser]);

  const morningAtt = attendance.filter((ma) => {
    const timestamp = dayjs(ma.timestamp);

    return isMorning(timestamp.hour(), timestamp.minute());
  });
  const afternoonAtt = attendance.filter((aa) => {
    const timestamp = dayjs(aa.timestamp);

    return !isMorning(timestamp.hour(), timestamp.minute());
  });

  const currAttendance = filter === "morning" ? morningAtt : afternoonAtt;

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
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        padding: 2,
      }}
      direction={"column"}
    >
      <Stack direction={"column"} spacing={1} sx={{ marginLeft: 3 }}>
        <Typography
          sx={{
            color: "white",
            fontFamily: "Poppins",
            fontWeight: 700,
            fontSize: 35,
            fontStyle: "bold",
          }}
        >
          {users?.schoolName}
        </Typography>
        <Typography
          sx={{
            color: "white",
            fontFamily: "Poppins",
            fontWeight: 400,
            fontSize: 20,
            fontStyle: "normal",
          }}
        >
          Student Monitoring System powered by quick response
        </Typography>
      </Stack>

      <Stack direction={"row"} spacing={5} sx={{ padding: 5, marginX: 5 }}>
        <Box
          sx={{
            height: 150,
            width: "100%",
            backgroundColor: "#B1BCE9",
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              color: "black",
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 35,
              fontStyle: "bold",
            }}
          >
            {studentCounter}
          </Typography>
          <Typography
            sx={{
              color: "black",
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 20,
              fontStyle: "normal",
            }}
          >
            Students
          </Typography>
        </Box>{" "}
        <Box
          sx={{
            height: 150,
            width: "100%",
            backgroundColor: "#B1BCE9",
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              color: "black",
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 35,
              fontStyle: "bold",
            }}
          >
            {countInSchool(currAttendance)}
          </Typography>
          <Typography
            sx={{
              color: "black",
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 20,
              fontStyle: "normal",
            }}
          >
            In School
          </Typography>
        </Box>
        <Box
          sx={{
            height: 150,
            width: "100%",
            backgroundColor: "#B1BCE9",
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              color: "black",
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 35,
              fontStyle: "bold",
            }}
          >
            {countNotInSchool(currAttendance)}
          </Typography>
          <Typography
            sx={{
              color: "black",
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 20,
              fontStyle: "normal",
            }}
          >
            Not in School
          </Typography>
        </Box>
      </Stack>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          paddingX: 10,
          flexDirection: "column",
          display: "flex",
          alignItems: "end",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#B1BCE9",
            width: "15%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTopLeftRadius: 10,
            padding: 2,
            borderTopRightRadius: 10,
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Filter"
              defaultValue="morning"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="morning">Morning</MenuItem>
              <MenuItem value="afternoon">Afternoon</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {currentUser != null && <AttendanceTable attendance={currAttendance} />}
      </Box>
    </Stack>
  );
};

export default DashBoardPage;
