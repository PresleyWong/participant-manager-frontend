import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container, Flex, useColorModeValue } from "@chakra-ui/react";

import { useGetSettingQuery } from "../redux/api/settingApi";

const Layout = (props) => {
  const { data } = useGetSettingQuery();

  return (
    <Flex
      direction="column"
      justify="space-between"
      bg={useColorModeValue(
        data?.main_bg_light_color,
        data?.main_bg_dark_color
      )}
      minH={"100vh"}
    >
      <Header />
      <Container maxW={"1200px"} my={5} marginInline="auto" centerContent>
        {props.children}
      </Container>
      <Footer />
    </Flex>
  );
};

export default Layout;
