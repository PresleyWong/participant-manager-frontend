import { useGetAllUsersQuery } from "../redux/api/userApi";
import UserTable from "../components/UserTable";
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
import UserForm from "../components/UserForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";

const Users = () => {
  const { data, isLoading, isSuccess, isError, error } = useGetAllUsersQuery();
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
              <UserForm createNew={true} onClose={onCloseNew} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <UserTable data={data} />
        <Stack direction="row" spacing={4} mt={"1rem"} align="center">
          {currentUser.isAdmin && (
            <Button
              size="sm"
              className="primary-button"
              variant="solid"
              onClick={onOpenNew}
            >
              Create New User
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

export default Users;
