import React, { ChangeEvent, useMemo, useState } from 'react';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import { useAuth } from './../../../libs/context/AuthContext';

import TableSkeleton from '../TableSkeleton';
import * as Assets from '../../assets';
import Button from '../Button';


interface ReactTableProps<T extends object> {
  data: T[];
  columns: any[];
  ColumnFiltersState?: [],
  loading: boolean;
  tableHeading: string;
  pageCount?: number;
  search?: string;
  filter?: string;
  searchLabel?: string;
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
  tableHeadingColorClassName?: string;
  tableRowOnclickFunction?: (rowData: T) => void;
  currentPage?: number; // Current page
  pageSize?: number; // Items per page
  onPageChange?: (page: number) => void; // Page change handler
}

const Table: React.FC<any> = <T extends object>({
  data,
  columns,
  loading = true,
  tableHeading,
  pageCount,
  search,
  filter = '',
  globalFilter,
  setGlobalFilter,
  tableHeadingColorClassName = 'bg-gray-200',
  tableRowOnclickFunction = () => {},
  currentPage = 1, // Default to page 1
  pageSize = 10, // Default to 10 items per page
  onPageChange, // Page change handler
}: ReactTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  const { authState } = useAuth();

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!searchQuery && !filter) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase()) || 
        value?.toString().toLowerCase().includes(filter.toLowerCase()) ||
        value?.toString().toLowerCase().includes(globalFilter?.toLowerCase())
      )
    );
  }, [data, searchQuery, filter, globalFilter]);

  const paginatedData = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData?.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const numberedColumns = useMemo<ColumnDef<T, any>[]>(() => [
    {
      id: 'rowNumber',
      header: 'S/N',
      cell: (info) => {
        const rowIndex = info.row.index;
        const rowNumber = (currentPage - 1) * pageSize + rowIndex + 1;
        return rowNumber;
      },
    },
    ...columns // Spread your existing columns here
  ], [currentPage, pageSize, columns]);
  
  const table = useReactTable({
    data: paginatedData,
    columns: numberedColumns,
    state: {
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount,
  });

  // const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   search && search(e.target.value) && setSearchQuery(e.target.value);
  //   console.log(search && search(e.target.value));
  // };



  const downloadCSV = () => {
    const headers = columns?.map((column) => column.header);
    const csvContent = [
      headers.join(','),
      ...filteredData?.map((row: any) =>
        columns.map((column: any) => {
          const value = row[column.accessorKey]
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        }).join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.setAttribute('href', url);
    link.setAttribute('download', `${tableHeading}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  if (loading) {
    return <TableSkeleton />;
  }
  return (
    <div className="relative mt-5 ce-table-holder hide-scrollbar">
      <h5 className="table-heading px-4">{tableHeading}</h5>
      <div className="flex justify-between items-center px-4 mb-2">
          <input type="text" placeholder="Search..." value={globalFilter ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)} className="border rounded-lg outline-none p-2"/>

          {authState?.user?.userTypeId === 1 && (
            <div className='flex items-center justify-between gap-2 cursor-pointer text-sm text-blue-500/80 ml-0 lg:ml-2 underline underline-offset-1' onClick={downloadCSV}>
              <CloudDownloadIcon sx={{ fontSize: "1rem" }} />
              <p>Download csv</p>
            </div>
          )}
      </div>
      <div className="overflow-x-auto">
        <div className="hide-scrollbar scroll-smooth">
          <table>
            <thead className={tableHeadingColorClassName}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                      <th className="!font-semibold" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender( header.column.columnDef.header, header.getContext() )}
                      </th>
                    ))}
                </tr>
              ))}
            </thead>
            {filteredData?.length > 0 && (
              <tbody className="">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    className="cursor-pointer"
                    onClick={() => tableRowOnclickFunction(row.original)}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className="" key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {paginatedData?.length === 0 && (
            <table className="">
              <tbody className="flex items-center justify-center border py-10 w-full">
                <tr className="flex flex-col items-center justify-center w-full !bg-transparent">
                  <td className="border-0 !border-b-0">
                    {/* <img src={Assets.Icons.NoTableData} alt="" /> */}
                    <h5 className="">No Data Yet</h5>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className='sticky left-0 right-0 mt-2 flex justify-end gap-2 px-4'>
        <span className="text-sm text-gray-600 mr-10">
          Page {currentPage} of {totalPages}
        </span>
        <Button variant={currentPage === 1 ? 'custom' : 'black'} icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1rem' }} />} onClick={() => onPageChange?.(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button variant={currentPage === totalPages ? 'custom' : 'black'} icon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} onClick={() => onPageChange?.(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Table;