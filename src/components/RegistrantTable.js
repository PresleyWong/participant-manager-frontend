import { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Spinner,
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
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useRemoveParticipantFromEventMutation } from "../redux/api/eventApi";
import ParticipantForm from "./ParticipantForm";
import Pagination from "./Pagination";

const CellFormater = ({ cell }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [removeParticipant, removeResponse] =
    useRemoveParticipantFromEventMutation();

  switch (cell.column.columnDef.header) {
    case "Actions":
      return (
        <>
          <ButtonGroup variant="outline" spacing="1">
            <IconButton
              variant="outline"
              colorScheme="teal"
              icon={<FaEdit />}
              onClick={onOpen}
            />

            <IconButton
              variant="outline"
              colorScheme="teal"
              icon={<FaTrashAlt />}
              isLoading={removeResponse.isLoading}
              onClick={() =>
                removeParticipant({
                  eventId: cell.row.original.event_id,
                  participantId: cell.row.original.id,
                })
              }
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
    case "Registered Time":
      return (
        <div className="datetime-break-line">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      );
    case "English Name":
      return (
        <span className="bold-text">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </span>
      );
    case "Name":
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
            {cell.row.original.english_name}
          </span>
          <br />
          {cell.row.original.chinese_name}
        </>
      );

    default:
      return flexRender(cell.column.columnDef.cell, cell.getContext());
  }
};

const RegistrantTable = ({ data }) => {
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
    columnHelper.accessor("language", {
      cell: (info) => info.getValue(),
      header: "Language",
    }),
    columnHelper.accessor("register_time", {
      cell: (info) => info.getValue(),
      header: "Registered Time",
    }),
    columnHelper.accessor("college", {
      cell: (info) => info.getValue(),
      header: "College",
    }),
    columnHelper.accessor("academic_year", {
      cell: (info) => info.getValue(),
      header: "Academic Year",
    }),
    columnHelper.accessor("server", {
      cell: (info) => info.getValue(),
      header: "Registered By",
    }),
    columnHelper.accessor("remarks", {
      cell: (info) => info.getValue(),
      header: "Remarks",
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

export default RegistrantTable;