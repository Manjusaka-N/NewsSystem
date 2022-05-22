import IndexRouter from './components/router/indexRouter'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <div style={{ height: '100%' }}>
                    <IndexRouter />
                </div>
            </PersistGate>
        </Provider>
    )
}
