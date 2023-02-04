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
    <footer className="footer-bottom">
      <Box
        bg={useColorModeValue("secondary.95", "secondary.30")}
        color={useColorModeValue("secondary.10", "secondary.90")}
      >
        <Container as={Stack} maxW={"6xl"} py={4}>
          <Center>
            <Text>© 2023 All rights reserved</Text>
          </Center>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
