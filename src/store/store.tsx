import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from '../reducers/rootReducer';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Se crea el store donde se manejara el estado global de la aplicacion utilizando redux
export const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware( thunk )
    )
)