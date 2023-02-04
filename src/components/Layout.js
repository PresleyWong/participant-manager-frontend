import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container, Box, useColorModeValue } from "@chakra-ui/react";

const Layout = (props) => {
  return (
    <Box bg={useColorModeValue("neutral.99", "neutral.10")} minH={"100vh"}>
      <Header />
      <Container maxW={"1200px"} my={5} centerContent display={"grid"}>
        {props.children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
