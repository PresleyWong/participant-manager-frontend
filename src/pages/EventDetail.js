import { useParams } from "react-router-dom";
import { Spinner, Box, VStack, Stack, Center, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import cloneDeep from "lodash.clonedeep";

import { useGetEventDetailWithAppointmentsQuery } from "../redux/api/eventApi";
import RegistrantTable from "../components/RegistrantTable";
import ParticipantSearch from "../components/ParticipantSearch";
import ExportButton from "../components/ExportButton";
import { selectCurrentUser } from "../redux/features/auth/authSlice";

const EventDetail = () => {
  const { eventId } = useParams();
  const { data, isLoading, isSuccess, isError, error } =
    useGetEventDetailWithAppointmentsQuery(eventId);
  const currentUser = useSelector(selectCurrentUser);
  let mainContent;
  let eventParticipants = [];
  let eventParticipantsWithAppointments = [];

  if (isSuccess) {
    let customData = cloneDeep(data);

    customData.participants.map((p) => {
      eventParticipants.push(p.id);
      eventParticipantsWithAppointments.push(p);
      p["name"] = `${p.english_name} ${p.chinese_name}`;
    });

    const exportData = data.participants.map(
      ({
        id,
        created_at,
        updated_at,
        event_id,
        server,
        appointment_id,
        register_time,
        ...item
      }) => item
    );

    mainContent = (
      <>
        <Stack spacing="24px">
          <VStack>
            <p className="event-title">{data.event.title}</p>
          </VStack>

          <ParticipantSearch
            eventDetail={data.event}
            eventParticipants={eventParticipants}
            eventParticipantsWithAppointments={
              eventParticipantsWithAppointments
            }
          />

          <VStack>
            <Box className="align-left">
              <Text as="b">Registrants</Text>
            </Box>

            <RegistrantTable
              data={customData.participants}
              eventClosed={customData.event.is_closed}
            />
          </VStack>
        </Stack>
        {currentUser.isAdmin && (
          <Stack direction="row" spacing={4} mt={"1rem"} align="center">
            <ExportButton
              apiArray={exportData}
              fileName={"participant_export.xls"}
              buttonTitle={"Export"}
            />
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
