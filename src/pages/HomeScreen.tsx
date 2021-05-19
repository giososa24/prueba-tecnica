import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, TextField } from '@material-ui/core';
import { DataGrid, GridRowsProp, GridColDef, GridFilterModel } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import moment from 'moment';
import { useForm } from '../hooks/useForm';
import { useTask } from '../hooks/useTask';
import Tarea from '../interfaces/tarea';

const HomeScreen = () => {

    const initialForm = {
        nombre: '',
        descripcion: '',
        horas: 0,
        minutos: 0,
        segundos: 0
    }

    const { form, onChange } = useForm(initialForm);
    const { create, getByUser } = useTask();
    const [open, setOpen] = useState(false);
    const [tareas, setTareas] = useState<Tarea[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const resp = await getByUser(1, 0, 0);        
        if(resp.data){
            resp.data.forEach((item, index) => {
                item.id = index;
                item.creadoString = moment(item.creado).format('L');
                item.duracion = `${item.horas}:${item.minutos}:${item.segundos}`;
                item.tiempo = `${item.tiempoHoras}:${item.tiempoMinutos}:${item.tiempoSegundos}`;
                if(item.estado === 0){
                    item.estadoString = 'Por iniciar'
                }
                if(item.estado === 1) {
                    item.estadoString = 'En curso';
                }
                if(item.estado === 2) {
                    item.estadoString = 'Pausado';
                }
                if(item.estado === 3){
                    item.estadoString = 'Finalizado';
                }
            });
            setTareas(resp.data);
        }        
        
        return resp;
    }

    const rows: GridRowsProp = tareas;

    const columns: GridColDef[] = [
        { field: 'nombre', headerName: 'Nombre', width: 250, editable: true, filterable: true, },
        { field: 'descripcion', headerName: 'Descripción', width: 300, editable: true },
        { field: 'duracion', headerName: 'Duración', width: 150, editable: true },
        { field: 'tiempo', headerName: 'Tiempo', width: 150, editable: true },
        { field: 'estadoString', headerName: 'Estado', width: 150, editable: true },
        { field: 'creadoString', headerName: 'Creado', width: 150, editable: true },
        { field: 'terminado', headerName: 'Terminado', width: 150, editable: true },
    ];

    const riceFilterModel: GridFilterModel = {
        items: [{ columnField: 'col1', operatorValue: 'contains', value: '' }],
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSave = (e: any) => {
        handleClose();
        e.preventDefault();
        create(form);
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


