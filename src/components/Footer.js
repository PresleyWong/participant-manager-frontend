import React from "react";

import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.700")}
      color={useColorModeValue("gray.700", "white")}
    >
      <Container as={Stack} maxW={"6xl"} py={4}>
        <Center>
          <Text>© 2022 All rights reserved</Text>
        </Center>
      </Container>
    </Box>
  );
};

export default Footer;
