import { Link as ReachLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { TbLogout } from "react-icons/tb";
import {
  Container,
  Box,
  Button as ChakraButton,
  Flex,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import "typeface-cinzel";

import { indexApi } from "../redux/api/indexApi";
import {
  selectCurrentUser,
  clearCredentials,
} from "../redux/features/auth/authSlice";
import { useGetSettingQuery } from "../redux/api/settingApi";
import { Button, IconButton } from "./custom-component";

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    variant={"custom"}
    as={ReachLink}
    to={children.href}
    _hover={{ bg: "none" }}
  >
    {children.linkTitle}
  </Link>
);

const Header = () => {
  const { data } = useGetSettingQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const { toggleColorMode } = useColorMode();

  const titleBg = useColorModeValue(
    data?.header_bg_light_color,
    data?.header_bg_dark_color
  );

  const titleTxt = useColorModeValue(
    data?.header_text_light_color,
    data?.header_text_dark_color
  );

  const navbarBg = useColorModeValue(
    data?.navbar_bg_light_color,
    data?.navbar_bg_dark_color
  );

  const navbarColor = useColorModeValue(
    data?.navbar_text_light_color,
    data?.navbar_text_dark_color
  );

  const menuBgColor = useColorModeValue(
    data?.secondary_button_bg_light_color,
    data?.secondary_button_bg_dark_color
  );

  const menuTxtColor = useColorModeValue(
    data?.secondary_button_text_light_color,
    data?.secondary_button_text_dark_color
  );

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(clearCredentials());
    dispatch(indexApi.util.resetApiState());
    navigate("/");
    window.location.reload(false);
  };

  let LinkItems = [
    { linkTitle: "Events", href: "/events" },
    { linkTitle: "Saints", href: "/participants" },
  ];

  if (currentUser?.isAdmin) {
    LinkItems = [
      ...LinkItems,
      { linkTitle: "Serving One", href: "/users" },
      { linkTitle: "Settings", href: "/settings" },
    ];
  }

  const UserMenu = () => {
    let output;

    if (currentUser) {
      output = (
        <Menu>
          <MenuButton
            as={ChakraButton}
            rounded="full"
            cursor="pointer"
            boxShadow="lg"
            bg={menuBgColor}
            color={menuTxtColor}
            _active={{ bg: menuBgColor, color: menuTxtColor }}
            _hover={{ bg: menuBgColor, color: menuTxtColor }}
          >
            {`${currentUser.name} | ${currentUser.locality}`}
          </MenuButton>

          <MenuList minW={0} ml={"5"} width={"100%"}>
            <MenuItem onClick={handleLogout}>
              <Icon as={TbLogout} />
              <span>Sign out</span>
            </MenuItem>
          </MenuList>
        </Menu>
      );
    } else {
      output = (
        <Button
          as={ReachLink}
          to={"/login"}
          variant={"primary"}
          boxShadow="lg"
          label="Login"
        />
      );
    }
    return output;
  };

  return (
    <>
      <Container px={4} bg={titleBg} maxW={"1200px"} my="15px">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Link
              as={ReachLink}
              to={"/"}
              color={"teal"}
              _hover={{ textDecoration: "none" }}
            >
              <Text
                fontFamily="'Cinzel', serif"
                fontSize="36px"
                color={titleTxt}
              >
                Campus Work
              </Text>
            </Link>
          </HStack>
          <Flex alignItems={"center"}>
            <Button
              onClick={toggleColorMode}
              rounded={"full"}
              mr={3}
              variant="secondary"
              boxShadow="lg"
              label={useColorModeValue(<MoonIcon />, <SunIcon />)}
            />
            <UserMenu />
          </Flex>
        </Flex>
      </Container>
      <Box bg={navbarBg} color={navbarColor} px={4}>
        <Flex h={10} align={"center"} justify={"center"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            bg={useColorModeValue("#386a24", "gray.500")}
            colorScheme="teal"
          />
          <HStack spacing={8} align={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {LinkItems.map((link, index) => (
                <NavLink key={index}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
        </Flex>

        {isOpen ? (
          <HStack spacing={8} align={"center"} justify={"center"}>
            <Box px={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4} align={"center"} justify={"center"}>
                {LinkItems.map((link, index) => (
                  <NavLink key={index}>{link}</NavLink>
                ))}
              </Stack>
            </Box>
          </HStack>
        ) : null}
      </Box>
    </>
  );
};

export default Header;
