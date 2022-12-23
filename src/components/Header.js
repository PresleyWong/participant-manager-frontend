import { Link as ReachLink, useNavigate } from "react-router-dom";
import {
  selectCurrentUser,
  clearCredentials,
} from "../redux/features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { TbLogout } from "react-icons/tb";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Icon,
} from "@chakra-ui/react";
import { indexApi } from "../redux/api/indexApi";

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("teal.600", "teal.300"),
    }}
    as={ReachLink}
    to={children.href}
  >
    {children.linkTitle}
  </Link>
);

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(clearCredentials());
    dispatch(indexApi.util.resetApiState());
    navigate("/");
  };

  let LinkItems = [
    { linkTitle: "Events", href: "/events" },
    { linkTitle: "Saints", href: "/participants" },
  ];

  if (currentUser?.isAdmin) {
    LinkItems = [...LinkItems, { linkTitle: "Serving One", href: "/users" }];
  }

  const UserMenu = () => {
    let output;
    if (currentUser) {
      output = (
        <Menu>
          <MenuButton as={Button} rounded={"full"} cursor={"pointer"} minW={0}>
            {/* <Avatar size={"sm"} /> */}
            {currentUser.locality}
          </MenuButton>
          <MenuList>
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
          colorScheme="teal"
          variant="solid"
          className="primary-button"
        >
          Login
        </Button>
      );
    }
    return output;
  };

  return (
    <>
      <Box px={4} bg={useColorModeValue("#e0e5d7", "gray.700")}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Button as={ReachLink} to={"/"} colorScheme="teal" variant="ghost">
              Participant Manager
            </Button>
          </HStack>
          <Flex alignItems={"center"}>
            <Button onClick={toggleColorMode} rounded={"full"} mr={3}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            <UserMenu />
          </Flex>
        </Flex>
      </Box>
      <Box
        bg={useColorModeValue("#386a24", "gray.500")}
        color={useColorModeValue("white", "white")}
        px={4}
      >
        <Flex h={10} alignItems={"center"} justifyContent={"center"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            bg={useColorModeValue("#386a24", "gray.500")}
            colorScheme="teal"
          />
          <HStack spacing={8} alignItems={"center"}>
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
          <HStack spacing={8} alignItems={"center"} justifyContent={"center"}>
            <Box px={4} display={{ md: "none" }}>
              <Stack
                as={"nav"}
                spacing={4}
                alignItems={"center"}
                justifyContent={"center"}
              >
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
