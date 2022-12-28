import { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  IconButton,
  ButtonGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useDeleteParticipantMutation } from "../redux/api/participantApi";
import ParticipantForm from "./ParticipantForm";
import Pagination from "./Pagination";
import ConfirmButton from "./ConfirmButton";

const CellFormater = ({ cell }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteParticipant, deleteResponse] = useDeleteParticipantMutation();

  switch (cell.column.columnDef.header) {
    case "Actions":
      return (
        <>
          <ButtonGroup variant="outline" spacing="1">
            <Tooltip label="Edit">
              <IconButton
                variant="outline"
                colorScheme="teal"
                icon={<FaEdit />}
                onClick={onOpen}
              />
            </Tooltip>

            <ConfirmButton
              headerText="Confirm?"
              bodyText="Are you sure you want to delete?"
              onSuccessAction={() => {
                deleteParticipant(cell.row.original.id);
              }}
              buttonText="Delete"
              buttonIcon={<FaTrashAlt />}
              isDanger={true}
              isLoading={deleteResponse.isLoading}
            />
          </ButtonGroup>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit</ModalHeader>
              <ModalCloseButton />
              <ParticipantForm data={cell.row.original} onClose={onClose} />
            </ModalContent>
          </Modal>
        </>
      );
    case "Name":
      let nameArray = cell.row.original.name.split(" ");
      return (
        <>
          <span
            className={
              "bold-text " +
              (cell.row.original.gender === "Brother"
                ? "brother-color"
                : "sister-color")
            }
          >
            {nameArray[0]}
          </span>
          <br />
          {nameArray.length > 1 && nameArray[1]}
        </>
      );
    case "Academic Year":
      return (
        <Text align="center">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Text>
      );
    default:
      return flexRender(cell.column.columnDef.cell, cell.getContext());
  }
};

const ParticipantTable = ({ data }) => {
  const columnHelper = createColumnHelper();
  const [sorting, setSorting] = useState([]);
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "ID",
    }),
    columnHelper.accessor("gender", {
      cell: (info) => info.getValue(),
      header: "Gender",
    }),
    columnHelper.accessor("english_name", {
      cell: (info) => info.getValue(),
      header: "English Name",
    }),
    columnHelper.accessor("chinese_name", {
      cell: (info) => info.getValue(),
      header: "Chinese Name",
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor("email", {
      cell: (info) => info.getValue(),
      header: "Email",
    }),
    columnHelper.accessor("phone", {
      cell: (info) => info.getValue(),
      header: "Phone",
    }),
    columnHelper.accessor("locality", {
      cell: (info) => info.getValue(),
      header: "Locality",
    }),
    columnHelper.accessor("college", {
      cell: (info) => info.getValue(),
      header: "College",
    }),
    columnHelper.accessor("academic_year", {
      cell: (info) => info.getValue(),
      header: "Academic Year",
    }),
    columnHelper.accessor("", {
      cell: () => {},
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
      columnVisibility: {
        id: false,
        gender: false,
        english_name: false,
        chinese_name: false,
      },
      pagination: { pageSize: 15 },
    },
  });

  let content;

  content = (
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

  return content;
};

export default ParticipantTable;
