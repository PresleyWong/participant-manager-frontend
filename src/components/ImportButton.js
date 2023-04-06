import { read, utils } from "xlsx";
import {
  Input,
  useDisclosure,
  useColorModeValue,
  Modal,
  ModalOverlay,
  // ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useRef } from "react";
import { MdOutlineFileUpload } from "react-icons/md";

import { useCreateNewEventMutation } from "../redux/api/eventApi";
import { useCreateNewParticipantMutation } from "../redux/api/participantApi";
import { useCreateNewUserMutation } from "../redux/api/userApi";
import { Button, ModalContent } from "./custom-component";

const ImportButton = ({ model }) => {
  const [createEvent, responseEvent] = useCreateNewEventMutation();
  const [createParticipant, responseParticipant] =
    useCreateNewParticipantMutation();
  const [createUser, responseUser] = useCreateNewUserMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileRef = useRef(null);

  const bgColor = useColorModeValue("transparent", "transparent");
  const textColor = useColorModeValue("#4E843B", "#80BA69");
  const borderColor = useColorModeValue("#4E843B", "#80BA69");

  let createAction;
  switch (model) {
    case "event":
      createAction = createEvent;
      break;
    case "user":
      createAction = createUser;
      break;
    default:
      createAction = createParticipant;
  }

  const handleImport = () => {
    if (fileRef) {
      const file = fileRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const jsonData = utils.sheet_to_json(wb.Sheets[sheets[0]]);

          jsonData.map((data) => {
            try {
              createAction({
                body: {
                  ...data,
                },
              });
            } catch (err) {
              alert(err.data.message);
            } finally {
              onClose();
            }
            return null;
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <Button
        size="sm"
        leftIcon={<MdOutlineFileUpload size={22} />}
        variant="primary"
        onClick={onOpen}
        label="Import"
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import File</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              sx={{
                "::file-selector-button": {
                  border: "1px",
                  borderColor: borderColor,
                  bg: bgColor,
                  color: textColor,
                  fontWeight: "600",
                  padding: "5px 10px",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                },
              }}
              variant="unstyled"
              type="file"
              id="inputGroupFile"
              required
              ref={fileRef}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="info" onClick={onClose} label="Close" />

            <Button
              variant="primary"
              ml={3}
              onClick={handleImport}
              label="Import"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImportButton;
