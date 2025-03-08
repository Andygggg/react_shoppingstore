import { FC } from 'react';
import styles from "@/styles/Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    pages.push(1);
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 2) {
        pages.push(i);
      } else if (i === currentPage - 1 && i > 2) {
        pages.push('...');
        pages.push(i);
      } else {
        pages.push(i);
      }
    }
    
    if (totalPages > 1) {
      if (currentPage + 1 < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.pageControls}>
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
         <i className='bx bx-chevron-left' ></i>
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            className={`${styles.pageButton} ${
              page === currentPage ? styles.active : ''
            } ${typeof page === 'string' ? styles.dots : ''}`}
            disabled={typeof page === 'string'}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          <i className='bx bx-chevron-right'></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;