import { useGetAllUsersQuery } from "../redux/api/userApi";
import UserTable from "../components/UserTable";
import {
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import UserForm from "../components/UserForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { ModalContent, Button, Spinner } from "../components/custom-component";

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
            <ModalHeader>New Serving One</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <UserForm createNew={true} onClose={onCloseNew} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <UserTable data={data} />
        <Stack direction="row" mt={"1rem"} justify={"flex-start"} width="100%">
          {currentUser.isAdmin && (
            <Button
              size="sm"
              variant="primary"
              onClick={onOpenNew}
              label="Add New Serving One"
            />
          )}
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

export default Users;
