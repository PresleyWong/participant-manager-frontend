import { useState } from "react";
import { Link as ReachLink } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDeleteEventMutation } from "../redux/api/eventApi";
import EventForm from "./EventForm";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import Pagination from "./Pagination";
import { date } from "yup/lib/locale";

const CellFormater = ({ cell }) => {
  const [deleteEvent, deleleteResponse] = useDeleteEventMutation();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const dateTimeFormating = (timeStamp, type) => {
    let dateObj = new Date(timeStamp);

    switch (type) {
      case "date":
        return dateObj.toLocaleDateString("en-us", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      case "time":
        return dateObj.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      default:
        return null;
    }
  };

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
              onClick={() => deleteEvent(cell.row.original.id)}
            />
          </ButtonGroup>

          <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit</ModalHeader>
              <ModalCloseButton />
              <EventForm data={cell.row.original} onClose={onCloseEdit} />
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
    case "Start Date":
      return dateTimeFormating(cell.row.original.start_date, "date");
    case "End Date":
      return dateTimeFormating(cell.row.original.end_date, "date");
    case "Start Time":
      return dateTimeFormating(
        `${cell.row.original.start_date}T${cell.row.original.start_time}`,
        "time"
      );
    case "End Time":
      return dateTimeFormating(
        `${cell.row.original.end_date}T${cell.row.original.end_time}`,
        "time"
      );

    case "Created Time":
      return (
        <div className="datetime-break-line">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      );

    default:
      return flexRender(cell.column.columnDef.cell, cell.getContext());
  }
};

const EventTable = ({ data }) => {
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();
  const currentUser = useSelector(selectCurrentUser);

  let columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "ID",
    }),
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
      header: "Title",
    }),
    columnHelper.accessor("start_date", {
      cell: (info) => info.getValue(),
      header: "Start Date",
    }),
    columnHelper.accessor("end_date", {
      cell: (info) => info.getValue(),
      header: "End Date",
    }),
    columnHelper.accessor("start_time", {
      cell: (info) => info.getValue(),
      header: "Start Time",
    }),
    columnHelper.accessor("end_time", {
      cell: (info) => info.getValue(),
      header: "End Time",
    }),
    columnHelper.accessor("created_at", {
      cell: (info) => info.getValue(),
      header: "Created Time",
    }),
    columnHelper.accessor("actions", {
      cell: (info) => info.getValue(),
      header: "Actions",
    }),
  ];

  if (!currentUser.isAdmin) {
    columns = [
      columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
        header: "ID",
      }),
      columnHelper.accessor("title", {
        cell: (info) => info.getValue(),
        header: "Title",
      }),
      columnHelper.accessor("start_date", {
        cell: (info) => info.getValue(),
        header: "Start Date",
      }),
      columnHelper.accessor("end_date", {
        cell: (info) => info.getValue(),
        header: "End Date",
      }),
    ];
  }

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
      // columnVisibility: { id: false },
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

export default EventTable;
