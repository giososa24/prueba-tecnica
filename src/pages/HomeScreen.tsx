import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import AddIcon from '@material-ui/icons/Add';
import { useForm } from '../hooks/useForm';
import { useTask } from '../hooks/useTask';
import Tarea from '../interfaces/tarea';
import { columnsTask } from '../types/types';
import { prepareDataTask } from '../functions/prepareDataTask';
import { confirmDialg } from '../functions/Swal';

const HomeScreen = () => {

    const filters = {
        page: 1,
        pageNumber: 5,
        totalPages: 0,
        estado: 0,
        duracion: 0,
    }
    const initialForm = {
        _id: '',
        nombre: '',
        descripcion: '',
        horas: 0,
        minutos: 0,
        segundos: 0
    }
    const [pagination, setPagination] = useState(filters);
    const [handleUpdate, setHandleUpdate] = useState(false);
    const { form, onChange } = useForm(initialForm);
    const { getByUser, create, update, Delete } = useTask();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tareas, setTareas] = useState<Tarea[]>([]);

    useEffect(() => {
        const { page, pageNumber, estado, duracion } = filters;
        loadData(page, pageNumber, estado, duracion);
    }, []);

    const loadData = async (page: number, limit: number, estado: number, duracion: number) => {
        setLoading(true);
        const resp = await getByUser(page, limit, estado, duracion);
        if (resp.data) {
            setTareas(prepareDataTask(resp.data));
            if (resp.pagination) {
                setPagination({
                    page: resp.pagination?.page,
                    pageNumber: resp.pagination?.limit,
                    totalPages: resp.pagination?.totalDocs,
                    estado: 0,
                    duracion: 0
                });
            }
        }
        setLoading(false);
    }

    const onPage = async (page: number, pageNumber: number) => {
        const { estado, duracion } = filters;
        loadData(page, pageNumber, estado, duracion);
    }

    const handleClickOpen = () => {
        form.nombre = '';
        form.descripcion = '';
        form.horas = 0;
        form.minutos = 0;
        form.segundos = 0;
        setOpen(true);
        setHandleUpdate(false);
    };

    const onSave = async (e: any) => {
        const { page, pageNumber, estado, duracion } = filters;

        setOpen(false);
        e.preventDefault();
        await create(form);
        await loadData(page, pageNumber, estado, duracion);
    }

    const handleOpenUpdate = (rowData: Tarea) => {
        setOpen(true);
        setHandleUpdate(true);
        form._id = rowData._id!;
        form.nombre = rowData.nombre;
        form.descripcion = rowData.descripcion;
        form.horas = rowData.horas;
        form.minutos = rowData.minutos;
        form.segundos = rowData.segundos;
    }

    const onUpdate = async (e: any) => {
        const { page, pageNumber, estado, duracion } = filters;

        setOpen(false);
        e.preventDefault();
        await update(form);
        await loadData(page, pageNumber, estado, duracion);
    }

    const onDelete = async (rowData: Tarea) => {
        const { page, pageNumber, estado, duracion } = filters;

        if (await confirmDialg()) {
            await Delete(rowData._id!);
            await loadData(page, pageNumber, estado, duracion);
        }
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
                <Dialog open={open} fullWidth onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{handleUpdate ? 'Actualizar tarea' : 'Crear nueva tarea'}</DialogTitle>
                    <DialogContent>
                        <form noValidate onSubmit={onSave}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Nombre"
                                type="text"
                                value={form.nombre}
                                fullWidth
                                onChange={(e) => onChange(e.target.value, 'nombre')}
                            />
                            <TextField
                                margin="dense"
                                label="Descripción"
                                type="text"
                                value={form.descripcion}
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
                                        value={form.horas}
                                        onChange={(e) => onChange(e.target.value, 'horas')}
                                    />
                                </Grid>
                                <Grid container item xs={4}>
                                    <TextField
                                        margin="dense"
                                        label="Minutos"
                                        type="number"
                                        value={form.minutos}
                                        onChange={(e) => onChange(e.target.value, 'minutos')}
                                    />
                                </Grid>
                                <Grid container item xs={4}>
                                    <TextField
                                        margin="dense"
                                        label="Segundos"
                                        type="number"
                                        value={form.segundos}
                                        onChange={(e) => onChange(e.target.value, 'segundos')}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="primary">
                            Cancelar
                         </Button>
                        <Button onClick={handleUpdate ? onUpdate : onSave} color="primary">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <div style={{ width: '100%', marginTop: '65px' }}>
                <MaterialTable
                    columns={columnsTask}
                    data={tareas}
                    title="mis tareas"
                    isLoading={loading}
                    totalCount={pagination.totalPages}
                    page={pagination.page - 1}
                    options={{
                        showTitle: false,
                        actionsColumnIndex: -1,
                        showTextRowsSelected: false
                    }}
                    localization={{
                        header: { actions: 'Acciones' },
                        pagination: {
                            firstTooltip: 'Primera página',
                            lastTooltip: 'Última página',
                            previousTooltip: 'Página anterior',
                            nextTooltip: 'Página siguiente',
                        },
                        toolbar: {
                            searchPlaceholder: 'Buscar tarea'
                        }
                    }}
                    actions={[
                        {
                            icon: 'play_circle_outline',
                            tooltip: 'Iniciar tarea',
                            onClick: (e, rowData) => { console.log(rowData) }
                        },
                        {
                            icon: 'stop',
                            tooltip: 'Finalizar tarea',
                            onClick: (e, rowData) => { console.log(rowData) }
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Editar tarea',
                            onClick: (e, rowData) => { handleOpenUpdate(rowData as Tarea) }
                        },
                        {
                            icon: 'delete_outline',
                            tooltip: 'Eliminar tarea',
                            onClick: (e, rowData) => { onDelete(rowData as Tarea) }
                        },
                    ]}
                    onChangePage={async (page, pageNumber) => { await onPage(page + 1, pageNumber) }}
                />
            </div>
        </div >
    )
}

export default HomeScreen;