import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ExamplePage from './pages/ExamplePage';
import ExampleComponent from './components/ExampleComponent';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={ExamplePage} />
                <Route path="/example" component={ExampleComponent} />
            </Switch>
        </Router>
    );
};

export default App;