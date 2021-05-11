import { DataGrid, GridRowsProp, GridColDef, GridFilterModel } from '@material-ui/data-grid';

const HomeScreen = () => {

    const rows: GridRowsProp = [
        { id: 1, col1: 'Hello', col2: 'World' },
        { id: 2, col1: 'XGrid', col2: 'is Awesome' },
        { id: 3, col1: 'Material-UI', col2: 'is Amazing' },
    ];

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Column 1', width: 500, editable: true, filterable: true,  },
        { field: 'col2', headerName: 'Column 2', width: 500, editable: true },
    ];

    const riceFilterModel: GridFilterModel = {
        items: [{ columnField: 'col1', operatorValue: 'contains', value: '' }],
      };

    return (
        <div>
            <h1>Home Screen</h1>
            <hr />

            <div style={{ height: 300, width: '100%' }}>
                <DataGrid autoHeight rows={rows} columns={columns} filterModel={riceFilterModel} />
            </div>
        </div>
    )
}

export default HomeScreen;
