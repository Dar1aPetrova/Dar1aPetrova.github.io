class Form extends React.Component{
	constructor(props){
		super(props);
	};

	render(){
		return (
			<form onSubmit={this.props.onSubmit} className={"newTask-form "+this.props.className}>
				<label>Название задачи: <input name="title" value={this.props.title} required/></label><br/>
				<label>Описание задачи: <input name="description" value={this.props.description}/></label> <br/>
				<label>Важность задачи: <select name="importance" value={this.props.importance}> 
					<option value="usual" defaultValue>Обычная</option>
					<option value="high">Важная</option>
					<option value="highest">Очень важная</option>
				</select></label><br/>
				<label>Cрок исполнения: <input type="date" name="deadline" value={this.props.deadline}/></label> <br/>
				<button type="submit">Добавить</button>
			</form>
		);
	}
}

class Filter extends React.Component{
	constructor(props){
		super(props);

		this.state = {filter: 'all'};
	};

	handleClick = (event)=>{
		let value = event.target.value;
		this.setState({filter:value}, ()=> this.props.onClick(value));
	}

	render(){
		return (
			<form className="filter-importance" onClick={this.handleClick}>
			<fieldset name='filter'>
				<legend>Отфильтровать по важности:</legend>
				<input type="radio" name="filter" id='all' value='all' defaultChecked/>
					<label htmlFor="all"> Все </label> <br/>
				<input type="radio" name="filter" id='highest' value='highest'/>
					<label htmlFor='highest'> Очень важные </label><br/>
				<input type="radio" name="filter" id='high' value='high'/>
					<label htmlFor='high'> Важные </label><br/>
				<input type="radio" name="filter" id='usual' value='usual'/>
					<label htmlFor='usual'> Обычные </label><br/>
			</fieldset>
			</form>
		);
	}
}

function TodoList (props) { 
	return (
		<li key={props.index} className={props.className}>
			<div className="task">
				<img className="remove"
					 onClick={props.removeTodo}
					 src="plus.png" 
				/>
				<div onClick={props.completeTodo}>
				<div className="title">{props.title}</div>
				<div className= "deadline">{props.deadline}</div>
				<div className="description">{props.description}</div>
				<div className= "date">{props.date}</div>
				</div>
			</div>
			</li>
	);
}; 

class TodoApp extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			todos: props.tasks,
			form : { visible: false },
			filter : { filterClass: "all" }
			}
	};

	addTodo = (event) => { 
		event.preventDefault();
		const appState = this.state;
		let index = event.target.elements.importance.selectedIndex;

		let newTask = {
						title: event.target.elements.title.value,
						description: event.target.elements.description.value,
						importance: event.target.elements.importance.options[index].value,
						deadline: event.target.elements.deadline.value,
						complete: false,
						date: ""
					  };
		appState.todos.push(newTask);
		event.target.reset();
		
		this.setState({appState});
		this.updateLocalStorage(appState.todos);
		};

	showForm = (event) =>{
		event.target.classList.toggle("show-form-btn-active");
		let formState = this.state.form;
		formState.visible = !formState.visible;
		this.setState({formState});
	};

	completeTodo(index){
		let todos = this.state.todos;
		let complete = todos[index].complete;
		let date = new Date();
		date = date.getFullYear()+"-"+(+date.getMonth() +1)+"-"+date.getDate();

		todos[index].complete = !complete;
		if(todos[index].complete) todos[index].date = date;
		else todos[index].date = "";
		
		this.setState({todos});
		this.updateLocalStorage(todos);
	}

	removeTodo(index){
		let todos = this.state.todos;
		todos.splice(index,1);
		this.setState({todos});
		this.updateLocalStorage(todos);
	}

	updateFilter(filterClass)
	{
		let filterState = this.state.filter;
		filterState.filterClass = filterClass;		
		this.setState({filterState});
	}

	updateLocalStorage(updatedTasks){
		localStorage.setItem('storedTasks', JSON.stringify(updatedTasks));
	}

	render(){
		return (
			<div className="app">
			<nav>
				<Filter onClick = {this.updateFilter.bind(this)} /> 
			<div className="back-to-top" onClick={()=> window.scrollTo(0,0)}>
				<img src="up.png"/>
			</div>
			</nav>
			<div className="tasks-list">
			<ol>
				{
					this.state.todos.map((todo, index) =>{
						const complete = todo.complete ? "complete-task" : "";

						let deadline = showDate("закончить до ", todo.deadline);
						let date = showDate("сделано ", todo.date);
		
						let filterImportance = 
								(todo.importance == this.state.filter.filterClass || this.state.filter.filterClass=="all")
								 ? todo.importance :  todo.importance +" hidden-task";
						let className = complete + " " +filterImportance;

						const dateNow = new Date();
						(dateNow >  new Date(todo.deadline) && !complete) ? className+=" failed-task" : className+="";
						
						return <TodoList 
										key={index} 
										title = {todo.title} 
										description = {todo.description}
										className = {className}
										deadline = {deadline}
										date={date}
										completeTodo = {this.completeTodo.bind(this,index)}
										removeTodo = {this.removeTodo.bind(this,index)}
										/>
					})
				}
			</ol> 

			<img className="show-form-btn" src="plus.png" onClick={this.showForm}/> 
				{this.state.form.visible ? < Form onSubmit={this.addTodo} className= "visible" /> : < Form onSubmit={this.addTodo} className= "" />}
			</div>
		</div>
		);
	}//-----
}



function showDate(text,dateStr)
{
	let date;
	if(dateStr)
	{
		date= new Date(dateStr);
		date = text + date.getFullYear()+"-"+(+date.getMonth()+1)+"-"+date.getDate();
	}
	else date="";
	return date;
}
var tasksList = [{
				title: "Начать",
				description: "Начать работу",
				importance: "highest",
				deadline: "2018,3,10",
				complete: true,
				date: "2018,3,15"
			},
			{
				title: "Продолжить",
				description: "Работать, работать и ещё раз работать",
				importance: "usual",
				deadline: "",
				complete: false,
				date: ""
			},
			{
				title: "Закончить",
				description: "Закончить работу",
				importance: "high",
				deadline: "2018,4,10",
				complete: false,
				date: ""
			}];

var tasks = localStorage.getItem('storedTasks');
if(tasks){
	tasksList = JSON.parse(tasks);
}

ReactDOM.render(<TodoApp tasks={tasksList}/>, document.getElementById("root"));


// кнопка наверх


var btnTop = document.getElementsByClassName("back-to-top")[0];
window.onscroll= function(){
	btnTop.style.visibility = "visible";
	if (pageYOffset<20) {btnTop.style.visibility = "hidden";}
}
