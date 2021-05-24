import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Fab, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BarChartIcon from '@material-ui/icons/BarChart';
import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { VictoryPie, VictoryTheme } from 'victory';
import MaterialTable from 'material-table';
import { useForm } from '../hooks/useForm';
import { useTask } from '../hooks/useTask';
import Tarea from '../interfaces/tarea';
import { columnsTask } from '../types/types';
import { prepareDataTask } from '../functions/prepareDataTask';
import { confirmDialg, errorMessage, successMessage } from '../functions/Swal';
import moment from 'moment';
import { useStylesHome } from '../styles/stylesHome';
import Timer from '../components/Timer';

//Dentro de esta pagina se renderizan todos los componentes a mostrar con los cuales el usuario interactua
//Como es la grafica, la tabla de datos, y el temporizador

const HomeScreen = () => {

    const initialFilters = {
        page: 1,
        pageNumber: 10,
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
        segundos: 0,
    }

    //Aqui se utilizan todos lo hooks necesarios para que la aplicacion funcione, 
    const [completeTasks, setCompleteTasks] = useState(false);
    const [establishedDuration, setEstablishedDuration] = useState(false);
    const [openSelect, setOpenSelect] = useState(false);
    const [openSelectDuration, setOpenSelectDuration] = useState(false);
    const [duration, setDuration] = useState<string | number>('');
    const [durationEstablished, setDurationEstablished] = useState(0);
    const [selectedDate, setDateChange] = useState(new Date());
    const [selectDateStart, setSelectDateStart] = useState(new Date());
    const [selectDateEnd, setSelectDateEnd] = useState(new Date());
    const [currentTask, setCurrentTask] = useState({});
    const [filters, setFilters] = useState(initialFilters);
    const [handleUpdate, setHandleUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [openChart, setOpenChart] = useState(false)
    const [loading, setLoading] = useState(false);
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const { form, onChange } = useForm(initialForm);
    const [tasksByWeek, setTasksByWeek] = useState<any>(null);
    const { getByUser, create, createRandom, update, changeState, Delete, filterByWeek } = useTask();
    const [finishTask, setFinishTask] = useState(false);
    const [pauseTimer, setPauseTimer] = useState(true);

    const classes = useStylesHome();

    //Este hook sirve para cargar la informacion cuando se inicia el componente
    useEffect(() => {
        const { page, pageNumber, estado, duracion } = filters;
        loadData(page, pageNumber, estado, duracion);
    }, []);

    //Esta funcion sirve para cargar la informacion de tareas
    const loadData = async (page: number, limit: number, estado: number, duracion: number) => {
        setLoading(true);
        const resp = await getByUser(page, limit, estado, duracion);
        if (resp && resp.data) {
            setTareas(prepareDataTask(resp.data));
            const taskCurrent = resp.data.filter(x => x.estado === 0);

            if (taskCurrent.length > 0) {
                setCurrentTask(taskCurrent[0]);
            }

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

    const refreshData = () => {
        const { page, pageNumber, estado, duracion } = filters;
        loadData(page, pageNumber, estado, duracion);
    }

    //Esta funcion se utiliza para obtener las tareas finalizadas
    const handleChangeSwitch = () => {
        setCompleteTasks(!completeTasks);
        const { pageNumber, duracion } = filters;
        if (!completeTasks) {
            loadData(1, pageNumber, 3, duracion);
        } else {
            loadData(1, pageNumber, 0, duracion);
        }
    };

    //Esta funcion sirve para abrir el modal y agregar una tarea nueva
    const handleClickOpen = () => {
        form.nombre = '';
        form.descripcion = '';
        form.horas = 0;
        form.minutos = 0;
        form.segundos = 0;

        setOpen(true);
        setHandleUpdate(false);
        handleChangeDate();
    };

    //Con esta funcion se abre el modal y se le pasa la informacion de la tarea a actualizar
    const handleOpenUpdate = (rowData: Tarea) => {
        setOpen(true);
        setHandleUpdate(true);
        form._id = rowData._id!;
        form.nombre = rowData.nombre;
        form.descripcion = rowData.descripcion;
        form.horas = rowData.horas;
        form.minutos = rowData.minutos;
        form.segundos = rowData.segundos;
        handleChangeDate();
    }

    const handleChangeDate = () => {
        const duration = `${form.horas}:${form.minutos}:${form.segundos}`;
        setDateChange(new Date(`2021/05/20 ${duration}`));
    }

    //Con esta funcion se cambia el filtro para obtener tareas por su duracion
    const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        const duration = event.target.value as number;
        setDuration(duration);
        const { pageNumber, estado } = filters;
        loadData(1, pageNumber, estado, duration);
    };

    //Esta funcion sirve para cambiar de pagina
    const onPage = async (page: number, pageNumber: number) => {
        const { estado, duracion } = filters;
        loadData(page, pageNumber, estado, duracion);
    }

    //Con esta funcion se guarda una nueva tarea
    const onSave = async (e: any) => {
        const { page, pageNumber, estado, duracion } = filters;
        setDurationSave();

        setOpen(false);
        e.preventDefault();
        await create(form);
        await loadData(page, pageNumber, estado, duracion);
    }

    //Con esta funcion se guardan 50 tareas aleatorias
    const onSaveRandom = async () => {
        const { page, pageNumber, estado, duracion } = filters;

        if (await confirmDialg('¡Agregarás 50 tareas!', 'Sí, agregar')) {
            await createRandom();
            await loadData(page, pageNumber, estado, duracion);
        }
    }

    //Con esta funcion se filtran las tareas por fecha y se muestra una grafica de pastel con la produccion por dia
    const onFilterTask = async () => {
        const fechaInicial = Date.parse(moment(selectDateStart).format());
        const fechaFinal = Date.parse(moment(selectDateEnd).format());
        if (fechaInicial > fechaFinal) {
            errorMessage('La fecha inicial no puede ser mayor a la final');
        } else if (fechaInicial === fechaFinal) {
            errorMessage('La fechas no pueden ser iguales')
        } else {
            const tasksByWeek = await filterByWeek(fechaInicial, fechaFinal);
            setTasksByWeek(tasksByWeek);
        }
    }

    ////Con esta funcion se establece la duracion dependiendo si es larga, media o corta
    const setDurationSave = () => {
        if (!establishedDuration) {
            form.horas = selectedDate.getHours();
            form.minutos = selectedDate.getMinutes();
            form.segundos = selectedDate.getSeconds();
        } else {
            form.segundos = 0;
            form.horas = 0;
            form.minutos = 0;
            if (durationEstablished === 0) {
                form.minutos = 30;
            }
            if (durationEstablished === 1) {
                form.minutos = 45;
            }
            if (durationEstablished === 2) {
                form.horas = 1;
            }
        }
    }

    //Esta funcion llama la accion para actualizar la tarea
    const onUpdate = async (e: any) => {
        const { page, pageNumber, estado, duracion } = filters;
        setDurationSave();

        setOpen(false);
        e.preventDefault();
        await update(form);
        await loadData(page, pageNumber, estado, duracion);
    }

    //Con esta funcion se finaliza una tarea
    const onFinishTask = () => {
        const title = '¡Estás seguro de finalizar esta tarea!';
        const confirmTitle = 'Sí, finalizar';
        confirmDialg(title, confirmTitle).then((result) => {
            if (result) {
                setFinishTask(true);
            }
        });
    }

    //Con esta funcion se cambia el estado de una tarea
    const onChangeState = async (state: number, tarea: Tarea) => {
        const { page, pageNumber, estado, duracion } = filters;
        let title: string = '';
        let confirmTitle: string = '';

        if (state === 0) {
            title = '¡Estás seguro de iniciar esta tarea!';
            confirmTitle = 'Sí, iniciar';
            tarea.estado = 0;
            setFinishTask(false);
        }

        if (await confirmDialg(title, confirmTitle)) {
            setCurrentTask(tarea);
            await changeState(tarea);
            await loadData(page, pageNumber, estado, duracion);
        }

    }

    //Con esta funcion se elimina una tarea
    const onDelete = async (rowData: Tarea) => {
        const { page, pageNumber, estado, duracion } = filters;

        if (await confirmDialg('¡Eliminarás la tarea seleccionada!', 'Sí, eliminar')) {
            await Delete(rowData._id!);
            await loadData(page, pageNumber, estado, duracion);
        }
    }

    //Con esta funcion se pausa el temporizador
    const onPause = () => {
        setPauseTimer(!pauseTimer);
        if (pauseTimer) {
            successMessage('Tarea pausada');
        }
        if (!pauseTimer) {
            successMessage('Tarea reanudada');
        }
    }

    return (
        <div style={{ padding: '3em' }}>
            <div style={{ float: 'left', position: 'fixed', zIndex: 1000, left: '73.5%', top: '77px' }}>
                <Timer currentTask={currentTask as Tarea}
                    loadData={refreshData}
                    finishTask={finishTask}
                    pause={pauseTimer}
                />
            </div>
            <Grid container spacing={3} justify="flex-end">
                <Grid item xs={4}>
                    <h1>Mis tareas</h1>
                </Grid>
                <Grid item xs={4}>
                    <Fab
                        variant="extended"
                        size="small"
                        color="primary"
                        style={{ float: 'right' }}
                        onClick={() => setOpenChart(true)}
                    >
                        <BarChartIcon /> Historial
                    </Fab>
                </Grid>
                <Grid item xs={4}>
                    <Fab
                        variant="extended"
                        size="small"
                        color="primary"
                        style={{ float: 'right' }}
                        onClick={onSaveRandom}
                    >
                        <AddIcon /> 50 tareas
                    </Fab>
                </Grid>
            </Grid>

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
                <Dialog open={openChart} fullWidth onClose={() => setOpenChart(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Historial</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        label="Fecha inicial"
                                        value={selectDateStart}
                                        onChange={date => setSelectDateStart(date)}
                                        format="dd/MM/yyyy"
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={4}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        label="Fecha final"
                                        value={selectDateEnd}
                                        onChange={date => setSelectDateEnd(date)}
                                        format="dd/MM/yyyy"
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={4}>
                                <Fab
                                    variant="extended"
                                    size="small"
                                    color="primary"
                                    style={{ marginTop: '12px' }}
                                    onClick={onFilterTask}
                                >
                                    <AddIcon /> Filtrar
                                </Fab>
                            </Grid>
                            {tasksByWeek && <Grid item xs={12}>
                                <div style={{ width: '500px', height: '400px' }}>
                                    <VictoryPie
                                        data={tasksByWeek.resp}
                                        animate={{ duration: 2000 }}
                                        colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
                                        theme={VictoryTheme.material}
                                        labels={({ datum }) => `${datum.x}: ${datum.y}`}
                                    />
                                </div>
                            </Grid>}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenChart(false)} color="primary">
                            Cerrar
                         </Button>
                    </DialogActions>
                </Dialog>
            </div>
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
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        control={<Switch checked={establishedDuration} onChange={() => { setEstablishedDuration(!establishedDuration) }} color="primary" />}
                                        label="¿Duración predeterminada?"
                                        style={{ marginTop: '10px' }}
                                    />
                                </Grid>
                                <Grid item xs={6} hidden={establishedDuration}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <TimePicker
                                            style={{ marginTop: '4px' }}
                                            ampm={false}
                                            openTo="hours"
                                            views={["hours", "minutes", "seconds"]}
                                            format="HH:mm:ss"
                                            label="Duración"
                                            value={selectedDate}
                                            onChange={setDateChange}
                                            hidden={true}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={6} hidden={!establishedDuration}>
                                    <FormControl className={classes.formControl} style={{ marginTop: '5px' }}>
                                        <InputLabel id="duration-label">Duración</InputLabel>
                                        <Select
                                            labelId="duration-label"
                                            open={openSelectDuration}
                                            onClose={() => setOpenSelectDuration(false)}
                                            onOpen={() => setOpenSelectDuration(true)}
                                            value={durationEstablished}
                                            onChange={(e) => { setDurationEstablished(e.target.value as number) }}
                                        >
                                            <MenuItem value={0}>Corta: 30 min.</MenuItem>
                                            <MenuItem value={1}>Media 45 min.</MenuItem>
                                            <MenuItem value={2}>Larga: 1h.</MenuItem>
                                        </Select>
                                    </FormControl>
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
                        pageSize: filters.pageNumber,
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
                            onClick: () => { onChangeState(0, rowData as Tarea) },
                            hidden: rowData.estado! === 0 || rowData.estado! === 3,
                            iconProps: { style: { color: '#2655FF' } }
                        }),
                        rowData => ({
                            icon: 'stop',
                            tooltip: 'Finalizar tarea',
                            position: 'auto',
                            onClick: () => onFinishTask(),
                            hidden: rowData.estado! !== 0,
                        }),
                        rowData => ({
                            icon: 'pause_circle',
                            tooltip: 'Pausar tarea',
                            position: 'auto',
                            onClick: () => onPause(),
                            hidden: rowData.estado! !== 0,
                            iconProps: { style: { color: '#3870E0' } }
                        }),
                        {
                            icon: 'edit',
                            tooltip: 'Editar tarea',
                            position: 'auto',
                            onClick: (e, rowData) => { handleOpenUpdate(rowData as Tarea) },
                            iconProps: { style: { color: '#E09643' } }
                        },
                        {
                            icon: 'delete_outline',
                            tooltip: 'Eliminar tarea',
                            position: 'row',
                            onClick: (e, rowData) => { onDelete(rowData as Tarea) },
                            iconProps: { style: { color: 'red' } }
                        },
                        {
                            icon: 'add',
                            tooltip: 'Agregar tarea',
                            isFreeAction: true,
                            onClick: () => { handleClickOpen() },
                            iconProps: { style: { color: '#17E021' } }
                        }
                    ]}
                    onChangePage={async (page, pageNumber) => { await onPage(page + 1, pageNumber) }}
                />
            </div>
        </div >
    )
}

export default HomeScreen;