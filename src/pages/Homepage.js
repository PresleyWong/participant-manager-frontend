import {
  Grid,
  GridItem,
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Text,
  Spinner,
  useColorModeValue,
  Center,
  Container,
} from "@chakra-ui/react";
import Login from "./Login";
import { useGetEventsWithLimitQuery } from "../redux/api/eventApi";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";

const Homepage = () => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetEventsWithLimitQuery(12);
  const backgroundColor = useColorModeValue("white", "gray.700");
  const currentUser = useSelector(selectCurrentUser);

  const EventList = () => {
    let content;

    if (isSuccess) {
      content = (
        <>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              {data.map((item, index) => (
                <Box key={index}>
                  <Heading size="xs" textTransform="uppercase">
                    {item.title}
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {`Date: ${item.start_date} to ${item.end_date}`}
                  </Text>
                </Box>
              ))}
            </Stack>
          </CardBody>
        </>
      );
    } else if (isLoading) {
      content = (
        <Center>
          <Spinner />
        </Center>
      );
    } else if (isError) {
      content = <div>{error.toString()}</div>;
    }

    return content;
  };

  return (
    <Grid
      templateColumns={{ md: "repeat(12, 1fr)", base: "repeat(1, 1fr)" }}
      columnGap={{ md: 5 }}
      rowGap={{ base: 5 }}
    >
      <GridItem colSpan={{ lg: currentUser ? 0 : 4, md: currentUser ? 0 : 5 }}>
        {!currentUser && <Login />}
      </GridItem>
      <GridItem colSpan={{ lg: currentUser ? 12 : 8, md: currentUser ? 0 : 7 }}>
        <Card bg={backgroundColor} boxShadow={"lg"}>
          <CardHeader
            bg={useColorModeValue("#55624d", "gray.500")}
            color={useColorModeValue("white", "white")}
          >
            <Heading size="md">Upcoming Events</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <EventList />
            </Stack>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default Homepage;
