import React, { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import { useAuth } from './../../../libs/context/AuthContext';

import TableSkeleton from '../TableSkeleton';
import * as Assets from '../../assets';
import Button from '../Button';
import { Tooltip } from '@mui/material';
import { Filter } from '..';
import { FilterConfig } from './../Filter/index';


interface ReactTableProps<T extends object> {
  data: T[];
  columns: any[];
  ColumnFiltersState?: [],
  loading: boolean;
  tableHeading: string;
  pageCount?: number;
  search?: string;
  filter?: string;
  filterConfig?: FilterConfig[]
  onFilterChange?: (filters: Record<string, any>) => void
  searchLabel?: string;
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
  tableHeadingColorClassName?: string;
  tableRowOnclickFunction?: (rowData: T) => void;
  pageSize: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
  currentPage: number;
  getRowTooltip?: (row: T) => string | null
  onDownloadCSV?: () => void
}

const Table: React.FC<any> = memo(<T extends object>({
  data,
  columns,
  loading = true,
  tableHeading,
  pageCount,
  search,
  filter = '',
  filterConfig = [],
  onFilterChange,
  globalFilter,
  setGlobalFilter,
  tableHeadingColorClassName = 'bg-gray-200',
  tableRowOnclickFunction = () => {},
  pageSize,
  onPageChange,
  totalRecords,
  currentPage,
  getRowTooltip,
  onDownloadCSV,
}: ReactTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [filters, setFilters] = useState<Record<string, any>>({});

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

  const totalPages = Math.ceil(totalRecords / pageSize);

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

  // const pageNumbers = useMemo(() => {
  //   const pages = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     pages.push(i);
  //   }
  //   return pages;
  // }, [totalPages]);

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
    ...columns
  ], [currentPage, pageSize, columns]);
  
  const table = useReactTable({
    data,
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    // console.log("New Filters:", newFilters);
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  }, [onFilterChange]);

  const clearFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };


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


  const renderRow = (row: any, index: number) => {
  const tooltipContent = getRowTooltip ? getRowTooltip(row.original) : null

  const rowContent = (
    <tr className="cursor-pointer" onClick={() => tableRowOnclickFunction(row.original)} key={row.id}>
      {row.getVisibleCells().map((cell: any) => (
        <td className="" key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )

  if (tooltipContent) {
    return (
      <Tooltip
        key={row.id}
        title={<div className="p-2">{tooltipContent}</div>}
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: "rgba(97, 97, 97, 0.92)",
              "& .MuiTooltip-arrow": {
                color: "rgba(97, 97, 97, 0.92)",
              },
              borderRadius: "4px",
              padding: "8px 12px",
              maxWidth: "300px",
            },
          },
        }}
      >
        {rowContent}
      </Tooltip>
    )
  }

  return rowContent
}


if (loading) {
  return <TableSkeleton />;
}

  return (
    <div className="relative mt-5 ce-table-holder hide-scrollbar">
      <h5 className="table-heading px-4">{tableHeading}</h5>
      <div className="flex flex-wrap justify-between items-end gap-4 px-4 mb-2">
          {/* <input type="text" placeholder="Search..." value={globalFilter ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)} className="border rounded-lg outline-none p-2"/> */}

        {/* {filterConfig.length > 0 && (
          <Filter config={filterConfig} onFilterChange={handleFilterChange} filters={filters} />
        )} */}

        {authState?.user?.userTypeId === 1 && (
          <div className='flex items-center justify-between gap-2 cursor-pointer text-sm text-blue-500/80 ml-0 lg:ml-2 underline underline-offset-1' onClick={onDownloadCSV}>
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
            {data?.length > 0 && (
              <tbody className="">
                {table.getRowModel().rows.map((row, index) => 
                  renderRow(row, index)
                )}
              </tbody>
            )}
          </table>
          {data?.length === 0 && (
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
          {data?.length === 0 && loading && (
            <table className="">
              <tbody className="flex items-center justify-center border py-10 w-full">
                <tr className="flex flex-col items-center justify-center w-full !bg-transparent">
                  <td className="border-0 !border-b-0">
                    {/* <img src={Assets.Icons.NoTableData} alt="" /> */}
                    <h5 className="">Loading</h5>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className='sticky left-0 right-0 mt-2 flex justify-end gap-2 px-4'>
        
        {/* <span className="text-sm text-gray-600 mr-10">
          Page {currentPage} of {totalPages}
        </span> */}
        
        <Button variant={currentPage === 1 ? 'custom' : 'black'} icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1.45rem' }} />} onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>

        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="text-sm text-gray-600 self-center align-middle">...</span>
          ) :
          (
            <Button
              key={`page-${page}-${index}`}
              variant={currentPage === page ? 'black' : 'custom'}
              label={page.toString()}
              onClick={() => handlePageChange(page as number)}
              className={currentPage === page ? 'active text-sm' : ''}
            />
          )
        ))}

        <Button variant={currentPage === totalPages ? 'custom' : 'black'} icon={<NavigateNextIcon sx={{ fontSize: '1.45rem' }} />} onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
});

export default Table;