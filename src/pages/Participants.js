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
import cloneDeep from "lodash.clonedeep";

import { useGetAllParticipantsQuery } from "../redux/api/participantApi";
import ParticipantTable from "../components/ParticipantTable";
import ParticipantForm from "../components/ParticipantForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import ImportButton from "../components/ImportButton";

export const AddParticipantButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ParticipantForm createNew={true} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Button size="sm" variant="primary" onClick={onOpen}>
        Add New Saint
      </Button>
    </>
  );
};

const Participants = () => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetAllParticipantsQuery();
  const currentUser = useSelector(selectCurrentUser);

  let content;

  if (isSuccess) {
    let customData = cloneDeep(data);
    customData.map((p) => {
      p["name"] = `${p.english_name} ${p.chinese_name}`;
      return null;
    });

    content = (
      <>
        <ParticipantTable data={customData} />
        <Stack direction="row" spacing={4} mt={"1rem"} align="center">
          <AddParticipantButton />
          {currentUser.isAdmin && <ImportButton />}
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
