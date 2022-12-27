import { Box } from "@chakra-ui/layout";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";

const ConfirmButton = ({
  onSuccessAction,
  buttonText,
  buttonIcon,
  headerText,
  bodyText,
  isDanger,
  isLoading,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = () => {
    onSuccessAction();
    onClose();
  };

  const ActionButton = () => {
    let customButton;

    if (buttonIcon)
      customButton = (
        <IconButton
          variant="outline"
          colorScheme={isDanger ? "red" : ""}
          icon={buttonIcon}
          onClick={onOpen}
          isLoading={isLoading}
        />
      );
    else
      customButton = (
        <Button onClick={onOpen} colorScheme={isDanger ? "red" : ""}>
          {buttonText}
        </Button>
      );

    return customButton;
  };

  return (
    <>
      <ActionButton />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{headerText}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>{bodyText}</Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr={3}>
              Close
            </Button>
            <Button colorScheme={isDanger ? "red" : ""} onClick={onSubmit}>
              {buttonText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ConfirmButton;
