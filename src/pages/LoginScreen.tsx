import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useForm } from '../hooks/useForm';
import { useDispatch } from 'react-redux';
import { Login } from '../actions/auth';
import { useStylesLogin } from '../styles/stylesLogin';

const LoginScreen = () => {

    const classes = useStylesLogin();

    const initialForm = {
        email: '',
        password: '',
    }

    const dispatch = useDispatch();

    const { email, password, onChange } = useForm(initialForm);

    const onLogin = (e: any) => {
        e.preventDefault();
        dispatch(Login(email, password));
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Iniciar Sesión
                </Typography>
                <form className={classes.form} noValidate onSubmit={onLogin}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => onChange(e.target.value, 'email')}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => onChange(e.target.value, 'password')}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={onLogin}
                    >
                        <Link to='/' className={classes.subtitle}>Entrar</Link>
                    </Button>
                    <Grid container>
                        <Grid item xs></Grid>
                        <Grid item>
                            <Link to="/register" >
                                ¿No tienes cuenta? Registrarse
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}

export default LoginScreen;
