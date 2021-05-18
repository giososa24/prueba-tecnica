import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginScreen from '../pages/LoginScreen';
import HomeScreen from '../pages/HomeScreen';
import NavBar from '../components/NavBar';
import RegisterScreen from '../pages/RegisterScreen';
import { useEffect } from 'react';
import { CheckAuth } from '../actions/auth';


const AppRouter = () => {

    const auth = useSelector((state: any) => state);          

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(CheckAuth());
    }, [dispatch]);

    if (auth.auth.status === 'not-authenticated') {
        return (
            <Router>
                <NavBar />
                <div>
                    <Switch>
                        <Route exact path='/login' component={LoginScreen} />
                        <Route exact path='/register' component={RegisterScreen} />
                    </Switch>
                </div>
            </Router>
        )
    } else {
        return (
            <Router>
                <NavBar />
                <div>
                    <Switch>
                        <Route exact path='/' component={HomeScreen} />
                    </Switch>
                </div>
            </Router>
        )
    }


}

export default AppRouter
