import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Spinner,
  Box,
  VStack,
  Stack,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Center,
} from "@chakra-ui/react";
import { useGetEventDetailWithAppointmentsQuery } from "../redux/api/eventApi";
import RegistrantTable from "../components/RegistrantTable";
import ParticipantSearch from "../components/ParticipantSearch";
import ImportButton from "../components/ImportButton";
import ExportButton from "../components/ExportButton";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";

const EventDetail = () => {
  const { eventId } = useParams();
  const { data, isLoading, isSuccess, isError, error } =
    useGetEventDetailWithAppointmentsQuery(eventId);
  const currentUser = useSelector(selectCurrentUser);
  let mainContent;

  if (isSuccess) {
    const filteredData = data.participants.map(
      ({
        id,
        created_at,
        updated_at,
        event_id,
        server,
        register_date,
        locality,
        ...item
      }) => item
    );

    mainContent = (
      <>
        <Stack spacing="24px">
          <VStack>
            <p className="event-title">{data.event.title}</p>
          </VStack>

          <ParticipantSearch eventId={data.event.id} />

          <VStack>
            <Box className="align-left">
              <p>Registrants</p>
            </Box>

            <RegistrantTable data={data.participants} />
          </VStack>
        </Stack>
        {currentUser.isAdmin && (
          <Stack direction="row" spacing={4} mt={"1rem"} align="center">
            <ExportButton
              apiArray={filteredData}
              fileName={"participant_export.xls"}
              buttonTitle={"Export"}
            />
            <ImportButton />
          </Stack>
        )}
      </>
    );
  } else if (isLoading) {
    mainContent = (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (isError) {
    mainContent = <div>{error.toString()}</div>;
  }

  return mainContent;
};

export default EventDetail;
