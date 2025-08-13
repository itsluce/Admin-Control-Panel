import React, { useState, useCallback } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import type {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  TextField,
  Typography,
  Chip,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import type { useProducts } from '../../hooks';
import type {Product} from "../../types";

interface ProductsTableProps {
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  productsHook: ReturnType<typeof useProducts>;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  onAddProduct,
  onEditProduct,
  productsHook,
}) => {
  const {
    products = [],
    total = 0,
    isLoading,
    error,
    loadProducts,
    deleteProduct,
  } = productsHook;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleSearch = useCallback(() => {
    loadProducts({
      search: searchTerm,
      page: 1,
      limit: paginationModel.pageSize,
      sortBy: sortModel[0]?.field || 'name',
      sortOrder: sortModel[0]?.sort || 'asc',
    });
  }, [searchTerm, paginationModel.pageSize, sortModel, loadProducts]);

  const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
    setPaginationModel(model);
    loadProducts({
      search: searchTerm,
      page: model.page + 1,
      limit: model.pageSize,
      sortBy: sortModel[0]?.field || 'name',
      sortOrder: sortModel[0]?.sort || 'asc',
    });
  }, [searchTerm, sortModel, loadProducts]);

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    setSortModel(model);
    loadProducts({
      search: searchTerm,
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      sortBy: model[0]?.field || 'name',
      sortOrder: model[0]?.sort || 'asc',
    });
  }, [searchTerm, paginationModel, loadProducts]);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      minWidth: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box className="flex justify-center items-center w-full h-full">
          <Typography variant="body2" className="font-semibold text-white text-center">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box className="flex justify-center items-center w-full h-full">
          <Typography variant="body2" className="text-gold-500 font-semibold text-center">
            ${params.value.toFixed(2)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box className="flex justify-center items-center w-full h-full">
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor: 'rgba(245, 197, 66, 0.2)',
              color: '#f5c542',
              border: '1px solid rgba(245, 197, 66, 0.3)',
            }}
          />
        </Box>
      ),
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const isLowStock = params.value < 20;
        return (
          <Box className="flex justify-center items-center w-full h-full">
            <Typography
              variant="body2"
              className={`text-center ${isLowStock ? 'text-red-400' : 'text-white'}`}
            >
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 250,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box className="flex justify-center items-center w-full h-full">
          <Typography
            variant="body2"
            className="text-gray-300 truncate text-center"
            title={params.value}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<Edit className="text-gold-500" size={16} />}
          label="Edit"
          onClick={() => onEditProduct(params.row as Product)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Trash2 className="text-red-400" size={16} />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row as Product)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <Typography
          variant="h4"
          component="h1"
          className="text-white font-bold"
        >
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={onAddProduct}
          sx={{
            background: 'linear-gradient(135deg, #f5c542 0%, #eab308 100%)',
            color: '#0a0a0a',
            '&:hover': {
              background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
            },
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Search */}
      <Box className="flex items-center space-x-2 mb-6">
        <TextField
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          variant="outlined"
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: 300 },
            flex: isMobile ? 1 : 'none',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(245, 197, 66, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(245, 197, 66, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#f5c542',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
          InputProps={{
            endAdornment: isMobile ? (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={handleSearch}
                  sx={{
                    color: '#f5c542',
                    '&:hover': {
                      backgroundColor: 'rgba(245, 197, 66, 0.1)',
                    },
                  }}
                >
                  <Search size={16} />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
        />
        {!isMobile && (
          <Button
            variant="outlined"
            startIcon={<Search size={16} />}
            onClick={handleSearch}
            sx={{
              borderColor: 'rgba(245, 197, 66, 0.5)',
              color: '#f5c542',
              '&:hover': {
                borderColor: '#f5c542',
                backgroundColor: 'rgba(245, 197, 66, 0.1)',
              },
            }}
          >
            Search
          </Button>
        )}
      </Box>

      {/* Error Display */}
      {error && (
        <Alert
          severity="error"
          className="mb-4"
          sx={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
          }}
        >
          {error.message}
        </Alert>
      )}

      {/* Data Grid */}
      <Box
        sx={{
          height: 600,
          width: '100%',
          '& .MuiDataGrid-root': {
            backgroundColor: 'rgba(31, 31, 31, 0.8)',
            border: '1px solid rgba(245, 197, 66, 0.2)',
            color: '#ffffff',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(245, 197, 66, 0.1)',
            borderBottom: '1px solid rgba(245, 197, 66, 0.3)',
            color: '#f5c542',
            fontWeight: 600,
          },
          '& .MuiDataGrid-columnHeader': {
            color: '#f5c542',
          },
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(245, 197, 66, 0.05)',
            },
          },
          '& .MuiDataGrid-cell': {
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(245, 197, 66, 0.3)',
            backgroundColor: 'rgba(245, 197, 66, 0.05)',
            color: '#ffffff',
          },
          '& .MuiTablePagination-root': {
            color: '#ffffff',
          },
          '& .MuiDataGrid-selectedRowCount': {
            color: '#ffffff',
          },
        }}
      >
        <DataGrid
          rows={products}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationMode="server"
          sortingMode="server"
          rowCount={total}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-loadingOverlay': {
              backgroundColor: 'rgba(31, 31, 31, 0.8)',
              color: '#f5c542',
            },
          }}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            backgroundColor: '#2a2a2a',
            border: '1px solid rgba(245, 197, 66, 0.2)',
          },
        }}
      >
        <DialogTitle className="text-white">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-gray-300">
            Are you sure you want to delete the product "{productToDelete?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            className="text-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};