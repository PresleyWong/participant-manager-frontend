import { useGetAllEventsQuery } from "../redux/api/eventApi";
import EventTable from "../components/EventTable";
import {
  Spinner,
  Button,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Center,
} from "@chakra-ui/react";
import EventForm from "../components/EventForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import SimpleEventList from "../components/SimpleEventList";

const Events = () => {
  const { data, isLoading, isSuccess, isError, error } = useGetAllEventsQuery();
  const {
    isOpen: isOpenNew,
    onOpen: onOpenNew,
    onClose: onCloseNew,
  } = useDisclosure();
  const currentUser = useSelector(selectCurrentUser);
  let content;

  if (isSuccess) {
    if (currentUser.isAdmin) {
      content = (
        <>
          <Modal isOpen={isOpenNew} onClose={onCloseNew}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <EventForm createNew={true} onClose={onCloseNew} />
              </ModalBody>
            </ModalContent>
          </Modal>
          <EventTable data={data} />
          <Stack direction="row" spacing={4} mt={"1rem"} align="center">
            {currentUser.isAdmin && (
              <Button
                size="sm"
                className="primary-button"
                variant="solid"
                onClick={onOpenNew}
              >
                Create New Event
              </Button>
            )}
          </Stack>
        </>
      );
    } else {
      content = <SimpleEventList currentUser={currentUser} />;
    }
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

export default Events;
