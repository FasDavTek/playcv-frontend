import React, { ChangeEvent, useMemo, useState } from 'react';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
}: ReactTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] = useState([]);

  const filteredData = useMemo(() => {
    if (!searchQuery && !filter) return data;
    console.log(data);
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase()) || 
        value?.toString().toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, searchQuery, filter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
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

  if (loading) {
    return <TableSkeleton />;
  }
  return (
    <div className="relative mt-5 ce-table-holder hide-scrollbar">
      <h5 className="table-heading px-4">{tableHeading}</h5>
      <div className="flex justify-between items-center px-4 mb-2">
          <input type="text" placeholder="Search..." value={globalFilter ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)} className="border rounded-lg outline-none p-2"/>
      </div>
      <table>
        <thead className={tableHeadingColorClassName}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(
                (
                  header //style={{ width: header.column.columnDef.meta?.width }}
                ) => (
                  <th
                    className="!font-semibold"
                    key={header.id}
                    // style={{ width: header.column.columnDef.meta?.width }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                )
              )}
            </tr>
          ))}
        </thead>
        {filteredData.length > 0 && (
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
      {paginatedData.length === 0 && (
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
      <div className='sticky left-0 right-0 mt-2 flex justify-end gap-2 px-4'>
        <Button variant={currentPage === 1 ? 'custom' : 'black'} icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1rem' }} />} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button variant={currentPage === totalPages ? 'custom' : 'black'} icon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Table;
=======
export default Table;


























// import React, { useMemo, useState } from 'react';
// import { flexRender, getCoreRowModel, useReactTable, } from '@tanstack/react-table';
// import type { ColumnDef } from '@tanstack/react-table';

// import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// import TableSkeleton from '../TableSkeleton';
// import * as Assets from '../../assets';
// import Button from '../Button';


// interface ReactTableProps<T extends object> {
//   data: T[];
//   columns: ColumnDef<T, any>[];
//   loading: boolean;
//   tableHeading: string;
//   tableHeadingColorClassName?: string;
//   tableRowOnclickFunction?: (rowData: T) => void;
// }

// const Table: React.FC<any> = <T extends object>({
//   data,
//   columns,
//   loading = true,
//   tableHeading,
//   tableHeadingColorClassName = 'bg-gray-200',
//   tableRowOnclickFunction = () => {},
// }: ReactTableProps<T>) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const filteredData = useMemo(() => {
//     if (!searchQuery) return data;
//     return data.filter((item) =>
//       Object.entries(item).some(([key, value]) => {
//         if (typeof value === "string" || typeof value === "number") {
//           return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
//         }
//         return false;
//       })
//     );
//   }, [data, searchQuery]);

//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     return filteredData.slice(startIndex, endIndex);
//   }, [filteredData, currentPage, pageSize]);

//   const totalPages = Math.ceil(filteredData.length / pageSize);

//   const numberedColumns = useMemo<ColumnDef<T, any>[]>(() => [
//     {
//       id: 'rowNumber',
//       header: 'S/N',
//       cell: (info) => {
//         const rowIndex = info.row.index;
//         const rowNumber = (currentPage - 1) * pageSize + rowIndex + 1;
//         return rowNumber;
//       },
//     },
//     ...columns // Spread your existing columns here
//   ], [currentPage, pageSize, columns]);
  
//   const table = useReactTable({
//     data: paginatedData,
//     columns: numberedColumns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//     setCurrentPage(1);
//   };

//   if (loading) {
//     return <TableSkeleton />;
//   }

//   return (
//     <div className="relative mt-5 ce-table-holder hide-scrollbar">
//       <h5 className="table-heading px-4">{tableHeading}</h5>
//       <div className="flex justify-between items-center px-4 mb-2">
//         <input type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchChange} className="border rounded-lg outline-none p-2"/>
//       </div>
//       <table>
//         <thead className={tableHeadingColorClassName}>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map(
//                 (
//                   header //style={{ width: header.column.columnDef.meta?.width }}
//                 ) => (
//                   <th
//                     className="!font-semibold"
//                     key={header.id}
//                     // style={{ width: header.column.columnDef.meta?.width }}
//                   >
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </th>
//                 )
//               )}
//             </tr>
//           ))}
//         </thead>
//         {filteredData.length > 0 ? (
//           <tbody className="">
//             {table.getRowModel().rows.map((row) => (
//               <tr
//                 className="cursor-pointer"
//                 onClick={() => tableRowOnclickFunction(row.original)}
//                 key={row.id}
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <td className="" key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         ) : (
//           <tbody className="flex items-center justify-center border py-10 w-full">
//             <tr className="flex flex-col items-center justify-center w-full !bg-transparent">
//               <td className="border-0 !border-b-0">
//                 {/* <img src={Assets.Icons.NoTableData} alt="" /> */}
//                 <h5 className="">No Data Yet</h5>
//               </td>
//             </tr>
//           </tbody>
//         )}
//       </table>
//       {/* {filteredData.length === 0 && (
        
//       )} */}
//       <div className='sticky left-0 right-0 mt-2 flex justify-end gap-2 px-4'>
//         <div>
//           Showing {paginatedData.length} of {filteredData.length} results
//         </div>
//         <div className='flex gap-2'>
//           <Button variant={currentPage === 1 ? 'custom' : 'black'} icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1rem' }} />} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
//             Previous
//           </Button>
//           <Button variant={currentPage === totalPages ? 'custom' : 'black'} icon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Table;
>>>>>>> bb7953228a3b4517bf401166d99b77c2680a2274
