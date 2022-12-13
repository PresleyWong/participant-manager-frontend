import { read, utils } from "xlsx";
import { useCreateNewEventMutation } from "../redux/api/eventApi";
import { useCreateNewParticipantMutation } from "../redux/api/participantApi";
import { useCreateNewUserMutation } from "../redux/api/userApi";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useRef } from "react";
import { ArrowUpIcon } from "@chakra-ui/icons";

const ImportButton = ({ model }) => {
  const [createEvent, responseEvent] = useCreateNewEventMutation();
  const [createParticipant, responseParticipant] =
    useCreateNewParticipantMutation();
  const [createUser, responseUser] = useCreateNewUserMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileRef = useRef(null);

  let createAction;
  switch (model) {
    case "event":
      createAction = createEvent;
    case "user":
      createAction = createUser;
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
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  let content = (
    <>
      <Button
        size="sm"
        leftIcon={<ArrowUpIcon />}
        className="primary-button"
        onClick={onOpen}
      >
        Import
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import File</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <input
              type="file"
              name="file"
              id="inputGroupFile"
              required
              ref={fileRef}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleImport}>
              ok
            </Button>
            <Button variant="ghost" ml={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
  return content;
};

export default ImportButton;
