import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useDispatch } from 'react-redux';
import { useForm } from '../hooks/useForm';
import { Register } from '../actions/auth';
import { Usuario } from '../interfaces/usuario';
import { useStylesRegister } from '../styles/stylesRegister';
import { successMessage } from '../functions/Swal';

const RegisterScreen = () => {

    const classes = useStylesRegister();

    const initialForm: Usuario = {
        _id: '',
        nombre: '',
        apePat: '',
        apeMat: '',
        correo: '',
        contrasena: '',
    }

    const dispatch = useDispatch();

    const { form, onChange } = useForm(initialForm);

    const onRegister = (e: any) => {
        e.preventDefault();
        dispatch(Register(form));
        successMessage('Registro correcto...');
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Registrarse
                </Typography>
                <form className={classes.form} noValidate onSubmit={onRegister}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Nombre(s)"
                                name="nombre"
                                autoComplete="name"
                                onChange={(e) => onChange(e.target.value, 'nombre')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="apePat"
                                variant="outlined"
                                required
                                fullWidth
                                id="ApePat"
                                label="Apéllido Paterno"
                                autoFocus
                                onChange={(e) => onChange(e.target.value, 'apePat')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Apéllido Materno"
                                name="apeMat"
                                autoComplete="lname"
                                onChange={(e) => onChange(e.target.value, 'apeMat')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="correo"
                                autoComplete="email"
                                onChange={(e) => onChange(e.target.value, 'correo')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="contrasena"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => onChange(e.target.value, 'contrasena')}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={onRegister}
                    >
                        Registrarse
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/login">
                                Ya tengo una cuenta, iniciar sesión
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}

export default RegisterScreen;
