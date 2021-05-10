import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import LoginScreen from '../pages/LoginScreen';
import HomeScreen from '../pages/HomeScreen';
import NavBar from '../components/NavBar';

const AppRouter = () => {
    return (
        <Router>
            <NavBar/>
            <div>
                <Switch>
                    <Route exact path='/' component={HomeScreen} />
                    <Route exact path='/login' component={LoginScreen} />
                </Switch>
            </div>
        </Router>
    )
}

export default AppRouter
