import React from "react";

class Todos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      todos: []
    };
  }

  deleteTodo(id) {
    let url = '/todo';
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    console.log(id);
    let req = new Request(url, {
      method: 'DELETE',
      headers: headers,
      mode: 'cors',
      body: JSON.stringify({ activity_id: id})
    });
    fetch(req)
    .then(response => response.json())
    .then(json => {
	    console.log(json);
	    window.location.reload(false);
    });
  }
  

  getTodos() {
    return this.state.todos.map(
      (todo, index) => (<li className="list-group-item" key={index}>
                     <span className="float-left">{todo.activity}</span>
                     <button className="btn btn-danger float-right" onClick={e => this.deleteTodo(todo._id.$oid)}>Delete</button>
                   </li>)
    );
  }

  componentDidMount() {
    let url = '/todos';
    let headers = new Headers();
    headers.append('Accept', 'application/json');

    let req = new Request(url, {
      method: 'GET',
      headers: headers
    });

    fetch(req)
    .then(response => response.json())
    .then(json => {
        this.setState({
            isLoaded: true,
            todos: json.todos
        });
    });
  }

  render() {
    const { error, isLoaded, todos } = this.state;
    if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
	<ul className="list-group">{this.getTodos()}</ul>
      );
    }
  }
}

export default Todos;
