import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../actions/auth';
import { useStylesNabvar } from '../styles/stylesNavbar';

const NavBar = () => {

    const auth = useSelector((state: any) => state);
    const status = auth.auth.status;
    const classes = useStylesNabvar();
    const dispatch = useDispatch();

    const onLogout = (e: any) => {
        dispatch(Logout());        
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {status === 'authenticated' && <Typography variant="h6" className={classes.title}>
                        <Link to='/' className={classes.subtitle}>Home</Link>
                    </Typography>}
                    {status === 'not-authenticated' && <Button color="inherit"><Link to='/login' className={classes.subtitle}>Login</Link></Button>}
                    {status === 'authenticated' && <IconButton color="default" onClick={onLogout}><Link to='/login' className={classes.subtitle}> <ExitToAppOutlinedIcon /></Link></IconButton>}
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar
