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
  Tooltip,
  VStack,
  Text,
  Icon,
  Center,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { IoMdClose } from "react-icons/io";
import { MdArchive, MdUnarchive, MdLock, MdLockOpen } from "react-icons/md";
import { HiCheck } from "react-icons/hi";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

import {
  useDeleteEventMutation,
  useUpdateEventMutation,
} from "../redux/api/eventApi";
import EventForm from "./EventForm";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import Pagination from "./Pagination";
import ConfirmButton from "./ConfirmButton";
import DateTimeFormatter from "./DateTimeFormatter";

const CellFormater = ({ cell }) => {
  const [deleteEvent, deleleteResponse] = useDeleteEventMutation();
  const [updateLockEvent, updateLockResponse] = useUpdateEventMutation();
  const [updateArchiveEvent, updateArchiveResponse] = useUpdateEventMutation();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const onSwitch = async (id, item, updateAction) => {
    try {
      await updateAction({
        eventId: id,
        body: {
          toggle: item,
        },
      });
    } catch (err) {
      alert(err.data.message);
    }
  };

  switch (cell.column.columnDef.header) {
    case "Actions":
      let lockButton = (
        <Tooltip label="Close Registration">
          <IconButton
            variant="outline"
            colorScheme="teal"
            icon={<MdLock size={22} />}
            onClick={() =>
              onSwitch(cell.row.original.id, "is_closed", updateLockEvent)
            }
            isLoading={updateLockResponse.isLoading}
          />
        </Tooltip>
      );

      let archiveButton = (
        <Tooltip label="Archive">
          <IconButton
            variant="outline"
            colorScheme="teal"
            icon={<MdArchive size={22} />}
            onClick={() =>
              onSwitch(cell.row.original.id, "is_archived", updateArchiveEvent)
            }
            isLoading={updateArchiveResponse.isLoading}
          />
        </Tooltip>
      );

      if (cell.row.original.is_closed) {
        lockButton = (
          <Tooltip label="Open Registration">
            <IconButton
              variant="outline"
              colorScheme="teal"
              icon={<MdLockOpen size={22} />}
              onClick={() =>
                onSwitch(cell.row.original.id, "is_closed", updateLockEvent)
              }
              isLoading={updateLockResponse.isLoading}
            />
          </Tooltip>
        );
      }

      if (cell.row.original.is_archived) {
        archiveButton = (
          <Tooltip label="Unarchive">
            <IconButton
              variant="outline"
              colorScheme="teal"
              icon={<MdUnarchive size={22} />}
              onClick={() =>
                onSwitch(
                  cell.row.original.id,
                  "is_archived",
                  updateArchiveEvent
                )
              }
              isLoading={updateArchiveResponse.isLoading}
            />
          </Tooltip>
        );
      }

      return (
        <>
          <ButtonGroup variant="outline" spacing="1">
            <Tooltip label="Edit">
              <IconButton
                variant="outline"
                colorScheme="teal"
                icon={<FaEdit />}
                onClick={onOpenEdit}
              />
            </Tooltip>

            {archiveButton}
            {lockButton}

            <ConfirmButton
              headerText="Delete Event"
              bodyText="Are you sure you want to delete event?"
              onSuccessAction={() => {
                deleteEvent(cell.row.original.id);
              }}
              buttonText="Delete"
              buttonIcon={<FaTrashAlt />}
              isDanger={true}
              isLoading={deleleteResponse.isLoading}
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
      return (
        <DateTimeFormatter
          timeStamp={cell.row.original.start_date}
          type="date"
        />
      );
    case "End Date":
      return (
        <DateTimeFormatter timeStamp={cell.row.original.end_date} type="date" />
      );
    case "Start Time":
      return (
        <DateTimeFormatter
          timeStamp={`${cell.row.original.start_date}T${cell.row.original.start_time}`}
          type="time"
        />
      );
    case "End Time":
      return (
        <DateTimeFormatter
          timeStamp={`${cell.row.original.end_date}T${cell.row.original.end_time}`}
          type="time"
        />
      );
    case "Created Time":
      return (
        <div className="datetime-break-line">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      );
    case "Attachments":
      return (
        <VStack align={"left"}>
          {cell.row.original.attachments.map((file, index) => (
            <Text key={index}>
              {file.url.split("/").pop().replace(/%20/g, " ")}
            </Text>
          ))}
        </VStack>
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
    columnHelper.accessor("", {
      cell: () => {},
      header: "Attachments",
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

export default EventTable;
