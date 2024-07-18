import React from 'react';

const TableSkeleton = () => {
  return (
    <div className="mt-10 ce-table-holder">
      <table className="table-auto w-full border-collapse border-block ">
        <tbody className="[&>*:nth-child(odd)]:animate-shimmer bg-1000px [&>*:nth-child(odd)]:bg-shimmer">
          {Array.from({ length: 13 }, (_) => null).map((_, idx) => (
            <tr key={idx}>
              <td className="h-10 w-full animate-shimmer bg-1000px mb-3"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
