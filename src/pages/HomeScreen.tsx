import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel, makeStyles, Theme, createStyles } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MaterialTable from 'material-table';
import { useForm } from '../hooks/useForm';
import { useTask } from '../hooks/useTask';
import Tarea from '../interfaces/tarea';
import { columnsTask } from '../types/types';
import { prepareDataTask } from '../functions/prepareDataTask';
import { confirmDialg } from '../functions/Swal';

const HomeScreen = () => {

    const initialFilters = {
        page: 1,
        pageNumber: 5,
        totalDocs: 0,
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

    const [completeTasks, setCompleteTasks] = useState(false);
    const [openSelect, setOpenSelect] = useState(false);
    const [duration, setDuration] = useState<string | number>('');
    const [selectedDate, setDateChange] = useState(new Date());
    const [filters, setFilters] = useState(initialFilters);
    const [handleUpdate, setHandleUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const { form, onChange } = useForm(initialForm);
    const { getByUser, create, update, Delete } = useTask();

    const classes = useStyles();

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
                setFilters({
                    page: resp.pagination?.page,
                    pageNumber: resp.pagination?.limit,
                    totalDocs: resp.pagination?.totalDocs,
                    estado,
                    duracion,
                });
            }
        } else {
            setTareas([]);
            setFilters({ ...initialFilters, pageNumber: limit, estado, duracion });
        }
        setLoading(false);
    }

    const handleChangeSwitch = () => {
        setCompleteTasks(!completeTasks);
        const { pageNumber, duracion } = filters;
        if (!completeTasks) {
            loadData(1, pageNumber, 3, duracion);
        } else {
            loadData(1, pageNumber, 0, duracion);
        }
    };

    const handleClickOpen = () => {
        form.nombre = '';
        form.descripcion = '';
        form.horas = 0;
        form.minutos = 0;
        form.segundos = 0;

        const duration = `${form.horas}:${form.minutos}:${form.segundos}`;
        setDateChange(new Date(`2021/05/20 ${duration}`));

        setOpen(true);
        setHandleUpdate(false);
    };

    const handleOpenUpdate = (rowData: Tarea) => {
        setOpen(true);
        setHandleUpdate(true);
        form._id = rowData._id!;
        form.nombre = rowData.nombre;
        form.descripcion = rowData.descripcion;
        form.horas = rowData.horas;
        form.minutos = rowData.minutos;
        form.segundos = rowData.segundos;

        const duration = `${form.horas}:${form.minutos}:${form.segundos}`;
        setDateChange(new Date(`2021/05/20 ${duration}`));
    }

    const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        const duration = event.target.value as number;
        setDuration(duration);
        const { pageNumber, estado } = filters;
        loadData(1, pageNumber, estado, duration);
    };

    const onPage = async (page: number, pageNumber: number) => {
        const { estado, duracion } = filters;
        loadData(page, pageNumber, estado, duracion);
    }

    const onSave = async (e: any) => {
        const { page, pageNumber, estado, duracion } = filters;        
        form.horas = selectedDate.getHours();
        form.minutos = selectedDate.getMinutes();
        form.segundos = selectedDate.getSeconds();      
         
        setOpen(false);
        e.preventDefault();
        await create(form);
        await loadData(page, pageNumber, estado, duracion);
    }

    const onUpdate = async (e: any) => {
        const { page, pageNumber, estado, duracion } = filters;
        form.horas = selectedDate.getHours();
        form.minutos = selectedDate.getMinutes();
        form.segundos = selectedDate.getSeconds();

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

            <FormControlLabel
                control={<Switch checked={completeTasks} onChange={handleChangeSwitch} color="primary" />}
                label="Tareas completadas"
            />
            <FormControl className={classes.formControl}>
                <InputLabel id="duration-label">Duración</InputLabel>
                <Select
                    labelId="duration-label"
                    open={openSelect}
                    onClose={() => setOpenSelect(false)}
                    onOpen={() => setOpenSelect(true)}
                    value={duration}
                    onChange={handleChangeSelect}
                >
                    <MenuItem value={0}>Todos</MenuItem>
                    <MenuItem value={1}>hasta 30 min</MenuItem>
                    <MenuItem value={2}>de 30 min a 1h</MenuItem>
                    <MenuItem value={3}>mayor a 1h</MenuItem>
                </Select>
            </FormControl>
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
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    style={{ marginTop: '6px' }}
                                    ampm={false}
                                    openTo="hours"
                                    views={["hours", "minutes", "seconds"]}
                                    format="HH:mm:ss"
                                    label="Duración"
                                    value={selectedDate}
                                    onChange={setDateChange}
                                />
                            </MuiPickersUtilsProvider>
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

            <div style={{ width: '100%', marginTop: '20px' }}>
                <MaterialTable
                    columns={columnsTask}
                    data={tareas}
                    title="mis tareas"
                    isLoading={loading}
                    totalCount={filters.totalDocs}
                    page={filters.page - 1}
                    options={{
                        showTitle: false,
                        actionsColumnIndex: -1,
                        showTextRowsSelected: false,
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
                        },
                        body: {
                            emptyDataSourceMessage: 'No hay tareas registradas',
                        },
                    }}
                    actions={[
                        rowData => ({
                            icon: 'play_circle_outline',
                            tooltip: 'Iniciar tarea',
                            position: 'auto',
                            onClick: (e, rowData) => { console.log(rowData) },
                            hidden: rowData.estado! > 0
                        }),
                        rowData => ({
                            icon: 'stop',
                            tooltip: 'Finalizar tarea',
                            position: 'auto',
                            onClick: (e, rowData) => { console.log(rowData) },
                            hidden: rowData.estado! > 0
                        }),
                        {
                            icon: 'edit',
                            tooltip: 'Editar tarea',
                            position: 'auto',
                            onClick: (e, rowData) => { handleOpenUpdate(rowData as Tarea) }
                        },
                        {
                            icon: 'delete_outline',
                            tooltip: 'Eliminar tarea',
                            position: 'row',
                            onClick: (e, rowData) => { onDelete(rowData as Tarea) }
                        },
                        {
                            icon: 'add',
                            tooltip: 'Agregar tarea',
                            isFreeAction: true,
                            onClick: () => { handleClickOpen() }
                        }
                    ]}
                    onChangePage={async (page, pageNumber) => { await onPage(page + 1, pageNumber) }}
                />
            </div>
        </div >
    )
}

export default HomeScreen;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            marginTop: -8
        },
    }),
);