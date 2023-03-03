import {
  Button,
  Grid,
  TextField,
  ButtonProps,
  Stack,
  Box,
  CircularProgress,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  Container,
  ThemeProvider,
  Typography,
  Avatar,
} from "@mui/material";
import React, { useState, useRef } from "react";
import { createTheme, styled } from "@mui/material/styles";
import "../styles/auth.css";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { firestore, auth, storage } from "../config/config";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { flattenDiagnosticMessageText } from "typescript";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Users } from "../model/Users";
import { colorPrimary, PROFILE_PATH } from "../utils/Constants";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";
interface RegisterPageProps {}
interface IRegister {
  firstName: string;
  middleName: string;
  lastName: string;
  schoolName: string;
  schoolProfile: string;
  email: string;
  password: string;
  loading: boolean;
  alert: {
    open: boolean;
    meesage: string;
  };
}
const RegisterPage: React.FunctionComponent<RegisterPageProps> = () => {
  const [istate, isetState] = useState<IRegister>({
    firstName: "",
    middleName: "",
    lastName: "",
    schoolName: "",
    schoolProfile: "",
    email: "",
    password: "",
    loading: false,
    alert: {
      open: false,
      meesage: "",
    },
  });
  const timer = useRef<number>();

  const navigate = useNavigate();
  const [forUpload, setForUpload] = useState("");
  const onImageChange = (event: any) => {
    setForUpload(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        isetState({ ...istate, schoolProfile: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const handleButtonClick = () => {
    if (!istate.loading) {
      isetState({ ...istate, loading: true });
      timer.current = window.setTimeout(() => {
        isetState({ ...istate, loading: false });
        signUp();
        navigate("/");
      }, 2000);
    }
  };
  function uploadFile(file: any, users: Users) {
    isetState({ ...istate, loading: true });
    if (file == null) return;
    const fileref = ref(storage, `${PROFILE_PATH}/${uuidV4()}`);
    uploadBytes(fileref, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          users.schoolProfile = url;
          saveUser(users);
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => isetState({ ...istate, loading: false }));
  }

  async function signUp() {
    isetState({ ...istate, loading: true });
    await createUserWithEmailAndPassword(auth, istate.email, istate.password)
      .then((userCredential) => {
        const currenUser = userCredential.user;
        let newUser: Users = {
          id: currenUser.uid,
          firstName: istate.firstName,
          middleName: istate.middleName,
          lastName: istate.lastName,
          schoolName: istate.schoolName,
          schoolProfile: istate.schoolProfile,
          email: istate.email,
        };
        withImageOrNo(newUser);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        isetState({
          ...istate,
          alert: {
            open: true,
            meesage: errorCode + " " + errorMessage,
          },
        });
      });
    isetState({ ...istate, loading: false });
  }
  async function saveUser(users: Users) {
    isetState({ ...istate, loading: true });
    try {
      await setDoc(doc(firestore, "Users", users.id), users);
      isetState({
        ...istate,
        alert: {
          open: true,
          meesage: "Successfull created",
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding document: ", error);
      isetState({
        ...istate,
        loading: false,
        alert: {
          open: true,
          meesage: "Error adding document",
        },
      });
    }
  }
  const withImageOrNo = (users: Users) => {
    if (forUpload != "") {
      uploadFile(forUpload, users);
    } else {
      saveUser(users);
    }
  };
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[900]),
    borderRadius: 10,
    backgroundColor: "#111928",
    "&:hover": {
      backgroundColor: grey[800],
    },
  }));

  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "Poppins",
      },
    },
  });
  return (
    <div>
      <Container maxWidth="xl" style={{ backgroundColor: "#F2F2F9" }}>
        <ThemeProvider theme={theme}>
          <Grid
            container
            spacing={2}
            direction={"column"}
            justifyContent="center"
            alignContent={"center"}
            style={{ minHeight: "100vh", marginTop: "0px" }}
          >
            <Box
              sx={{
                width: 900,
                height: "80vh",
                padding: 5,
                borderRadius: 10,
                backgroundColor: "#ffff",
                boxShadow: 2,
              }}
            >
              <Stack direction={"column"} spacing={2} justifyContent="center">
                <h1 style={{ marginBottom: "1px" }}>
                  <b>Sign Up</b>
                </h1>
                <p style={{ marginTop: "0px" }}>
                  This is your first step with us!
                </p>
                <Typography
                  sx={{
                    color: "black",
                    fontFamily: "Poppins",
                    fontSize: 20,
                    fontWeight: 700,
                    fontStyle: "normal",
                  }}
                >
                  School Info
                </Typography>

                <Stack direction={"row"} spacing={2}>
                  <Stack direction={"column"}>
                    <Avatar
                      sx={{ bgcolor: colorPrimary, width: 200, height: 200 }}
                      src={istate.schoolProfile}
                      variant="square"
                    >
                      No School logo
                    </Avatar>
                    <Button variant="contained" component="label">
                      Add School Logo
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        onChange={onImageChange}
                      />
                    </Button>
                  </Stack>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="School Name"
                    value={istate.schoolName}
                    onChange={(e) =>
                      isetState({ ...istate, schoolName: e.target.value })
                    }
                    style={{ margin: "2.5px" }}
                  />
                </Stack>

                <Typography
                  sx={{
                    color: "black",
                    fontFamily: "Poppins",
                    fontSize: 20,
                    fontWeight: 700,
                    fontStyle: "normal",
                  }}
                >
                  Admin Info
                </Typography>
                <Stack>
                  <FormControl>
                    <Box
                      sx={{ display: "inline-flex" }}
                      style={{ marginBottom: "10px" }}
                    >
                      <TextField
                        variant="outlined"
                        label="Firstname"
                        fullWidth
                        value={istate.firstName}
                        onChange={(e) =>
                          isetState({ ...istate, firstName: e.target.value })
                        }
                        style={{ width: "250px", margin: "2.5px" }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Middlename"
                        value={istate.middleName}
                        onChange={(e) =>
                          isetState({ ...istate, middleName: e.target.value })
                        }
                        style={{ width: "250px", margin: "2.5px" }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Lastname"
                        value={istate.lastName}
                        onChange={(e) =>
                          isetState({ ...istate, lastName: e.target.value })
                        }
                        style={{ width: "250px", margin: "2.5px" }}
                      />
                    </Box>
                  </FormControl>
                  <Box
                    sx={{ display: "inline-flex" }}
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Email"
                      value={istate.email}
                      onChange={(e) =>
                        isetState({ ...istate, email: e.target.value })
                      }
                      type={"email"}
                    />
                  </Box>
                  <FormControl>
                    <Box
                      sx={{ display: "inline-flex" }}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Password"
                        type={"password"}
                        value={istate.password}
                        onChange={(e) =>
                          isetState({ ...istate, password: e.target.value })
                        }
                        style={{ margin: "2.5px" }}
                      />
                    </Box>
                  </FormControl>
                </Stack>
                <Stack>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {istate.loading && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </Box>

                  <ColorButton
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleButtonClick}
                    style={{ marginBottom: "20px" }}
                  >
                    Create Account
                  </ColorButton>
                </Stack>
              </Stack>
              <Box style={{ textAlign: "center", marginTop: "15px" }}>
                <label
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Already have an account? Login
                </label>
              </Box>
            </Box>
          </Grid>
        </ThemeProvider>
      </Container>
    </div>
  );
};

export default RegisterPage;
