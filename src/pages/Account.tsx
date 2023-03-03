import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Stack,
  Grid,
  Button,
  Container,
  CircularProgress,
  Avatar,
  Typography,
} from "@mui/material";
import logo from "../image/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "../config/config";
import { useNavigate } from "react-router-dom";
import { useQRCode } from "next-qrcode";
import { useAuth } from "../context/AuthContext";
import { firestore } from "../config/config";
import EditProfilePage from "./EditProfile";
import { userConverter, Users } from "../model/Users";
import { doc, getDoc } from "firebase/firestore";
interface AccountPageProps {}

const AccountPage: React.FunctionComponent<AccountPageProps> = (props) => {
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "Poppins",
      },
    },
  });
  const { currentUser } = useAuth();
  const { Canvas } = useQRCode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Users | null>(null);
  function getAccountInfo(uid: string) {
    const ref = doc(firestore, "Users", uid).withConverter(userConverter);
    getDoc(ref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.data();
          setUsers(data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    if (currentUser != null) {
      getAccountInfo(currentUser.uid);
    }
  }, []);
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
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 1080,
          height: 800,
          borderRadius: 10,
          backgroundColor: "#B1BCE9",
        }}
      >
        <Stack
          direction={"column"}
          spacing={2}
          sx={{
            width: "100%",
            padding: 2,
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{ width: 200, height: 200 }}
            variant="rounded"
            src={users?.schoolProfile}
          >
            No School Logo
          </Avatar>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: 40,
            }}
          >
            {users?.schoolName}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 700,
              fontStyle: "normal",
              fontSize: 20,
              color: "text.secondary",
            }}
          >
            Manage by
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: 26,
            }}
          >
            {users?.firstName} {users?.middleName} {users?.lastName}
          </Typography>

          <Button
            variant="contained"
            color="error"
            style={{
              marginLeft: "50px",
              marginRight: "50px",
              borderRadius: "50px",
              width: "200px",
            }}
            onClick={() => {
              signOut(auth);
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AccountPage;
