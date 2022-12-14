import { useState } from "react";
import { Link as ReachLink } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  chakra,
  Button,
  IconButton,
  ButtonGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { HiCheck } from "react-icons/hi";
import { useDeleteUserMutation } from "../redux/api/userApi";
import UserForm from "./UserForm";
import Pagination from "./Pagination";

const CellFormater = ({ cell }) => {
  const [deleteUser, deleleteResponse] = useDeleteUserMutation();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  switch (cell.column.columnDef.header) {
    case "Actions":
      return (
        <>
          <ButtonGroup variant="outline" spacing="1">
            <IconButton
              variant="outline"
              colorScheme="teal"
              icon={<FaEdit />}
              onClick={onOpenEdit}
            />

            <IconButton
              variant="outline"
              colorScheme="teal"
              icon={<FaTrashAlt />}
              isLoading={deleleteResponse.isLoading}
              onClick={() => deleteUser(cell.row.original.id)}
            />
          </ButtonGroup>

          <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit</ModalHeader>
              <ModalCloseButton />
              <UserForm data={cell.row.original} onClose={onCloseEdit} />
            </ModalContent>
          </Modal>
        </>
      );
    case "Title":
      return (
        <Button
          size="sm"
          className="primary-button"
          as={ReachLink}
          to={`${cell.row.original.id}`}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Button>
      );
    case "Created Time":
      return (
        <div className="datetime-break-line">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      );
    case "Last Update":
      return (
        <div className="datetime-break-line">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      );
    case "Is Admin?":
      return (
        <Icon
          boxSize={5}
          as={cell.row.original.is_admin ? HiCheck : IoMdClose}
        />
      );
    default:
      return flexRender(cell.column.columnDef.cell, cell.getContext());
  }
};

const UserTable = ({ data }) => {
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();

  let columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "ID",
    }),
    columnHelper.accessor("email", {
      cell: (info) => info.getValue(),
      header: "Email",
    }),
    columnHelper.accessor("locality", {
      cell: (info) => info.getValue(),
      header: "Locality",
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor("is_admin", {
      cell: (info) => info?.getValue()?.toString(),
      header: "Is Admin?",
    }),
    columnHelper.accessor("created_at", {
      cell: (info) => info.getValue(),
      header: "Created Time",
    }),
    columnHelper.accessor("updated_at", {
      cell: (info) => info.getValue(),
      header: "Last Update",
    }),
    columnHelper.accessor("actions", {
      cell: (info) => info.getValue(),
      header: "Actions",
    }),
  ];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    initialState: {
      columnVisibility: { id: false },
      pagination: { pageSize: 15 },
    },
  });

  return (
    <>
      <Table variant="striped" size="small" boxShadow={"lg"}>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta;
                return (
                  <Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    isNumeric={meta?.isNumeric}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    <chakra.span pl="4">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === "desc" ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row, index) => (
            <Tr key={index}>
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta;
                return (
                  <Td key={cell.id} isNumeric={meta?.isNumeric}>
                    <CellFormater cell={cell} />
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination table={table} />
    </>
  );
};

export default UserTable;
