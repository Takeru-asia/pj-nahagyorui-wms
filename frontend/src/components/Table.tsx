import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: TableProps) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TableBody({ children }: TableProps) {
  return <tbody className="divide-y divide-gray-200">{children}</tbody>;
}

export function TableRow({ children }: TableProps) {
  return <tr className="hover:bg-gray-50">{children}</tr>;
}

interface TableCellProps {
  children: ReactNode;
  header?: boolean;
  className?: string;
  colSpan?: number;
}

export function TableCell({ children, header = false, className = '', colSpan }: TableCellProps) {
  const baseClasses = 'px-4 py-3 text-sm';
  const headerClasses = 'font-medium text-gray-700 text-left';
  const cellClasses = 'text-gray-900';

  if (header) {
    return <th className={`${baseClasses} ${headerClasses} ${className}`} colSpan={colSpan}>{children}</th>;
  }
  return <td className={`${baseClasses} ${cellClasses} ${className}`} colSpan={colSpan}>{children}</td>;
}
