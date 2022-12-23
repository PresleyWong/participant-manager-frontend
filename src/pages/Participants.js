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
import ImportButton from "../components/ImportButton";
import cloneDeep from "lodash.clonedeep";

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
    let customData = cloneDeep(data);
    customData.map((p) => {
      p["name"] = `${p.english_name} ${p.chinese_name}`;
    });

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
        <ParticipantTable data={customData} />

        <Stack direction="row" spacing={4} mt={"1rem"} align="center">
          <Button
            size="sm"
            className="primary-button"
            variant="solid"
            onClick={onOpenNew}
          >
            Add New Saint
          </Button>
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
