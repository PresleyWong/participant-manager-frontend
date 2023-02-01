import {
  Grid,
  GridItem,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Text,
  Spinner,
  Center,
  IconButton,
  VStack,
  Button,
  Link,
  Card,
  CardHeader,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdOutlineDescription } from "react-icons/md";
import { Link as ReachLink } from "react-router-dom";

import { useGetEventsWithLimitQuery } from "../redux/api/eventApi";
import DateTimeFormatter from "../components/DateTimeFormatter";

const SimpleEventList = ({ currentUser }) => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetEventsWithLimitQuery(12);
  const backgroundColor = useColorModeValue("white", "gray.700");
  let content;

  if (isSuccess) {
    content = (
      <>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {data.map((item, index) => (
              <Box key={index}>
                <Grid
                  templateColumns={{
                    base: "repeat(12, 1fr)",
                  }}
                >
                  <GridItem
                    style={{ alignSelf: "center" }}
                    colSpan={{
                      base: currentUser ? 4 : 6,
                    }}
                  >
                    <VStack style={{ alignItems: "flex-start" }}>
                      <Heading size="xs" textTransform="uppercase">
                        {item.title}
                      </Heading>

                      <Box>
                        <Text fontSize="sm">
                          <DateTimeFormatter
                            timeStamp={item.end_date}
                            type="date"
                          />{" "}
                          to{" "}
                          <DateTimeFormatter
                            timeStamp={item.end_date}
                            type="date"
                          />
                        </Text>
                      </Box>
                    </VStack>
                  </GridItem>

                  <GridItem
                    style={{ alignSelf: "center" }}
                    colSpan={{
                      base: currentUser ? 4 : 6,
                    }}
                  >
                    <VStack spacing={0} style={{ alignItems: "flex-start" }}>
                      {item.attachments.map((file, index) => (
                        <Link
                          isExternal
                          key={index}
                          href={`${process.env.REACT_APP_ROOT_ENDPOINT}${file.url}`}
                        >
                          <IconButton
                            variant="unstyled"
                            colorScheme="teal"
                            size="lg"
                            icon={<MdOutlineDescription />}
                            minW={5}
                            height={5}
                          />
                          {file.url.split("/").pop().replace(/%20/g, " ")}
                        </Link>
                      ))}
                    </VStack>
                  </GridItem>

                  {currentUser && (
                    <GridItem
                      style={{ alignSelf: "center", textAlign: "center" }}
                      colSpan={{
                        base: 4,
                      }}
                    >
                      <VStack style={{ alignItems: "flex-start" }}>
                        <Button
                          size="sm"
                          className="primary-button"
                          as={ReachLink}
                          to={`/events/${item.id}`}
                        >
                          {item.is_closed ? "View" : "Register"}
                        </Button>
                      </VStack>
                    </GridItem>
                  )}
                </Grid>
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

  return (
    <Card bg={backgroundColor} boxShadow={"lg"}>
      <CardHeader
        bg={useColorModeValue("#55624d", "gray.500")}
        color={useColorModeValue("white", "white")}
      >
        <Heading size="md">Upcoming Events</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {content}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default SimpleEventList;
