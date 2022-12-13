import { useGetAllParticipantsQuery } from "../redux/api/participantApi";
import ParticipantTable from "../components/ParticipantTable";
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
import ParticipantForm from "../components/ParticipantForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";

const Participants = () => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetAllParticipantsQuery();
  const {
    isOpen: isOpenNew,
    onOpen: onOpenNew,
    onClose: onCloseNew,
  } = useDisclosure();
  const currentUser = useSelector(selectCurrentUser);

  let content;

  if (isSuccess) {
    content = (
      <>
        <Modal isOpen={isOpenNew} onClose={onCloseNew}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <ParticipantForm createNew={true} onClose={onCloseNew} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <ParticipantTable data={data} />
        <Stack direction="row" spacing={4} mt={"1rem"} align="center">
          {currentUser.isAdmin && (
            <Button
              size="sm"
              className="primary-button"
              variant="solid"
              onClick={onOpenNew}
            >
              Create New Participant
            </Button>
          )}
        </Stack>
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

export default Participants;
