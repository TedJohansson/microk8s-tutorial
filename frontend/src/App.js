import React from 'react';
import Todos from "./components/Todos";
import CreateTodo from "./components/CreateTodo";
import './App.css';

class App extends React.Component {
    
    render() {
        return (
            <div className="App container">
		<Todos/>
		<CreateTodo/>
            </div>
        );
    }
}

export default App;
