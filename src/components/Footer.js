import {
  Flex,
  Container,
  Stack,
  Text,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { useGetSettingQuery } from "../redux/api/settingApi";

const Footer = () => {
  const { data } = useGetSettingQuery();
  const d = new Date();
  let year = d.getFullYear();

  return (
    <footer className="footer-bottom">
      <Flex
        bg={useColorModeValue(
          data?.footer_bg_light_color,
          data?.footer_bg_dark_color
        )}
        color={useColorModeValue(
          data?.footer_text_light_color,
          data?.footer_text_dark_color
        )}
      >
        <Container as={Stack} maxW={"6xl"} py={4}>
          <Center>
            <Text>© {year} All rights reserved</Text>
          </Center>
        </Container>
      </Flex>
    </footer>
  );
};

export default Footer;
