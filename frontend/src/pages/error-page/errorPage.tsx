import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import AppButton from "@base/components/app-button/appButton";
import React from "react";
import NotFoundDesktop from "../../assets/NotFoundDesktop.svg";
import NotFoundMobile from "../../assets/NotFoundMobile.svg";

const ErrorPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      className='h-screen w-screen'
      style={{
        backgroundImage: `url(${isMobile ? NotFoundMobile : NotFoundDesktop})`,
        backgroundSize: "cover",
        backgroundPosition: `${isMobile ? "center" : "left"}`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box className='flex flex-col items-center justify-center h-4/6 w-screen'>
        <Typography className='font-bold text-9xl tracking-widest '>
          {"404"}
        </Typography>
        <Typography className='font-bold text-2xl'>
          {"PAGE NOT FOUND"}
        </Typography>
        <br />
        {isMobile ? (
          <>
            <p className='font-bold text-textSecondary'>
              {"Oops! We can't find the"}
            </p>
            <p className='font-bold text-textSecondary'>
              {"page you are looking for"}
            </p>
          </>
        ) : (
          <p className='font-bold text-textSecondary'>
            {"Oops! We can't find the page you are looking for"}
          </p>
        )}
        <br />
        <AppButton> GO BACK </AppButton>
      </Box>
    </Box>
  );
};

export default ErrorPage;
