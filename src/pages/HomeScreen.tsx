import { Fab } from '@material-ui/core';
import { DataGrid, GridRowsProp, GridColDef, GridFilterModel } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';

const HomeScreen = () => {

    const rows: GridRowsProp = [
        { id: 1, col1: 'Hello', col2: 'World' },
        { id: 2, col1: 'XGrid', col2: 'is Awesome' },
        { id: 3, col1: 'Material-UI', col2: 'is Amazing' },
    ];

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Column 1', width: 500, editable: true, filterable: true, },
        { field: 'col2', headerName: 'Column 2', width: 500, editable: true },
    ];

    const riceFilterModel: GridFilterModel = {
        items: [{ columnField: 'col1', operatorValue: 'contains', value: '' }],
    };

    return (
        <div style={{ padding: '3em' }}>
            <h1>Mis tareas</h1>
            <hr />

            <Fab color="primary" aria-label="add" size="small" style={{ marginTop: '5px', float: 'right' }} >
                <AddIcon />
            </Fab>
            <div style={{ width: '100%', marginTop: '65px' }}>
                <DataGrid 
                    autoHeight 
                    rows={rows} 
                    columns={columns} 
                    filterModel={riceFilterModel} 
                    pageSize={rows.length}
                    rowsPerPageOptions={[5, 10, 20]}
                    
                />
            </div>
        </div>
    )
}

export default HomeScreen;
