import React from "react";

class CreateTodo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: '',
            errors: {
                activity: ''
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
    
        switch (name) {
        case 'activity': 
            errors.activity = 
            value.length < 3
                ? 'Activity has to be 3 characters long'
                : '';
            break;
        default:
            break;
        }
    
        this.setState({errors, [name]: value}, ()=> {
            console.log(errors)
        })
    }

    createTodo() {
        let url = '/todo';
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        let req = new Request(url, {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            credentials: 'same-origin',
            body: JSON.stringify({ activity: this.state.activity})
        });

        fetch(req)
        .then(response => {
            console.log(response)
            return response.json()})
        .then(json => {
            window.location.reload(false);
        });
    }

    handleSubmit = (event) => {
        const validateForm = (errors) => {
            let valid = true;
            Object.values(errors).forEach(
              // if we have an error string set valid to false
              (val) => val.length > 0 && (valid = false)
            );
            return valid;
        }
        event.preventDefault();
        if(validateForm(this.state.errors)) {
            console.info('Valid Form')
            this.createTodo()
        }else{
            console.error('Invalid Form')
        }
    }

    render() {
        return (
  	<div>
          <form className="pt-2" onSubmit={this.handleSubmit}>
	    <div className="row">
              <div className="col-md-9">
                  <input type="text" className="form-control input-lg" name="activity" id="activity" value={this.state.activity} onChange={this.handleChange} placeholder="Enter Activity" autoFocus></input>
              </div>
              <input type="submit" value="Submit" className="btn btn-primary col-md-2"/>
            </div>
          </form>
          <small id="passwordHelp" className="text-danger">
              {this.state.errors.activity}
          </small>
	</div>
        );
    }
}

export default CreateTodo;
