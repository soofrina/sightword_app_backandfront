import React, { useEffect, useState } from "react";
// import GoogleLogin from "react-google-login";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LoginDesktop from "../../assets/LoginDesktop.svg";
import LoginMobile from "../../assets/LoginMobile.svg";
import { GoogleLogin } from "@react-oauth/google";
import ErrorToaster from "@base/components/error-toaster";
import { useRecoilState } from "recoil";
import { userAtom, tokenAtom } from "@recoil/user/atom";
import { useNavigate } from "react-router";
import { devLogin, login } from "@base/api/user";
import { Role } from "@base/type/user";
import AppButton from "@base/components/app-button";
import { useMutation } from "@tanstack/react-query";

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isOpen, setOpen] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);
  const [token, setToken] = useRecoilState(tokenAtom);

  const [messageHeader, setMessageHeader] = useState("");
  const [messageBody, setMessageBody] = useState("");

  const loginMutation = useMutation({
    mutationFn: login,
  });

  const devLoginMutation = useMutation({
    mutationFn: devLogin,
  });

  const handleLoginSuccess = async (response: any) => {
    try {
      const res = await loginMutation.mutateAsync(response.credential);
      if (res.status != 201 && res.status != 200) {
        handleLoginError();
        return;
      }
      setUser({
        id: res.data.user.id,
        email: res.data.user.email,
        roleNames: res.data.roles,
        lastLoggedIn: res.data.user.lastLoggedIn,
      });
      setToken({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      if (
        res.data.roles.some((e) => e.role === "admin" || e.role === "teacher")
      ) {
        navigate("/staff");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      handleLoginError();
    }
  };

  const getEmail = (userType: Role) => {
    // TODO change to other emails once CRUD is setup
    switch (userType) {
      case "student":
        return "student@gmail.com";
      case "teacher":
        return "teacher@gmail.com";
      default:
        // admin
        return "superadmin@gmail.com";
    }
  };

  // intentionally duplicated code from handleLogin, to remove in production
  const handleDeveloperLogin = async (userType: Role) => {
    try {
      const email = getEmail(userType);
      const res = await devLoginMutation.mutateAsync(email);
      if (res.status != 201 && res.status != 200) {
        handleLoginError();
        return;
      }
      setUser({
        id: res.data.user.id,
        email: res.data.user.email,
        roleNames: res.data.roles,
        lastLoggedIn: res.data.user.lastLoggedIn,
      });
      setToken({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      if (
        res.data.roles.some((e) => e.role === "admin" || e.role === "teacher")
      ) {
        navigate("/staff");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      handleLoginError();
    }
  };

  const handleLoginError = () => {
    setMessageHeader("Error");
    setMessageBody("Error logging in");
    setOpen(true);
  };

  return (
    <Box
      className='h-screen w-screen'
      style={{
        backgroundImage: `url(${isMobile ? LoginMobile : LoginDesktop})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box className='flex flex-col items-center justify-center h-4/6 w-screen'>
        <Typography className='font-bold text-3xl sm:mb-12 mb-6'>
          Welcome back!
        </Typography>
        <Box className='bg-white rounded shadow text-center p-6'>
          <Typography className='font-bold text-l mb-3'>LOGIN</Typography>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </Box>

        {process.env.REACT_APP_ENV === "development" && (
          <>
            <AppButton
              className='mt-3'
              onClick={() => handleDeveloperLogin("student")}
            >
              LOGIN STUDENT
            </AppButton>
            <AppButton
              className='mt-3'
              onClick={() => handleDeveloperLogin("teacher")}
            >
              LOGIN TEACHER
            </AppButton>
            <AppButton
              className='mt-3'
              onClick={() => handleDeveloperLogin("admin")}
            >
              LOGIN ADMIN
            </AppButton>
          </>
        )}

        <ErrorToaster
          isOpen={isOpen}
          messageBody={messageBody}
          messageHeader={messageHeader}
          onClose={() => setOpen(false)}
        />
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loginMutation.isLoading || devLoginMutation.isLoading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>
    </Box>
  );
};

export default LoginPage;
