import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, TextField } from '@material-ui/core';
import MaterialTable, { Column } from 'material-table';
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
    const [loading, setLoading] = useState(false);
    const [tareas, setTareas] = useState<Tarea[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const resp = await getByUser(1, 0, 0);        
        if(resp.data){
            resp.data.forEach((item) => {
                item.creadoString = moment(item.creado).locale('es-mx').format('L');
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
        setLoading(false);
        return resp;
    }

    const rows: Tarea[] = tareas;

    const columns: Column<Tarea>[] = [
        { field: 'nombre', title: 'Nombre', width: 250, filtering: true, sorting: true },
        { field: 'descripcion', title: 'Descripción', width: 300, sorting: true },
        { field: 'duracion', title: 'Duración', width: 150, sorting: true },
        { field: 'tiempo', title: 'Tiempo', width: 150, sorting: true },
        { field: 'estadoString', title: 'Estado', width: 150, sorting: true },
        { field: 'creadoString', title: 'Creado', width: 150, sorting: true },
        { field: 'terminado', title: 'Terminado', width: 150, sorting: true },
        
    ];

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
                <MaterialTable
                    columns={columns}
                    data={rows}
                    title="mis tareas"
                    isLoading={loading}
                    options={{
                        showTitle: false,
                        actionsColumnIndex: -1
                        //search: false,
                    }}
                    localization={{
                        header: {
                            actions: 'Acciones'
                        }
                    }}
                    actions={[
                        {
                            icon: 'edit',
                            tooltip:'Editar tarea',
                            onClick: (event, rowData) => {console.log(event, rowData)}
                        },
                        {
                            icon: 'delete',
                            tooltip:'Eliminar tarea',
                            onClick: (event, rowData) => {console.log(event, rowData)}
                        },
                    ]}
                />
            </div>
        </div >
    )
}

export default HomeScreen;


