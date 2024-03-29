import {
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Link,
} from "@chakra-ui/react";
import cloneDeep from "lodash.clonedeep";
import { MdOutlineFileDownload } from "react-icons/md";

import { useGetAllParticipantsQuery } from "../redux/api/participantApi";
import ParticipantTable from "../components/ParticipantTable";
import ParticipantForm from "../components/ParticipantForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import ImportButton from "../components/ImportButton";
import sampleCSV from "../assets/Sample.csv";
import { ModalContent, Button, Spinner } from "../components/custom-component";

export const AddParticipantButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Saint</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ParticipantForm createNew={true} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Button
        size="sm"
        variant="primary"
        onClick={onOpen}
        label="Add New Saint"
      />
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
        <Stack
          direction="row"
          spacing={4}
          mt={"1rem"}
          justify="space-between"
          width={"100%"}
        >
          <AddParticipantButton />

          <Stack direction="row" spacing={4}>
            <Link
              isExternal
              href={sampleCSV}
              _hover={{
                textDecorationLine: "none",
              }}
            >
              <Button
                leftIcon={<MdOutlineFileDownload size={22} />}
                variant="primary"
                size="sm"
                label="Sample.csv"
              />
            </Link>
            {currentUser.isAdmin && <ImportButton />}
          </Stack>
        </Stack>
      </>
    );
  } else if (isLoading) {
    content = <Spinner />;
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  }

  return content;
};

export default Participants;
