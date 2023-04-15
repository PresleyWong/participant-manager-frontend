import {
  Grid,
  GridItem,
  Heading,
  CardBody,
  Stack,
  Box,
  Text,
  Spinner,
  Center,
  VStack,
  StackDivider,
  // Card,
  // CardHeader,
} from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom";

import { useGetEventsWithLimitQuery } from "../redux/api/eventApi";
import { AttachmentsList, CustomDateTimeFormat } from "../utils/Formatter";
import { Button, Card, CardHeader } from "./custom-component";

const SimpleEventList = ({ currentUser }) => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetEventsWithLimitQuery(12);

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
                          <CustomDateTimeFormat
                            timeStamp={item.end_date}
                            type="date"
                          />{" "}
                          to{" "}
                          <CustomDateTimeFormat
                            timeStamp={item.end_date}
                            type="date"
                          />
                        </Text>
                      </Box>
                    </VStack>
                  </GridItem>

                  <GridItem
                    colSpan={{
                      base: currentUser ? 4 : 6,
                    }}
                  >
                    <Center>
                      <AttachmentsList
                        filesArray={item.attachments}
                        isLink={true}
                      />
                    </Center>
                  </GridItem>

                  {currentUser && (
                    <GridItem
                      colSpan={{
                        base: 4,
                      }}
                    >
                      <VStack>
                        <Button
                          size="sm"
                          as={ReachLink}
                          to={`/events/${item.id}`}
                          variant="primary"
                          label={item.is_closed ? "View" : "Register"}
                        />
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
    <Card>
      <CardHeader>
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
