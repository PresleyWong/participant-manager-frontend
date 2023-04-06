import { Box } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Button, IconButton, ModalContent } from "./custom-component";

const ConfirmButton = ({
  onSuccessAction,
  buttonText,
  buttonIcon,
  headerText,
  bodyText,
  isDanger,
  isLoading,
  isDisabled = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = () => {
    onSuccessAction();
    onClose();
  };

  let customButton;

  if (buttonIcon)
    customButton = (
      <IconButton
        variant={isDanger ? "errorOutline" : "primaryOutline"}
        icon={buttonIcon}
        onClick={onOpen}
        isLoading={isLoading}
        isDisabled={isDisabled}
        tooltipLabel={buttonText}
      ></IconButton>
    );
  else
    customButton = (
      <Button
        onClick={onOpen}
        variant={isDanger ? "errorOutline" : "primaryOutline"}
        isDisabled={isDisabled}
        label={buttonText}
      />
    );

  return (
    <>
      {customButton}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{headerText}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>{bodyText}</Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="primary" onClick={onClose} mr={3} label="Close" />

            <Button
              border="1px"
              variant={isDanger ? "errorOutline" : "primary"}
              onClick={onSubmit}
              label={buttonText}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ConfirmButton;
