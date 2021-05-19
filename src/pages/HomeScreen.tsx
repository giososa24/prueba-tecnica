import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, TextField } from '@material-ui/core';
import { DataGrid, GridRowsProp, GridColDef, GridFilterModel } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { useTask } from '../hooks/useTask';

const HomeScreen = () => {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    const initialForm = {
        nombre: '',
        descripcion: '',
        horas: 0,
        minutos: 0,
        segundos: 0
    }

    const { nombre, descripcion, horas, minutos, segundos, onChange } = useForm(initialForm);
    const { create } = useTask();


    const onSave = (e: any) => {
        handleClose();
        e.preventDefault();
        create(nombre, descripcion, horas, minutos, segundos);
    }

    return (
        <div style={{ padding: '3em' }}>
            <h1>Mis tareas</h1>
            <hr />

            <Fab color="primary"
                aria-label="add"
                size="small"
                style={{ marginTop: '5px', float: 'right' }}
                onClick={handleClickOpen}
            >
                <AddIcon />
            </Fab>

            <div>
                <Dialog open={open} fullWidth onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Crear nueva tarea</DialogTitle>
                    <DialogContent>
                        <form noValidate onSubmit={onSave}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Nombre"
                                type="text"
                                fullWidth
                                onChange={(e) => onChange(e.target.value, 'nombre')}
                            />
                            <TextField
                                margin="dense"
                                label="Descripción"
                                type="text"
                                fullWidth
                                multiline
                                rowsMax={4}
                                onChange={(e) => onChange(e.target.value, 'descripcion')}
                            />
                            <Grid container spacing={5}>
                                <Grid container item xs={4}>
                                    <TextField
                                        margin="dense"
                                        label="Horas"
                                        type="number"
                                        onChange={(e) => onChange(e.target.value, 'horas')}
                                    />
                                </Grid>
                                <Grid container item xs={4}>
                                    <TextField
                                        margin="dense"
                                        label="Minutos"
                                        type="number"
                                        onChange={(e) => onChange(e.target.value, 'minutos')}
                                    />
                                </Grid>
                                <Grid container item xs={4}>
                                    <TextField
                                        margin="dense"
                                        label="Segundos"
                                        type="number"
                                        onChange={(e) => onChange(e.target.value, 'segundos')}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancelar
                         </Button>
                        <Button onClick={onSave} color="primary">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

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
        </div >
    )
}

export default HomeScreen;


